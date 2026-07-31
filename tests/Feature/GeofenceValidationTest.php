<?php

use App\Services\AttendanceService;

it('calculates the distance between two coordinates correctly', function () {
    $service = new AttendanceService;

    // Jakarta Monas to Bundaran HI (Roughly 1.9km)
    $monasLat = -6.175392;
    $monasLon = 106.827153;
    $hiLat = -6.194916;
    $hiLon = 106.823126;

    $distance = $service->calculateDistance($monasLat, $monasLon, $hiLat, $hiLon);

    expect($distance)->toBeGreaterThan(1800)
        ->toBeLessThan(2300);
});

it('validates coordinate within geofence successfully', function () {
    $service = new AttendanceService;

    // Exact same location should be 0 meters
    $lat = -6.175392;
    $lon = 106.827153;

    expect($service->isWithinGeofence($lat, $lon, $lat, $lon, 100))->toBeTrue();

    // 50 meters away (approximate adjustment to coordinate)
    $nearbyLat = $lat + 0.000450;
    expect($service->isWithinGeofence($lat, $lon, $nearbyLat, $lon, 100))->toBeTrue();
});

it('fails validation when outside geofence', function () {
    $service = new AttendanceService;

    $lat = -6.175392;
    $lon = 106.827153;

    // About 2km away
    $farLat = -6.194916;
    $farLon = 106.823126;

    expect($service->isWithinGeofence($lat, $lon, $farLat, $farLon, 100))->toBeFalse();
});
