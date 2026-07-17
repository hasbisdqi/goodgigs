<?php

namespace App\Services;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Support\Collection;

class RecommendationService
{
    /**
     * Get recommended jobs for a given worker.
     * Factors: Skill match, category match, and geographical distance.
     */
    public function getRecommendedJobs(User $worker, int $limit = 10): Collection
    {
        $workerSkills = $worker->skills ?? [];
        $workerLat = $worker->latitude;
        $workerLng = $worker->longitude;

        // Base query: only jobs that are not completed, and are open
        $query = JobPosting::where('status', 'open');

        $jobs = $query->get();

        $scoredJobs = $jobs->map(function ($job) use ($workerSkills, $workerLat, $workerLng) {
            $score = 0;

            // 1. Skill Match (highest weight)
            $jobText = strtolower($job->title.' '.$job->description);
            foreach ($workerSkills as $skill) {
                if (str_contains($jobText, strtolower(trim($skill)))) {
                    $score += 10;
                }
            }

            // 2. Distance Match
            if ($workerLat && $workerLng && $job->latitude && $job->longitude) {
                $distance = $this->haversineGreatCircleDistance(
                    (float) $workerLat,
                    (float) $workerLng,
                    (float) $job->latitude,
                    (float) $job->longitude
                );

                // Add score inversely proportional to distance (max 15 points if distance is 0)
                // e.g. 0km = 15pts, 10km = 5pts, >15km = 0pts
                $distanceScore = max(0, 15 - $distance);
                $score += $distanceScore;
            }

            $job->match_score = $score;

            return $job;
        });

        // Sort by match score descending, filter out jobs with 0 score, and take limit
        return $scoredJobs->filter(function ($job) {
            return $job->match_score > 0;
        })->sortByDesc('match_score')->take($limit)->values();
    }

    /**
     * Get a fair wage recommendation based on job type.
     */
    public function getFairWageRecommendation(string $type): ?int
    {
        // Extract numeric part from string salary
        $jobs = JobPosting::where('type', $type)->get();

        $totalWage = 0;
        $count = 0;

        foreach ($jobs as $job) {
            if (empty($job->salary)) {
                continue;
            }

            // Extract numbers using regex
            preg_match_all('/\d+/', str_replace('.', '', $job->salary), $matches);

            if (! empty($matches[0])) {
                // If it looks like a range (e.g., 50000 - 100000), we take the average of the range or just the first number
                // For simplicity, take the first continuous number block that is large enough (to avoid extracting numbers like "2" from "2 jam")
                $numberFound = null;
                foreach ($matches[0] as $match) {
                    if ((int) $match >= 10000) {
                        $numberFound = (int) $match;
                        break;
                    }
                }

                if ($numberFound) {
                    $totalWage += $numberFound;
                    $count++;
                }
            }
        }

        if ($count === 0) {
            return null; // No historical data to provide a recommendation
        }

        return (int) round($totalWage / $count);
    }

    /**
     * Calculates the great-circle distance between two points, with
     * the Haversine formula.
     *
     * @param  float  $latitudeFrom  Latitude of start point in [deg decimal]
     * @param  float  $longitudeFrom  Longitude of start point in [deg decimal]
     * @param  float  $latitudeTo  Latitude of target point in [deg decimal]
     * @param  float  $longitudeTo  Longitude of target point in [deg decimal]
     * @param  float  $earthRadius  Mean earth radius in [km]
     * @return float Distance between points in [km]
     */
    private function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6371.0): float
    {
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }
}
