<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roblox_purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id'); // Changed to unsignedInteger to match users.id
            $table->bigInteger('roblox_user_id');
            $table->bigInteger('product_id');
            $table->integer('credits');
            $table->integer('price_in_robux');
            $table->string('status')->default('pending');
            $table->string('receipt_id')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();
            
            // Add foreign key with correct type
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Add indexes
            $table->index(['roblox_user_id', 'product_id', 'status']);
            $table->index(['status', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roblox_purchases');
    }
};
