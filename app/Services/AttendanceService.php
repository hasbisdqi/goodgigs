<?php

namespace App\Services;

class AttendanceService
{
    /**
     * Calculate distance between two coordinates in meters using Haversine formula.
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // in meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Validate if a coordinate is within a certain radius of another coordinate.
     */
    public function isWithinGeofence(float $jobLat, float $jobLon, float $userLat, float $userLon, float $radiusInMeters = 100): bool
    {
        $distance = $this->calculateDistance($jobLat, $jobLon, $userLat, $userLon);

        return $distance <= $radiusInMeters;
    }
}
