<?php

namespace Jexactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Services\Store\RobloxService;

class RobloxController extends Controller
{
    private RobloxService $robloxService;
    
    public function __construct(RobloxService $robloxService)
    {
        $this->robloxService = $robloxService;
    }
    
    /**
     * Get available developer products
     */
    public function products(): JsonResponse
    {
        $products = $this->robloxService->getDeveloperProducts();
        
        return response()->json([
            'products' => $products,
        ]);
    }
    
    /**
     * Initiate a Robux purchase
     */
    public function initiate(Request $request): JsonResponse
    {
        $request->validate([
            'roblox_user_id' => 'required|integer|min:1',
            'product_id' => 'required|integer',
        ]);
        
        $userId = $request->input('roblox_user_id');
        $productId = $request->input('product_id');
        
        // Verify user ID exists
        if (!$this->robloxService->verifyUserId($userId)) {
            return response()->json([
                'error' => 'Invalid Roblox User ID. Please check and try again.',
            ], 404);
        }
        
        // Get product details
        $products = $this->robloxService->getDeveloperProducts();
        $product = collect($products)->firstWhere('id', $productId);
        
        if (!$product) {
            return response()->json([
                'error' => 'Invalid product selected.',
            ], 404);
        }
        
        // TODO: Store pending purchase in database
        // For now, just return the product URL
        
        return response()->json([
            'success' => true,
            'roblox_user_id' => $userId,
            'product_url' => "https://www.roblox.com/games/start?placeId=" . config('services.roblox.universe_id'),
            'product' => $product,
        ]);
    }
    
    /**
     * Check payment status
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'roblox_user_id' => 'required|integer|min:1',
            'product_id' => 'required|integer',
        ]);
        
        // TODO: Implement payment verification
        // This will check if the user has purchased the product
        
        return response()->json([
            'success' => false,
            'message' => 'Payment verification not yet implemented. This requires game server integration.',
        ]);
    }
    
    public function handleWebhook(Request $request): JsonResponse
    {
        // 1. Log the raw request for debugging
        Log::channel('roblox')->info('Webhook Received', [
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'raw_body' => $request->getContent()
        ]);

        // 2. Basic security: Verify a shared secret if you set one in .env
        $receivedSignature = $request->header('X-Roblox-Signature');
        $sharedSecret = config('services.roblox.webhook_secret');

        if ($sharedSecret) {
            $expectedSignature = hash_hmac('sha256', $request->getContent(), $sharedSecret);
            if (!hash_equals($expectedSignature, $receivedSignature)) {
                Log::channel('roblox')->warning('Invalid webhook signature.');
                return response()->json(['error' => 'Invalid signature.'], 401);
            }
        }

        // 3. Validate the basic structure Roblox sends
        // The ProcessReceipt callback sends data[citation:9].
        try {
            $validated = $request->validate([
                'verification.robloxUserId' => 'required|integer',
                'verification.purchaseCode' => 'required|string',
                'verification.productId' => 'required|integer',
                'verification.receiptId' => 'required|string', // Unique ID for the transaction
            ]);
        } catch (ValidationException $e) {
            Log::channel('roblox')->warning('Webhook validation failed.', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Invalid data.'], 422);
        }

        $data = $validated['verification'];
        Log::channel('roblox')->info('Webhook data validated.', $data);

        // 4. Find the pending purchase using the unique code
        $purchase = RobloxPurchase::where('unique_code', $data['purchaseCode'])
            ->where('status', 'pending')
            ->first();

        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found or already processed.'], 404);
        }

        // 5. CRITICAL: Verify the Roblox User ID matches
        if ($purchase->roblox_user_id != $data['robloxUserId']) {
            Log::channel('roblox')->error('User ID mismatch for purchase.', [
                'expected' => $purchase->roblox_user_id,
                'received' => $data['robloxUserId']
            ]);
            return response()->json(['error' => 'User mismatch.'], 403);
        }

        // 6. Check for duplicate receipt
        if (RobloxPurchase::where('receipt_id', $data['receiptId'])->exists()) {
            return response()->json(['status' => 'already_processed']);
        }

        // 7. Process the purchase: add credits
        $user = User::find($purchase->user_id);
        $user->increment('store_balance', $purchase->credits);

        // 8. Mark purchase as complete
        $purchase->update([
            'status' => 'completed',
            'receipt_id' => $data['receiptId'],
            'completed_at' => now(),
        ]);

        Log::channel('roblox')->info('Purchase completed.', [
            'user_id' => $user->id,
            'credits_added' => $purchase->credits
        ]);

        return response()->json(['success' => true]);
    }
}