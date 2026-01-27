<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            // Add suspended column after status
            if (!Schema::hasColumn('servers', 'suspended')) {
                $table->boolean('suspended')->default(false)->after('status');
            }
            
            // Add suspension_reason after suspended
            if (!Schema::hasColumn('servers', 'suspension_reason')) {
                $table->text('suspension_reason')->nullable()->after('suspended');
            }
        });
    }

    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            if (Schema::hasColumn('servers', 'suspension_reason')) {
                $table->dropColumn('suspension_reason');
            }
            
            if (Schema::hasColumn('servers', 'suspended')) {
                $table->dropColumn('suspended');
            }
        });
    }
};