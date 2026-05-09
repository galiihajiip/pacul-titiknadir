<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('category', ['transportation', 'food', 'electricity', 'shopping', 'waste', 'other']);
            $table->string('activity');
            $table->decimal('value', 10, 2);
            $table->string('unit')->default('km');
            $table->decimal('co2_kg', 10, 4);
            $table->decimal('emission_factor', 10, 6)->nullable();
            $table->text('notes')->nullable();
            $table->date('activity_date');
            $table->timestamps();

            $table->index(['user_id', 'activity_date']);
            $table->index(['user_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emissions');
    }
};
