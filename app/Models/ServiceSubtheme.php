<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ServiceSubtheme extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [

        'slug',
        'title',
        'description',
        'image',
        'how_it_helps',
        'description_helps',
        
        'title_benefit',
        'benefits',

        'title_characteristics',
        'description_characteristics',
        'characteristics',

        'title_partners',
        'description_partners',
        'partners',

        'lang_id',
        'service_id',
        'visible',
        'status',
    ];

    protected $casts = [
        'characteristics' => 'array',
        'benefits' => 'array',
        'partners' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
