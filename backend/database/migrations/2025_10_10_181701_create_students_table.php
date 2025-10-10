<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('ime');
            $table->string('razred');
            $table->string('email')->unique();
            $table->string('telefon')->nullable();

            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('parent_model_id')
                ->constrained('parent_models')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
