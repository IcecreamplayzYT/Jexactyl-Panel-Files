<?php

namespace Jexactyl\Http\Controllers\Api;

use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Models\RobloxPurchase;
use Jexactyl\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RobloxWebhookController extends Controller
{
    public function handlePurchase(Request $request)
    {
        // Log that the webhook was received (for debugging)
        Log::info('Roblox webhook received', ['request_data' => $request->all()]);

        // 1. Verify the request signature using your shared secret
        $receivedSignature = $request->header('X-Roblox-Signature');
        $webhookSecret = config('services.roblox.webhook_secret', env('ROBLOX_WEBHOOK_SECRET'));
        
        if ($webhookSecret && $receivedSignature) {
            $calculatedSignature = hash_hmac('sha256', $request->getContent(), $webhookSecret);
            if (!hash_equals($calculatedSignature, $receivedSignature)) {
                Log::warning('Roblox webhook: Invalid signature.');
                return response()->json(['error' => 'Invalid signature.'], 401);
            }
        }

        // 2. Validate the incoming data structure
        try {
            $validated = $request->validate([
                'verification.robloxUserId' => 'required|integer',
                'verification.purchaseCode' => 'required|string',
                'verification.productId' => 'required|integer',
                'verification.receiptId' => 'required|string',
                'verification.robloxUsername' => 'required|string',
                'verification.playerThumbnail' => 'nullable|url',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Roblox webhook: Validation failed.', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Invalid data format.', 'details' => $e->errors()], 422);
        }

        $data = $validated['verification'];

        // 3. Find the pending purchase using the unique code
        $pendingPurchase = RobloxPurchase::where('unique_code', $data['purchaseCode'])
                                         ->where('status', 'pending')
                                         ->first();

        if (!$pendingPurchase) {
            Log::warning('Roblox webhook: Invalid or expired purchase code.', ['code' => $data['purchaseCode']]);
            return response()->json(['error' => 'Invalid or expired purchase code.'], 404);
        }

        // 4. Verify the Roblox User ID matches
        if ($pendingPurchase->roblox_user_id != $data['robloxUserId']) {
            Log::error('Roblox User ID mismatch for purchase.', [
                'expected' => $pendingPurchase->roblox_user_id,
                'received' => $data['robloxUserId'],
                'code' => $data['purchaseCode']
            ]);
            return response()->json(['error' => 'User ID mismatch. Purchase not authorized.'], 403);
        }

        // 5. Check for duplicate processing using the Roblox Receipt ID
        if (RobloxPurchase::where('receipt_id', $data['receiptId'])->exists()) {
            Log::info('Roblox webhook: Duplicate receipt detected.', ['receipt' => $data['receiptId']]);
            return response()->json(['status' => 'already_processed']);
        }

        // 6. All checks passed! Grant credits.
        $user = User::find($pendingPurchase->user_id);
        if (!$user) {
            Log::error('Roblox webhook: User not found for purchase.', ['user_id' => $pendingPurchase->user_id]);
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->increment('store_balance', $pendingPurchase->credits);

        // 7. Update the purchase record
        $pendingPurchase->update([
            'status' => 'completed',
            'receipt_id' => $data['receiptId'],
            'completed_at' => now(),
        ]);

        Log::info('Credits granted via Roblox purchase.', [
            'user' => $user->id,
            'credits' => $pendingPurchase->credits,
            'receipt' => $data['receiptId']
        ]);

        return response()->json(['success' => true, 'credits_added' => $pendingPurchase->credits]);
    }
}