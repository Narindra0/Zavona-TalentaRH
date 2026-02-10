<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubCategory extends Model
{
    protected $fillable = ['category_id', 'name', 'keywords'];

    protected $casts = [
        'keywords' => 'array'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}