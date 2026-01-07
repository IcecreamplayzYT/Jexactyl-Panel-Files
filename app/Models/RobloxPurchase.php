<?php

namespace Jexactyl\Models;

use Illuminate\Database\Eloquent\Model;

class RobuxPurchase extends Model
{
    protected $fillable = [
        'user_id',
        'roblox_username',
        'roblox_user_id',
        'gamepass_id',
        'credits',
        'robux_amount',
        'status',
        'completed_at',
        'error_message',
        'check_attempts',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'check_attempts' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function markCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markFailed($message)
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $message,
        ]);
    }

    public function incrementCheckAttempts()
    {
        $this->increment('check_attempts');
    }
}