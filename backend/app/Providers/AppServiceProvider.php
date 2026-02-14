<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        \Illuminate\Http\Resources\Json\JsonResource::withoutWrapping();
        \App\Models\RecruiterInterest::observe(\App\Observers\RecruiterInterestObserver::class);
    }
}
