<?php
/*
namespace Jexactyl\Console\Commands;

use Jexactyl\Models\Server;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Encryption\Encrypter;

class CleanupSuspendedServers extends Command
{
    protected $signature = 'servers:cleanup-suspended';
    protected $description = 'Delete all suspended servers (runs every Saturday)';

    public function handle()
    {
        // Only run on Saturdays
        if (!now()->isSaturday()) {
            $this->info('Not Saturday - skipping cleanup');
            return Command::SUCCESS;
        }

        $this->info('Starting suspended server cleanup...');
        
        // Load suspension log
        $logFile = storage_path('logs/suspended_servers.json');
        
        if (!file_exists($logFile)) {
            $this->info('No suspension log found');
            return Command::SUCCESS;
        }

        $suspensionLog = json_decode(file_get_contents($logFile), true);
        $currentDate = now();
        $deletedCount = 0;
        $remainingLogs = [];

        foreach ($suspensionLog as $log) {
            $scheduledDeletion = \Carbon\Carbon::parse($log['scheduled_deletion']);
            
            // If deletion date has passed, delete the server
            if ($currentDate->gte($scheduledDeletion)) {
                try {
                    $server = Server::find($log['server_id']);
                    
                    if ($server) {
                        $this->deleteServer($server);
                        $deletedCount++;
                        $this->info("Deleted server ID {$log['server_id']}");
                    } else {
                        $this->warn("Server ID {$log['server_id']} not found (may already be deleted)");
                    }
                } catch (\Exception $e) {
                    $this->error("Failed to delete server {$log['server_id']}: {$e->getMessage()}");
                    Log::error("Server deletion failed", [
                        'server_id' => $log['server_id'],
                        'error' => $e->getMessage()
                    ]);
                    
                    // Keep in log for retry
                    $remainingLogs[] = $log;
                }
            } else {
                // Not yet time to delete, keep in log
                $remainingLogs[] = $log;
            }
        }

        // Update log file
        file_put_contents($logFile, json_encode($remainingLogs, JSON_PRETTY_PRINT));

        $this->info("✓ Cleanup complete. Deleted {$deletedCount} servers.");
        
        // Send summary webhook
        $this->sendCleanupWebhook($deletedCount);
        
        return Command::SUCCESS;
    }

    private function deleteServer(Server $server): void
    {
        try {
            $wingsUrl = $server->node->scheme . '://' . $server->node->fqdn . ':' . $server->node->daemonListen;
            $token = $server->node->daemon_token_id . '.' . app(Encrypter::class)->decrypt($server->node->daemon_token);
            
            // Stop the server first
            Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->post("{$wingsUrl}/api/servers/{$server->uuid}/power", [
                'action' => 'kill'
            ]);

            sleep(2);

            // Delete from Wings
            Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->delete("{$wingsUrl}/api/servers/{$server->uuid}");

            // Delete from database
            $server->delete();
            
            Log::info("Successfully deleted server {$server->id}");
        } catch (\Exception $e) {
            Log::error("Error deleting server {$server->id}", [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function sendCleanupWebhook(int $deletedCount): void
    {
        $webhookUrl = config('malware_scanner.discord_webhook_url');
        
        if (!$webhookUrl) {
            return;
        }

        $embed = [
            'embeds' => [
                [
                    'title' => '🧹 Weekly Cleanup Complete',
                    'description' => "Deleted {$deletedCount} suspended server(s)",
                    'color' => 3066993, // Green
                    'fields' => [
                        [
                            'name' => 'Date',
                            'value' => now()->format('Y-m-d'),
                            'inline' => true
                        ],
                        [
                            'name' => 'Servers Deleted',
                            'value' => (string) $deletedCount,
                            'inline' => true
                        ]
                    ],
                    'timestamp' => now()->toIso8601String()
                ]
            ]
        ];

        try {
            Http::post($webhookUrl, $embed);
        } catch (\Exception $e) {
            Log::error('Failed to send cleanup webhook', ['error' => $e->getMessage()]);
        }
    }
}
*/