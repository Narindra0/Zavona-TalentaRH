<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingCategory extends Model
{
    protected $fillable = [
        'original_title',
        'suggested_category',
        'suggested_subcategory',
        'status',
        'created_by'
    ];
}
