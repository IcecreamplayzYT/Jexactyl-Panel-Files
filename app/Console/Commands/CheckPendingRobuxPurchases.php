<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use App\Models\RobuxPurchase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckPendingRobuxPurchases extends Command
{
    protected $signature = 'robux:check-purchases';
    protected $description = 'Check pending Robux purchases and verify gamepass ownership';

    public function handle()
    {
        $pendingPurchases = RobuxPurchase::where('status', 'pending')
            ->where('created_at', '>=', now()->subHours(24)) // Only check purchases from last 24 hours
            ->where('check_attempts', '<', 720) // Max 720 attempts (1 hour at 5 second intervals)
            ->get();

        if ($pendingPurchases->isEmpty()) {
            $this->info('No pending purchases to check.');
            return;
        }

        $this->info("Checking {$pendingPurchases->count()} pending purchases...");

        foreach ($pendingPurchases as $purchase) {
            $this->checkPurchase($purchase);
        }

        $this->info('Finished checking pending purchases.');
    }

    private function checkPurchase(RobuxPurchase $purchase)
    {
        $this->info("Checking purchase #{$purchase->id} for user {$purchase->roblox_username}...");

        try {
            // Check if user owns the gamepass
            $ownsGamepass = $this->checkGamepassOwnership($purchase->roblox_user_id, $purchase->gamepass_id);

            if ($ownsGamepass) {
                // Add credits to user
                $user = User::find($purchase->user_id);
                if ($user) {
                    $user->update(['store_balance' => $user->store_balance + $purchase->credits]);
                    $purchase->markCompleted();
                    
                    $this->info("✓ Purchase #{$purchase->id} completed! Added {$purchase->credits} credits to user #{$user->id}");
                    Log::info("Robux purchase completed: User #{$user->id} received {$purchase->credits} credits");
                } else {
                    $purchase->markFailed('User not found');
                    $this->error("✗ Purchase #{$purchase->id} failed: User not found");
                }
            } else {
                // Increment check attempts
                $purchase->incrementCheckAttempts();
                $this->info("  Purchase #{$purchase->id} not yet completed (attempt #{$purchase->check_attempts})");

                // Auto-fail after 1 hour (720 attempts at 5 seconds each)
                if ($purchase->check_attempts >= 720) {
                    $purchase->markFailed('Purchase verification timed out after 1 hour');
                    $this->warn("  Purchase #{$purchase->id} timed out after 1 hour");
                }
            }
        } catch (\Exception $e) {
            $this->error("✗ Error checking purchase #{$purchase->id}: {$e->getMessage()}");
            Log::error("Error checking Robux purchase #{$purchase->id}: {$e->getMessage()}");
            
            $purchase->incrementCheckAttempts();
        }
    }

    private function checkGamepassOwnership($userId, $gamepassId)
    {
        try {
            // Use Roblox inventory API to check gamepass ownership
            $response = Http::get("https://inventory.roblox.com/v1/users/{$userId}/items/GamePass/{$gamepassId}");

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json('data');
            
            // If data array is not empty, user owns the gamepass
            return !empty($data);
        } catch (\Exception $e) {
            Log::error("Failed to check gamepass ownership for user {$userId}, gamepass {$gamepassId}: {$e->getMessage()}");
            return false;
        }
    }
}