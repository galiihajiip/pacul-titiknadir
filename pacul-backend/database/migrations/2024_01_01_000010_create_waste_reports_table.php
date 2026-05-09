<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_code')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->enum('category', ['organic', 'plastic', 'b3', 'electronic', 'bulk']);
            $table->enum('severity', ['rendah', 'sedang', 'tinggi', 'kritis']);
            $table->enum('status', ['dilaporkan', 'diproses', 'selesai', 'ditolak'])->default('dilaporkan');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->text('address');
            $table->string('district');
            $table->string('kelurahan')->nullable();
            $table->integer('upvotes_count')->default(0);
            $table->string('assigned_to')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('estimated_resolution')->nullable();
            $table->integer('xp_awarded')->default(50);
            $table->timestamps();

            $table->index(['status', 'severity']);
            $table->index(['district', 'status']);
            $table->index(['lat', 'lng']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_reports');
    }
};
