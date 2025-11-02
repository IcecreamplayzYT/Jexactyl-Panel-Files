const fs = require('fs');
const path = require('path');

// Import the FileScanner class (you'll need to export it from FileScanner.ts)
// For now, we'll load it as a module

const serverId = process.argv[2];
const serverPath = process.argv[3];

if (!serverId || !serverPath) {
    console.error('Usage: node scan-server.js <serverId> <serverPath>');
    process.exit(1);
}

// Configuration from environment variables
const config = {
    webhookUrl: process.env.DISCORD_WEBHOOK,
    jexactylUrl: process.env.JEXACTYL_URL,
    jexactylApiToken: process.env.JEXACTYL_API_TOKEN,
};

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

function findFiles(dir, pattern) {
    const results = [];

    function walk(currentDir) {
        try {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                if (['node_modules', '.git', '.env', 'venv', '__pycache__', '.venv'].includes(file)) {
                    continue;
                }

                const fullPath = path.join(currentDir, file);
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
    }

    walk(dir);
    return results;
}

function scanPackageJson(filePath) {
    const violations = [];

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);

        const dependencies = {
            ...json.dependencies,
            ...json.devDependencies,
            ...json.optionalDependencies,
        };

        for (const [pkg, version] of Object.entries(dependencies || {})) {
            const pkgLower = pkg.toLowerCase();

            for (const [severity, packages] of Object.entries(SUSPICIOUS_NPM_PACKAGES)) {
                if (packages.some((p) => pkgLower.includes(p.toLowerCase()))) {
                    violations.push({
                        type: 'suspicious_package',
                        file: filePath,
                        severity: severity,
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

function scanRequirementsTxt(filePath) {
    const violations = [];

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
                        severity: severity,
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

function scanSetupPy(filePath) {
    const violations = [];

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const packageMatches = content.match(/['"]([\w\-]+)['"]/g) || [];

        for (const match of packageMatches) {
            const pkg = match.replace(/['"]/g, '').toLowerCase();

            for (const [severity, packages] of Object.entries(SUSPICIOUS_PY_PACKAGES)) {
                if (packages.some((p) => pkg.includes(p.toLowerCase()))) {
                    violations.push({
                        type: 'suspicious_python_package',
                        file: filePath,
                        severity: severity,
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

function scanPythonFile(filePath) {
    const violations = [];

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = [];

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
                description: 'Multiple suspicious patterns detected in Python file',
                matches,
            });
        }
    } catch (error) {
        // File read error
    }

    return violations;
}

function scanJavaScriptFile(filePath) {
    const violations = [];

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = [];

        for (const pattern of SUSPICIOUS_PATTERNS) {
            if (pattern.test(content)) {
                const match = content.match(pattern);
                if (match) {
                    matches.push(match[0]);
                }
            }
        }

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
                description: 'Multiple suspicious patterns detected in JavaScript file',
                matches,
            });
        }
    } catch (error) {
        // File read error
    }

    return violations;
}

function generateSummary(violations) {
    if (violations.length === 0) {
        return 'No suspicious files detected';
    }

    const bySeverity = {
        critical: violations.filter((v) => v.severity === 'critical').length,
        high: violations.filter((v) => v.severity === 'high').length,
        medium: violations.filter((v) => v.severity === 'medium').length,
        low: violations.filter((v) => v.severity === 'low').length,
    };

    const parts = [];
    if (bySeverity.critical > 0) parts.push(`${bySeverity.critical} critical`);
    if (bySeverity.high > 0) parts.push(`${bySeverity.high} high`);
    if (bySeverity.medium > 0) parts.push(`${bySeverity.medium} medium`);
    if (bySeverity.low > 0) parts.push(`${bySeverity.low} low`);

    return `${violations.length} violations detected: ${parts.join(', ')}`;
}

async function suspendServer(reason) {
    try {
        const response = await fetch(`${config.jexactylUrl}/api/client/servers/${serverId}/suspend`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.jexactylApiToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.error(`Server ${serverId} suspended due to malicious content`);
        } else {
            console.error(`Failed to suspend server ${serverId}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error suspending server ${serverId}: ${error.message}`);
    }
}

async function sendWebhook(violations, summary) {
    if (!config.webhookUrl) return;

    const embed = {
        title: '🚨 Malicious Server Detected',
        description: 'Server has been automatically suspended',
        color: 0xff0000,
        fields: [
            {
                name: 'Server ID',
                value: serverId,
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
        await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });

        console.error('Webhook notification sent');
    } catch (error) {
        console.error(`Failed to send webhook: ${error.message}`);
    }
}

async function logToJexactylAPI(violations, summary) {
    try {
        const logData = {
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

        const response = await fetch(`${config.jexactylUrl}/api/application/servers/${serverId}/violations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.jexactylApiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData),
        });

        if (response.ok) {
            console.error(`Violation logged to Jexactyl API for server ${serverId}`);
        } else {
            console.error(`Failed to log violation to Jexactyl API: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Failed to log violation to Jexactyl API: ${error.message}`);
    }
}

async function scanServer() {
    const violations = [];

    const packageJsonFiles = findFiles(serverPath, 'package.json');
    for (const file of packageJsonFiles) {
        violations.push(...scanPackageJson(file));
    }

    const requirementsFiles = findFiles(serverPath, 'requirements.txt');
    for (const file of requirementsFiles) {
        violations.push(...scanRequirementsTxt(file));
    }

    const setupFiles = findFiles(serverPath, 'setup.py');
    for (const file of setupFiles) {
        violations.push(...scanSetupPy(file));
    }

    const pythonFiles = findFiles(serverPath, /\.py$/);
    for (const file of pythonFiles) {
        violations.push(...scanPythonFile(file));
    }

    const jsFiles = findFiles(serverPath, /\.(js|ts)$/);
    for (const file of jsFiles) {
        violations.push(...scanJavaScriptFile(file));
    }

    const detected = violations.length > 0;
    const summary = generateSummary(violations);

    if (detected) {
        const reason = `Malicious content detected: ${summary}`;
        await suspendServer(reason);
        await sendWebhook(violations, summary);
        await logToJexactylAPI(violations, summary);
    }

    return {
        detected,
        violations,
        summary,
    };
}

// Run the scan
scanServer()
    .then((result) => {
        console.log(JSON.stringify(result));
        process.exit(result.detected ? 1 : 0);
    })
    .catch((error) => {
        console.error(
            JSON.stringify({
                detected: false,
                violations: [],
                summary: `Scan error: ${error.message}`,
            })
        );
        process.exit(1);
    });
