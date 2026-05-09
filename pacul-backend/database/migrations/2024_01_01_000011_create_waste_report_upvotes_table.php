<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_report_upvotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('waste_report_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'waste_report_id']);
            $table->index('waste_report_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_report_upvotes');
    }
};
