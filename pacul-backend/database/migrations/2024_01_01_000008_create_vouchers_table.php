<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description');
            $table->string('partner_name');
            $table->string('partner_logo_url')->nullable();
            $table->enum('category', ['food', 'transport', 'shop', 'service', 'other']);
            $table->integer('xp_cost');
            $table->string('discount_value');
            $table->string('discount_type')->default('percent');
            $table->date('valid_until');
            $table->integer('total_quota');
            $table->integer('remaining_quota');
            $table->string('terms')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'valid_until']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
