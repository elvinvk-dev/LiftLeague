# Overall average ranking update

## Update existing LiftLeague
1. In Supabase open SQL Editor > New query.
2. Open supabase/update-overall-average.sql in Notepad, copy everything, paste into the query and click Run. This single repeatable update includes the exercise-board function; you do not need previous rank migrations.
3. Extract this ZIP. Upload the LiftLeague folder to your existing Netlify project > Deploys. Your public Supabase configuration is preserved.
4. Refresh the app with Ctrl+Shift+R. League defaults to Overall. Choose Everyone or Friends, or switch to an exercise.

Do not rerun schema.sql. No profiles, logs, plans or friendships are deleted or rewritten. Existing workouts automatically count. Complete both the Supabase update and the Netlify upload.

## Overall average
The header always shows your Overall league. Progress has an Overall row plus all 15 individual leagues. League shows Overall placements, points, tiers and exercise coverage, alongside the existing individual exercise leaderboards.

For each of the 15 listed exercises take your best estimated 1RM. Divide each by that exercise's calibration factor, sum those normalized values and divide by 15 (even if you have logged fewer movements). Then divide by your bodyweight, multiply by sqrt(height / 175) and by 40, and round ONCE. Missing exercises contribute zero. The same exercise entered repeatedly counts only its best record. Other / custom exercises do not affect ranked scores.

This averages performance on a common league scale so leg press weights do not automatically overwhelm lateral raises. It does not average the names Bronze/Silver/etc. Overall thresholds are Rookie 0, Bronze 15, Silver 30, Gold 45, Platinum 60, Diamond 75, Titan 95. For example, equivalent 40-point normalized performances on all 15 movements give Overall 40 (Silver); one such movement alone gives roughly 3 points because the other 14 count zero. The selected board shows how many of the 15 movements you have logged.

The lower 40-point multiplier and harder individual exercise leagues from the last update remain. Per-exercise boards are unchanged. These are game calibration factors, not verified strength standards. Cable/machine weights vary by gym. For dumbbells enter combined weight; for pull ups enter bodyweight plus added load minus assistance.

## Individual thresholds (unchanged)
| Exercise | Bronze | Silver | Gold | Platinum | Diamond | Titan |
|---|---:|---:|---:|---:|---:|---:|
| Bench press | 15 | 30 | 45 | 60 | 75 | 95 |
| Squat | 19 | 38 | 56 | 75 | 94 | 119 |
| Deadlift | 21 | 42 | 63 | 84 | 105 | 133 |
| Overhead press | 10 | 20 | 29 | 39 | 49 | 62 |
| Barbell row | 13 | 26 | 38 | 51 | 64 | 81 |
| Tricep cable pushdowns | 8 | 17 | 25 | 33 | 41 | 52 |
| Bicep curls | 7 | 14 | 20 | 27 | 34 | 43 |
| Lateral raises | 3 | 6 | 9 | 12 | 15 | 19 |
| Pull ups | 17 | 33 | 50 | 66 | 83 | 105 |
| Preacher curls | 6 | 12 | 18 | 24 | 30 | 38 |
| T-bar row | 14 | 27 | 41 | 54 | 68 | 86 |
| Incline bench press | 13 | 26 | 38 | 51 | 64 | 81 |
| Chest flies | 6 | 12 | 18 | 24 | 30 | 38 |
| Incline chest flies | 5 | 11 | 16 | 21 | 26 | 33 |
| Leg press | 33 | 66 | 99 | 132 | 165 | 209 |


## Validation
17 local tests passed, including overall averaging, zero for missing/custom movements, normalization, best-only records, case-insensitive matching, tier boundaries, and SQL/source consistency. Syntax checks passed. Live Supabase execution and updated browser flows were not tested. The rollback-only supabase/security-exercise-tests.sql now includes overall average and friend-scope assertions for a separate test project.
