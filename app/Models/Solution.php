<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solution extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'status',
        'visible',
        'slug',
        'characteristics',
        'gallery',
        'featured',
        'lang_id',
        //SEDNA
        'how_it_helps',
        'description_helps',
        'value_proposition',
        'innovation_focus',
        'customer_relation',
        'benefits',
        'image_secondary',
        'image_banner',
        'image_icon',
        'category_solution_id',
        'title_second',
        'description_second',

    ];
    protected $casts = [
        'characteristics' => 'array', // Convierte automáticamente el JSON a array de PHP
        'gallery' => 'array',
        'benefits' => 'array'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }

    public function category()
    {
        return $this->belongsTo(CategorySolution::class, 'category_solution_id');
    }

    public function subthemes()
    {
        return $this->hasMany(SolutionSubtheme::class);
    }
}
