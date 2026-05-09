<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('energy_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->year('year');
            $table->tinyInteger('month');
            $table->integer('kwh_usage');
            $table->decimal('bill_amount', 12, 2)->nullable();
            $table->decimal('cost_per_kwh', 8, 2)->nullable();
            $table->enum('source', ['manual', 'ocr_scan'])->default('manual');
            $table->string('ocr_image_url')->nullable();
            $table->decimal('co2_kg', 10, 4)->nullable();
            $table->enum('benchmark_category', ['sangat_hemat', 'hemat', 'normal', 'boros', 'sangat_boros'])->nullable();
            $table->integer('xp_earned')->default(0);
            $table->json('ocr_raw_data')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'year', 'month']);
            $table->index(['user_id', 'year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('energy_reports');
    }
};
