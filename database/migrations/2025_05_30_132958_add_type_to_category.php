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
        Schema::table('category_solutions', function (Blueprint $table) {
            $table->string('type')->nullable()->default('solucion');
        });
        Schema::table('category_services', function (Blueprint $table) {
            $table->string('type')->nullable()->default('servicio');
        });
        Schema::table('category_purcharse_options', function (Blueprint $table) {
            $table->string('type')->nullable()->default('opcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_solutions', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('category_services', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('category_purcharse_options', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
