import fs from 'fs';
import path from 'path';

interface ScanResult {
    detected: boolean;
    violations: Violation[];
    summary: string;
}

interface Violation {
    type: string;
    file: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    matches: string[];
}

// Suspicious packages for JavaScript/Node.js
const SUSPICIOUS_NPM_PACKAGES = {
    critical: [
        'discord.js-selfbot-v13',
        'discord-selfbot',
        'selfbot',
        'token-logger',
        'discord-token-logger',
        'malicious-discord',
    ],
    high: ['discord.py-self', 'discordselfbot', 'nuker-bot', 'token-stealer', 'keylogger', 'password-stealer'],
};

// Suspicious packages for Python
const SUSPICIOUS_PY_PACKAGES = {
    critical: ['discord-selfbot', 'discord.py-self', 'selfbotpy'],
    high: ['discord-nuker', 'token-grabber', 'keylogger', 'clipper', 'rat', 'stealers'],
};

// Suspicious patterns in code
const SUSPICIOUS_PATTERNS = [
    /token.*=|=.*token/i,
    /password.*logger|log.*password/i,
    /steal.*token|token.*steal/i,
    /discord.*token|token.*discord/i,
    /webhook.*logger|logger.*webhook/i,
    /exfiltrate|exfil/i,
    /keylog/i,
    /clipper/i,
    /process.*inject|inject.*process/i,
];

interface ScannerConfig {
    webhookUrl?: string;
    jexactylUrl: string;
    jexactylApiToken: string;
}

export class FileScanner {
    private serverPath: string;
    private serverId: string;
    private config: ScannerConfig;

    constructor(serverPath: string, serverId: string, config: ScannerConfig) {
        this.serverPath = serverPath;
        this.serverId = serverId;
        this.config = config;
    }

    async scanServer(): Promise<ScanResult> {
        const violations: Violation[] = [];

        // Scan for package.json files
        const packageJsonFiles = this.findFiles('package.json');
        for (const file of packageJsonFiles) {
            violations.push(...this.scanPackageJson(file));
        }

        // Scan for requirements.txt files
        const requirementsFiles = this.findFiles('requirements.txt');
        for (const file of requirementsFiles) {
            violations.push(...this.scanRequirementsTxt(file));
        }

        // Scan for setup.py files
        const setupFiles = this.findFiles('setup.py');
        for (const file of setupFiles) {
            violations.push(...this.scanSetupPy(file));
        }

        // Scan Python files for suspicious patterns
        const pythonFiles = this.findFiles(/\.py$/);
        for (const file of pythonFiles) {
            violations.push(...this.scanPythonFile(file));
        }

        // Scan JavaScript/Node files for suspicious patterns
        const jsFiles = this.findFiles(/\.(js|ts)$/);
        for (const file of jsFiles) {
            violations.push(...this.scanJavaScriptFile(file));
        }

        const detected = violations.length > 0;
        const summary = this.generateSummary(violations);

        if (detected) {
            await this.handleDetection(violations, summary);
        }

        return {
            detected,
            violations,
            summary,
        };
    }

    private async handleDetection(violations: Violation[], summary: string): Promise<void> {
        const reason = `Malicious content detected: ${summary}`;

        // Step 1: Suspend the server via Jexactyl API
        await this.suspendServer(reason);

        // Step 2: Send webhook notification
        if (this.config.webhookUrl) {
            await this.sendWebhook(violations, summary);
        }

        // Step 3: Log to Jexactyl API
        await this.logToJexactylAPI(violations, summary);
    }

