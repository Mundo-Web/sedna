<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategorySolution extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'visible',
        'status',
        'lang_id',
        'type',
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }

    public function solution()
    {
        return $this->hasMany(Solution::class, 'category_solution_id');
    }
}
