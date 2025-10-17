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
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['parent_model_id']);

            $table->unsignedBigInteger('parent_model_id')->nullable()->change();

            $table->foreign('parent_model_id')
                ->references('id')->on('parent_models')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['parent_model_id']);
            $table->unsignedBigInteger('parent_model_id')->nullable(false)->change();
            $table->foreign('parent_model_id')
                ->references('id')->on('parent_models')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
        });
    }
};
