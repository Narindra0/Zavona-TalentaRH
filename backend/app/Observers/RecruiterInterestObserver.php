<?php

namespace App\Observers;

use App\Models\RecruiterInterest;
use App\Mail\RecruiterContactedMail;
use Illuminate\Support\Facades\Mail;

class RecruiterInterestObserver
{
    /**
     * Handle the RecruiterInterest "updated" event.
     */
    public function updated(RecruiterInterest $interest): void
    {
        if ($interest->isDirty('status') && $interest->status === 'CONTACTED') {
            Mail::to($interest->email)->send(new RecruiterContactedMail($interest));
        }
    }
}
