<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('step_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('session_date');
            $table->integer('steps')->default(0);
            $table->decimal('distance_km', 8, 3)->default(0);
            $table->decimal('calories_burned', 8, 2)->default(0);
            $table->decimal('co2_saved_kg', 8, 4)->default(0);
            $table->integer('active_minutes')->default(0);
            $table->integer('xp_earned')->default(0);
            $table->json('hourly_steps')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'session_date']);
            $table->index(['user_id', 'session_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('step_sessions');
    }
};
