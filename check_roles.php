<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = \App\Models\User::with('roles')->get();
foreach ($users as $u) {
    echo $u->email . " - Roles: " . $u->roles->pluck('name')->join(',') . "\n";
}
