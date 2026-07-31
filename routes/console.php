<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('attendance:auto-close')->everyFifteenMinutes();
Schedule::command('attendance:remind-check-in')->everyFiveMinutes();
Schedule::command('attendance:remind-confirmation')->everyFifteenMinutes();
