<?php

namespace Jexactyl\Services\Store;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RobloxService
{
    private string $universeId;
    
    public function __construct()
    {
        $this->universeId = config('services.roblox.universe_id');
    }
    
    /**
     * Get developer products for the universe and parse credit amounts from names
     */
    public function getDeveloperProducts(): array
    {
        // Cache for 5 minutes to avoid rate limits
        return Cache::remember('roblox_dev_products', 300, function () {
            try {
                $apiKey = config('services.roblox.api_key');
                
                if (!$apiKey) {
                    Log::error('Roblox API key not configured');
                    return [];
                }
                
                Log::info('Fetching Roblox developer products with API key', ['universe_id' => $this->universeId]);
                
                // Use Open Cloud API to get developer products
                $response = Http::withHeaders([
                    'x-api-key' => $apiKey,
                    'Content-Type' => 'application/json',
                ])->get("https://apis.roblox.com/developer-products/v2/universes/{$this->universeId}/developer-products/creator", [
                    'maxPageSize' => 100,
                ]);
                
                if (!$response->successful()) {
                    Log::error('Failed to fetch developer products', [
                        'status' => $response->status(),
                        'response' => $response->body(),
                    ]);
                    return [];
                }
                
                $data = $response->json();
                $products = $data['developerProducts'] ?? [];
                
                Log::info('Found developer products', ['count' => count($products), 'products' => $products]);
                
                // Parse products to extract credit amounts from names
                $parsed = [];
                foreach ($products as $product) {
                    // Extract product ID
                    $productId = $product['productId'] ?? null;
                    
                    // Extract product name
                    $productName = $product['name'] ?? '';
                    
                    // Extract price (it's nested in priceInformation.defaultPriceInRobux)
                    $price = $product['priceInformation']['defaultPriceInRobux'] ?? 0;
                    
                    // Parse credits from name (names are "100", "200", etc.)
                    $credits = $this->parseCreditsFromName($productName);
                    
                    if ($credits > 0 && $productId) {
                        $parsed[] = [
                            'id' => $productId,
                            'name' => $productName . ' Credits', // Add "Credits" for display
                            'credits' => $credits,
                            'price' => $price,
                        ];
                        
                        Log::debug('Parsed product', [
                            'id' => $productId,
                            'name' => $productName,
                            'credits' => $credits,
                            'price' => $price,
                        ]);
                    }
                }
                
                // Sort by credits ascending
                usort($parsed, fn($a, $b) => $a['credits'] <=> $b['credits']);
                
                Log::info('Parsed developer products', ['parsed_count' => count($parsed)]);
                
                return $parsed;
                
            } catch (\Exception $e) {
                Log::error('Error fetching Roblox developer products', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                return [];
            }
        });
    }
    
    /**
     * Parse credit amount from product name
     * Supports formats like: "100", "100 Credits", "Credits 100", "Buy 100"
     */
    private function parseCreditsFromName(string $name): int
    {
        // Extract first number found
        if (preg_match('/^(\d+)$/', trim($name), $matches)) {
            return (int) $matches[1];
        }
        
        return 0;
    }
    
    /**
     * Verify Roblox user ID exists
     */
    public function verifyUserId(int $userId): bool
    {
        try {
            $response = Http::get("https://users.roblox.com/v1/users/{$userId}");
            
            if (!$response->successful()) {
                return false;
            }
            
            $data = $response->json();
            return isset($data['id']) && $data['id'] === $userId;
            
        } catch (\Exception $e) {
            Log::error('Error verifying Roblox user ID', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
    
    /**
     * Check if user owns a developer product (has purchased it)
     * Note: This requires checking transaction history or using game server APIs
     * For now, this is a placeholder
     */
    public function checkUserPurchase(int $userId, int $productId): bool
    {
        // TODO: Implement purchase verification
        // This will require either:
        // 1. A Roblox game server webhook
        // 2. Storing purchase receipts from the game
        // 3. Using a third-party service
        
        return false;
    }
}