    private async suspendServer(reason: string): Promise<void> {
        try {
            const response = await fetch(`${this.config.jexactylUrl}/api/client/servers/${this.serverId}/suspend`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.config.jexactylApiToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Server ${this.serverId} suspended due to malicious content`);
            } else {
                console.error(`Failed to suspend server ${this.serverId}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error suspending server ${this.serverId}:`, error);
        }
    }

    private async sendWebhook(violations: Violation[], summary: string): Promise<void> {
        if (!this.config.webhookUrl) return;

        const embed = {
            title: '🚨 Malicious Server Detected',
            description: `Server has been automatically suspended`,
            color: 0xff0000,
            fields: [
                {
                    name: 'Server ID',
                    value: this.serverId,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: summary,
                    inline: false,
                },
                {
                    name: 'Violations Found',
                    value: violations.length.toString(),
                    inline: true,
                },
                {
                    name: 'Critical Issues',
                    value: violations.filter((v) => v.severity === 'critical').length.toString(),
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
        };

        // Add top 5 violations to the embed
        const topViolations = violations.slice(0, 5);
        if (topViolations.length > 0) {
            const violationList = topViolations
                .map((v) => `**[${v.severity.toUpperCase()}]** ${v.type}\n${v.description}\nFile: \`${v.file}\``)
                .join('\n\n');

            embed.fields.push({
                name: 'Top Violations',
                value: violationList,
                inline: false,
            });
        }

        try {
            await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] }),
            });

            console.log('Webhook notification sent');
        } catch (error) {
            console.error('Failed to send webhook:', error);
        }
    }

    private async logToJexactylAPI(violations: Violation[], summary: string): Promise<void> {
        try {
            const logData = {
                serverId: this.serverId,
                reason: summary,
                detectedAt: new Date().toISOString(),
                violations: violations.map((v) => ({
                    type: v.type,
                    severity: v.severity,
                    file: v.file,
                    description: v.description,
                    matches: v.matches,
                })),
                violationCount: violations.length,
                criticalCount: violations.filter((v) => v.severity === 'critical').length,
                highCount: violations.filter((v) => v.severity === 'high').length,
            };

            const response = await fetch(
                `${this.config.jexactylUrl}/api/application/servers/${this.serverId}/violations`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.config.jexactylApiToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logData),
                }
            );

            if (response.ok) {
                console.log(`Violation logged to Jexactyl API for server ${this.serverId}`);
            } else {
                console.error(`Failed to log violation to Jexactyl API:`, response.statusText);
            }
        } catch (error) {
            console.error('Failed to log violation to Jexactyl API:', error);
        }
    }

    private findFiles(pattern: string | RegExp): string[] {
        const results: string[] = [];

        const walk = (dir: string) => {
            try {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    // Skip node_modules and common directories
                    if (['node_modules', '.git', '.env', 'venv', '__pycache__', '.venv'].includes(file)) {
                        continue;
                    }

                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        walk(fullPath);
                    } else {
                        const matches = typeof pattern === 'string' ? file === pattern : pattern.test(file);
                        if (matches) {
                            results.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Skip directories we can't read
            }
        };

        walk(this.serverPath);
        return results;
    }

    private scanPackageJson(filePath: string): Violation[] {
        const violations: Violation[] = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(content);

            const dependencies = {
                ...json.dependencies,
                ...json.devDependencies,
                ...json.optionalDependencies,
            };

            for (const [pkg, version] of Object.entries(dependencies)) {
                const pkgLower = pkg.toLowerCase();

                for (const [severity, packages] of Object.entries(SUSPICIOUS_NPM_PACKAGES)) {
                    if (packages.some((p) => pkgLower.includes(p.toLowerCase()))) {
                        violations.push({
                            type: 'suspicious_package',
                            file: filePath,
                            severity: severity as 'critical' | 'high' | 'medium' | 'low',
                            description: `Suspicious npm package detected: ${pkg}`,
                            matches: [pkg],
                        });
                    }
                }
            }
        } catch (error) {
            // Invalid JSON or file read error
        }

        return violations;
    }

    private scanRequirementsTxt(filePath: string): Violation[] {
        const violations: Violation[] = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            for (const line of lines) {
                const pkg = line.split('==')[0].split('>=')[0].split('<=')[0].trim();
                if (!pkg) continue;

                const pkgLower = pkg.toLowerCase();

                for (const [severity, packages] of Object.entries(SUSPICIOUS_PY_PACKAGES)) {
                    if (packages.some((p) => pkgLower.includes(p.toLowerCase()))) {
                        violations.push({
                            type: 'suspicious_python_package',
                            file: filePath,
                            severity: severity as 'critical' | 'high' | 'medium' | 'low',
                            description: `Suspicious Python package detected: ${pkg}`,
                            matches: [pkg],
                        });
                    }
                }
            }
        } catch (error) {
            // File read error
        }

        return violations;
    }

    private scanSetupPy(filePath: string): Violation[] {
        const violations: Violation[] = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');

            // Look for install_requires and other package lists
            const packageMatches = content.match(/['"]([\w\-]+)['"]/g) || [];

            for (const match of packageMatches) {
                const pkg = match.replace(/['"]/g, '').toLowerCase();

                for (const [severity, packages] of Object.entries(SUSPICIOUS_PY_PACKAGES)) {
                    if (packages.some((p) => pkg.includes(p.toLowerCase()))) {
                        violations.push({
                            type: 'suspicious_python_package',
                            file: filePath,
                            severity: severity as 'critical' | 'high' | 'medium' | 'low',
                            description: `Suspicious Python package in setup.py: ${pkg}`,
                            matches: [pkg],
                        });
                    }
                }
            }
        } catch (error) {
            // File read error
        }

        return violations;
    }

    private scanPythonFile(filePath: string): Violation[] {
        const violations: Violation[] = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const matches: string[] = [];

            // Check for suspicious patterns
            for (const pattern of SUSPICIOUS_PATTERNS) {
                if (pattern.test(content)) {
                    const match = content.match(pattern);
                    if (match) {
                        matches.push(match[0]);
                    }
                }
            }

            if (matches.length > 2) {
                violations.push({
                    type: 'suspicious_code_pattern',
                    file: filePath,
                    severity: 'high',
                    description: `Multiple suspicious patterns detected in Python file`,
                    matches,
                });
            }
        } catch (error) {
            // File read error
        }

        return violations;
    }

    private scanJavaScriptFile(filePath: string): Violation[] {
        const violations: Violation[] = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const matches: string[] = [];

            // Check for suspicious patterns
            for (const pattern of SUSPICIOUS_PATTERNS) {
                if (pattern.test(content)) {
                    const match = content.match(pattern);
                    if (match) {
                        matches.push(match[0]);
                    }
                }
            }

            // Check for suspicious Discord-related patterns
            const discordPatterns = [
                /client\.token|token.*client/i,
                /user\.token|token.*user/i,
                /message\.author\.token|token.*author/i,
            ];

            for (const pattern of discordPatterns) {
                if (pattern.test(content)) {
                    matches.push('Discord token access detected');
                }
            }

            if (matches.length > 1) {
                violations.push({
                    type: 'suspicious_code_pattern',
                    file: filePath,
                    severity: 'high',
                    description: `Multiple suspicious patterns detected in JavaScript file`,
                    matches,
                });
            }
        } catch (error) {
            // File read error
        }

        return violations;
    }

    private generateSummary(violations: Violation[]): string {
        if (violations.length === 0) {
            return 'No suspicious files detected';
        }

        const bySeverity = {
            critical: violations.filter((v) => v.severity === 'critical').length,
            high: violations.filter((v) => v.severity === 'high').length,
            medium: violations.filter((v) => v.severity === 'medium').length,
            low: violations.filter((v) => v.severity === 'low').length,
        };

        const parts: string[] = [];
        if (bySeverity.critical > 0) parts.push(`${bySeverity.critical} critical`);
        if (bySeverity.high > 0) parts.push(`${bySeverity.high} high`);
        if (bySeverity.medium > 0) parts.push(`${bySeverity.medium} medium`);
        if (bySeverity.low > 0) parts.push(`${bySeverity.low} low`);

        return `${violations.length} violations detected: ${parts.join(', ')}`;
    }
}

// Usage Example
// const scanner = new FileScanner(
//     '/path/to/server',
//     'server-uuid-here',
//     {
//         webhookUrl: 'https://discord.com/api/webhooks/YOUR_WEBHOOK',
//         jexactylUrl: 'https://your-jexactyl-instance.com',
//         jexactylApiToken: 'YOUR_JEXACTYL_API_TOKEN',
//     }
// );
// const result = await scanner.scanServer();
// console.log(result);
