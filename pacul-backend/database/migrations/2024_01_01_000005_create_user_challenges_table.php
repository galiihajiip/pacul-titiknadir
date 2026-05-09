<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('challenge_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['joined', 'proof_uploaded', 'completed', 'claimed', 'failed'])->default('joined');
            $table->string('proof_url')->nullable();
            $table->text('proof_caption')->nullable();
            $table->timestamp('joined_at');
            $table->timestamp('proof_uploaded_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('claimed_at')->nullable();
            $table->integer('progress_value')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'challenge_id']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_challenges');
    }
};
