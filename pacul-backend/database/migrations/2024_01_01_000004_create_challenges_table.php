<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('emoji')->default('🌿');
            $table->enum('category', ['transport', 'food', 'energy', 'waste', 'community', 'nature']);
            $table->enum('difficulty', ['mudah', 'sedang', 'sulit']);
            $table->integer('xp_reward');
            $table->integer('target_value')->nullable();
            $table->string('target_unit')->nullable();
            $table->integer('duration_days')->default(7);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('participants_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_proof')->default(true);
            $table->string('proof_type')->default('photo');
            $table->json('tips')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
