<?php

use Illuminate\Support\Facades\Route;
use Jexactyl\Http\Controllers\Api\Client\Store\RobloxController;

// Roblox webhook - no authentication required
Route::post('/store/webhook', [RobloxController::class, 'handleWebhook'])
    ->name('api:client:store.webhook');