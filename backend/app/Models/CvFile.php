<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvFile extends Model
{
    protected $fillable = [
        'candidate_id',
        'file_path',
        'source',
        'parsed'
    ];

    protected $casts = [
        'parsed' => 'boolean',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }
}