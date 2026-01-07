<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRobuxPurchasesTable extends Migration
{
    public function up()
    {
        Schema::create('robux_purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->string('roblox_username');
            $table->bigInteger('roblox_user_id');
            $table->bigInteger('gamepass_id');
            $table->integer('credits');
            $table->integer('robux_amount');
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('check_attempts')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['status', 'created_at']);
            $table->index(['roblox_user_id', 'gamepass_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('robux_purchases');
    }
}