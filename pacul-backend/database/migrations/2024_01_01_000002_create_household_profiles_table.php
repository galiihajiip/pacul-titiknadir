<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('household_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('profile_type', ['kos', 'apartemen', 'rumah_kecil', 'rumah_sedang', 'rumah_besar'])->default('rumah_sedang');
            $table->integer('member_count')->default(4);
            $table->integer('ac_count')->default(0);
            $table->integer('fridge_count')->default(1);
            $table->integer('washing_machine_count')->default(1);
            $table->boolean('has_water_heater')->default(false);
            $table->integer('kwh_baseline')->nullable();
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('household_profiles');
    }
};
