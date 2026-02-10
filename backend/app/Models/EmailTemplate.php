<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'sender_email',
        'subject',
        'body',
        'variables_available'
    ];

    protected $casts = [
        'variables_available' => 'array',
    ];
}
