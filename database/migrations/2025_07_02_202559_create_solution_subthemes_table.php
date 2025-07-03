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
        Schema::create('solution_subthemes', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->text('slug')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->text('how_it_helps')->nullable();
            $table->text('description_helps')->nullable();
            $table->string('title_benefit')->nullable();
            $table->json('benefits')->nullable();
            $table->string('title_characteristics')->nullable();
            $table->text('description_characteristics')->nullable();
            $table->json('characteristics')->nullable();
            $table->string('title_partners')->nullable();
            $table->text('description_partners')->nullable();
            $table->json('partners')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true)->nullable();
            $table->uuid('lang_id')->nullable();
            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('cascade');
            $table->uuid('solution_id')->nullable();
            $table->foreign('solution_id')->references('id')->on('solutions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solution_subthemes');
    }
};
