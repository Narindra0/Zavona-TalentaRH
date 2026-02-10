<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecruiterInterest extends Model
{
    protected $fillable = [
        'candidate_id',
        'company_name',
        'recruiter_name',
        'email',
        'phone',
        'status'
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }
}
