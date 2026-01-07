<?php

namespace App\Http\Controllers\Api\Client\Store;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\RobuxPurchase;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class RobuxController extends Controller
{
    // Gamepass configuration
    private const GAMEPASSES = [
        1663798085 => ['credits' => 1000, 'robux' => 500],
        1660180971 => ['credits' => 200, 'robux' => 100],
        1661360602 => ['credits' => 500, 'robux' => 250],
        1661098750 => ['credits' => 100, 'robux' => 50],
    ];

    private const UNIVERSE_ID = 9519660777;

    /**
     * Get Roblox user profile by username
     */
    public function getUserProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $username = $request->input('username');

        try {
            // Get user ID from username
            $userResponse = Http::post('https://users.roblox.com/v1/usernames/users', [
                'usernames' => [$username],
                'excludeBannedUsers' => true,
            ]);

            if (!$userResponse->successful() || empty($userResponse->json('data'))) {
                return response()->json(['error' => 'Roblox user not found'], 404);
            }

            $userData = $userResponse->json('data')[0];
            $userId = $userData['id'];

            // Get user thumbnail
            $thumbnailResponse = Http::get("https://thumbnails.roblox.com/v1/users/avatar-headshot", [
                'userIds' => $userId,
                'size' => '150x150',
                'format' => 'Png',
            ]);

            $thumbnail = $thumbnailResponse->json('data')[0]['imageUrl'] ?? null;

            // Get user description
            $profileResponse = Http::get("https://users.roblox.com/v1/users/{$userId}");
            $description = $profileResponse->json('description') ?? 'No description';

            return response()->json([
                'id' => $userId,
                'username' => $userData['name'],
                'displayName' => $userData['displayName'],
                'description' => $description,
                'thumbnail' => $thumbnail,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch Roblox profile: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get available gamepass products
     */
    public function getProducts()
    {
        $products = [];
        
        foreach (self::GAMEPASSES as $gamepassId => $config) {
            $products[] = [
                'id' => $gamepassId,
                'credits' => $config['credits'],
                'price' => $config['robux'],
                'product_url' => "https://www.roblox.com/game-pass/{$gamepassId}",
            ];
        }

        return response()->json($products);
    }

    /**
     * Initiate a Robux purchase
     */
    public function initiatePurchase(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'roblox_user_id' => 'required|integer',
            'roblox_username' => 'required|string',
            'gamepass_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $gamepassId = $request->input('gamepass_id');

        if (!isset(self::GAMEPASSES[$gamepassId])) {
            return response()->json(['error' => 'Invalid gamepass selected'], 422);
        }

        $config = self::GAMEPASSES[$gamepassId];

        // Check if user already has a pending purchase for this gamepass
        $existingPurchase = RobuxPurchase::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->where('gamepass_id', $gamepassId)
            ->first();

        if ($existingPurchase) {
            return response()->json([
                'purchase_id' => $existingPurchase->id,
                'product_url' => "https://www.roblox.com/game-pass/{$gamepassId}",
                'message' => 'You already have a pending purchase for this gamepass',
            ]);
        }

        // Create pending purchase
        $purchase = RobuxPurchase::create([
            'user_id' => $request->user()->id,
            'roblox_username' => $request->input('roblox_username'),
            'roblox_user_id' => $request->input('roblox_user_id'),
            'gamepass_id' => $gamepassId,
            'credits' => $config['credits'],
            'robux_amount' => $config['robux'],
            'status' => 'pending',
        ]);

        return response()->json([
            'purchase_id' => $purchase->id,
            'product_url' => "https://www.roblox.com/game-pass/{$gamepassId}",
            'credits' => $config['credits'],
            'robux' => $config['robux'],
        ]);
    }

    /**
     * Check if user owns the gamepass
     */
    public function checkPurchase(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'purchase_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $purchase = RobuxPurchase::where('id', $request->input('purchase_id'))
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found'], 404);
        }

        if ($purchase->status === 'completed') {
            return response()->json([
                'success' => true,
                'message' => 'Purchase already completed!',
                'credits_added' => $purchase->credits,
            ]);
        }

        // Check if user owns the gamepass
        $ownsGamepass = $this->checkGamepassOwnership($purchase->roblox_user_id, $purchase->gamepass_id);

        if ($ownsGamepass) {
            // Add credits to user
            $user = $request->user();
            $user->update(['store_balance' => $user->store_balance + $purchase->credits]);

            // Mark purchase as completed
            $purchase->markCompleted();

            return response()->json([
                'success' => true,
                'message' => 'Purchase verified! Credits have been added to your account.',
                'credits_added' => $purchase->credits,
            ]);
        }

        $purchase->incrementCheckAttempts();

        return response()->json([
            'success' => false,
            'message' => 'Purchase not detected yet. Please make sure you have purchased the gamepass.',
        ]);
    }

    /**
     * Check if a Roblox user owns a specific gamepass
     */
    private function checkGamepassOwnership($userId, $gamepassId)
    {
        try {
            // Use Roblox API to check gamepass ownership
            $response = Http::get("https://inventory.roblox.com/v1/users/{$userId}/items/GamePass/{$gamepassId}");

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json('data');
            return !empty($data);
        } catch (\Exception $e) {
            \Log::error('Failed to check gamepass ownership: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Cancel a pending purchase
     */
    public function cancelPurchase(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'purchase_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $purchase = RobuxPurchase::where('id', $request->input('purchase_id'))
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found or already processed'], 404);
        }

        $purchase->update(['status' => 'cancelled']);

        return response()->json(['success' => true, 'message' => 'Purchase cancelled']);
    }
}