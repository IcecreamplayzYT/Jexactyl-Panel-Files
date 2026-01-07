<?php

namespace Jexactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Services\Store\RobloxService;
use Jexactyl\Models\RobloxPurchase;
use Jexactyl\Models\User;

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
        
        // Create pending purchase record
        $purchase = RobloxPurchase::create([
            'user_id' => $request->user()->id,
            'roblox_user_id' => $userId,
            'product_id' => $productId,
            'credits' => $product['credits'],
            'robux_price' => $product['price'],
            'unique_code' => bin2hex(random_bytes(16)), // Generate unique code
            'status' => 'pending',
        ]);
        
        return response()->json([
            'success' => true,
            'purchase_code' => $purchase->unique_code,
            'roblox_user_id' => $userId,
            'product_url' => "https://www.roblox.com/games/start?placeId=" . config('services.roblox.place_id'),
            'product' => $product,
        ]);
    }
    
    /**
     * Check payment status
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'purchase_code' => 'required|string',
        ]);
        
        $purchase = RobloxPurchase::where('unique_code', $request->input('purchase_code'))
            ->where('user_id', $request->user()->id)
            ->first();
        
        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found.',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'status' => $purchase->status,
            'credits' => $purchase->credits,
            'completed_at' => $purchase->completed_at,
        ]);
    }
    
    /**
     * Handle webhook from Roblox game
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        // 1. Log the raw request for debugging
        Log::info('Roblox Webhook Received', [
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'body' => $request->all()
        ]);

        // 2. Basic security: Verify a shared secret if you set one in .env
        $receivedSignature = $request->header('X-Roblox-Signature');
        $sharedSecret = config('services.roblox.webhook_secret');

        if ($sharedSecret && $receivedSignature) {
            $expectedSignature = hash_hmac('sha256', $request->getContent(), $sharedSecret);
            if (!hash_equals($expectedSignature, $receivedSignature)) {
                Log::warning('Roblox webhook: Invalid signature.');
                return response()->json(['error' => 'Invalid signature.'], 401);
            }
        }

        // 3. Validate the basic structure
        try {
            $validated = $request->validate([
                'verification.robloxUserId' => 'required|integer',
                'verification.purchaseCode' => 'required|string',
                'verification.productId' => 'required|integer',
                'verification.receiptId' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            Log::warning('Roblox webhook: Validation failed.', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Invalid data.'], 422);
        }

        $data = $validated['verification'];
        Log::info('Roblox webhook: Data validated.', $data);

        // 4. Find the pending purchase using the unique code
        $purchase = RobloxPurchase::where('unique_code', $data['purchaseCode'])
            ->where('status', 'pending')
            ->first();

        if (!$purchase) {
            Log::warning('Roblox webhook: Purchase not found.', ['code' => $data['purchaseCode']]);
            return response()->json(['error' => 'Purchase not found or already processed.'], 404);
        }

        // 5. CRITICAL: Verify the Roblox User ID matches
        if ($purchase->roblox_user_id != $data['robloxUserId']) {
            Log::error('Roblox webhook: User ID mismatch.', [
                'expected' => $purchase->roblox_user_id,
                'received' => $data['robloxUserId']
            ]);
            return response()->json(['error' => 'User mismatch.'], 403);
        }

        // 6. Check for duplicate receipt
        if (RobloxPurchase::where('receipt_id', $data['receiptId'])->exists()) {
            Log::info('Roblox webhook: Duplicate receipt.', ['receipt' => $data['receiptId']]);
            return response()->json(['status' => 'already_processed']);
        }

        // 7. Process the purchase: add credits
        $user = User::find($purchase->user_id);
        
        if (!$user) {
            Log::error('Roblox webhook: User not found.', ['user_id' => $purchase->user_id]);
            return response()->json(['error' => 'User not found.'], 404);
        }
        
        $user->increment('store_balance', $purchase->credits);

        // 8. Mark purchase as complete
        $purchase->update([
            'status' => 'completed',
            'receipt_id' => $data['receiptId'],
            'completed_at' => now(),
        ]);

        Log::info('Roblox webhook: Purchase completed.', [
            'user_id' => $user->id,
            'credits_added' => $purchase->credits,
            'receipt' => $data['receiptId']
        ]);

        return response()->json([
            'success' => true,
            'credits_added' => $purchase->credits
        ]);
    }
}