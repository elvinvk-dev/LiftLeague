# LiftLeague — overall average + exercise leagues edition

A mobile-friendly workout app with email/password accounts, private cloud plans/logs, friend requests, per-exercise leaderboards, profiles, personal records and JSON backup/import. This package contains the public Supabase settings supplied by the owner, but has not been deployed by this update. The previous source from /mnt/data was unavailable; this continues the reconstructed app from this chat.

## Existing users: update
Read UPDATE-NOTES.md. Run ONLY supabase/update-overall-average.sql in your existing Supabase SQL Editor, then upload the extracted LiftLeague folder to your existing Netlify project. This additive/repeatable migration creates the new exercise_leaderboard RPC. No accounts or workout data are deleted or rewritten. Historical names match ignoring capitalization and surrounding spaces. You do not need older rank migrations.

## New installations
1. Create a new Supabase project; enable email/password auth and email confirmation.
2. Run supabase/schema.sql ONCE on that new project. It creates the full schema including the current exercise leaderboard. Do not run this against an existing LiftLeague database.
3. Replace config.js with your own project URL and public publishable key or legacy anon key. Never put a secret/service_role key into browser files. The supplied configuration connects to the existing owner's project; change it for your own independent deployment.
4. In Auth URL Configuration, set Site URL and allowed redirect URLs to your final HTTPS app URL, including its subdirectory if applicable. For local development allow http://localhost:4173/.
5. Configure custom SMTP for confirmation emails to real users and appropriate Auth limits. Supabase's default email sender has recipient/delivery restrictions.
6. Deploy, create/confirm your account, log in, save a profile and opt into leaderboards if desired.

## Run locally
Install Node.js 20+. Run npm start inside this folder, then open http://localhost:4173/. No package installation or build step is needed. Change config.js to window.LIFTLEAGUE_CONFIG = {url:'',publishableKey:''}; to test local mode with no cloud. Opening index.html by double-click is unsupported because it uses modules.

Run npm test for the 17 automated tests. Tests do not write to Supabase.

## Hosting / phone installation
Host index.html, app.mjs, core.mjs, config.js, style.css, manifest.webmanifest and icon.svg together on an HTTPS static host, serving .mjs as JavaScript. There is no build command. For Git-connected Netlify with index.html at repository root, publish directory is a dot (.). SQL, tests and docs do not need to be hosted.

Use your existing Netlify project to preserve its URL. Recheck Supabase redirect URLs if the host URL changes. iPhone: Safari > Share > Add to Home Screen. Android: browser menu > Add to Home Screen / Install when offered. A manifest is included; browser install support varies. No service worker/offline page-loading guarantee is included.

## Training and cloud saves
Choose one of 15 exercises from the logger dropdown. Other / custom retains custom exercise logging, history and PRs, but unlisted names have no ranked league. Enter weight, units, sets, reps and date. For dumbbells use combined weight; for pull ups enter bodyweight plus added load minus assistance. Weights must be positive. Plans remain freeform custom routines.

Signed-in saves write to Supabase when submitted. Refresh fetches other devices' updates. There is no offline cloud queue or WebSocket push. Failed writes display an error rather than claiming sync. Individual new log/plan rows coexist; concurrent profile updates use the last successful write. Existing local-mode data stays separate from each cloud account. Copy local data to cloud once using the Account button if needed; repeating this/importing a backup again creates duplicates. Imports add plans/logs with fresh IDs, not profile changes, in one transaction. Backups contain profile data; keep them private. The UI reads up to 50,000 log/plan rows per account in pages; a backup import accepts up to 50,000 logs and 500 plans per operation.

The browser loads @supabase/supabase-js version 2.49.8 from esm.sh when configured. Cloud mode requires access to that CDN and your Supabase domain. To remove CDN dependency, bundle the SDK and change its import path.

## Exercise leagues
Each listed movement has its own leaderboard and league. The header always shows your Overall average league. Overall is the default leaderboard; you can still choose any exercise. League lets you choose Everyone or accepted Friends. Progress summarizes all 15 leagues. An Overall board averages normalized best scores across all 15 exercises, with missing exercises zero; each movement has equal weight on its own league scale. Overall uses the base thresholds 15/30/45/60/75/95. This is not a sum and does not average league names. The summary displays exercise coverage. The new RPC is exercise_leaderboard(p_exercise, p_scope), where scope is all or friends, and p_exercise may also be Overall. It returns only opted-in athletes who logged that movement (or any listed movement for Overall); first 100 rows plus the caller's eligible row, with tied points sharing a place. Results include place, username, display_name, score, league, is_me. Emails, body measurements, raw logs and plans remain private.

Points = round(best estimated 1RM / current bodyweight × sqrt(current height_cm / 175) × 40). That is 60% fewer points than the old 100 multiplier before rounding. Scores for other exercises are not summed. League thresholds differ by movement; see UPDATE-NOTES.md for the full table. Current body measurements recalculate historical results. These are casual, self-reported game scores and calibration factors, not a validated fairness standard. Machine loads vary between gyms. Performances and body measurements are not verified.

Friend invitations use exact shareable usernames. Only recipients can accept; either side can decline/cancel/remove. Duplicate/self requests are rejected. Accept an incoming reciprocal request instead of sending another. Only leaderboard opt-in athletes appear on boards; private athletes' usernames can still be used for invitations.

## Security
All four tables have RLS enabled and explicit role grants. Anonymous visitors cannot access their contents. Profiles permit self reads/updates and are created by an auth trigger. Logs/plans enforce auth.uid() ownership on reads/writes. Friendships permit participant reads/deletes; checked RPCs handle invitations/acceptance. Security-definer functions use a fixed empty search_path and explicit authenticated EXECUTE grants. The leaderboard intentionally exposes only limited opted-in fields, derives points and leagues server-side, and returns no client-writable rank. Legacy leaderboard functions remain for old-client compatibility but are not called by this app.

The new migration grants no extra access to raw profiles or logs and changes no RLS policies. Each function should be reviewed together with its EXECUTE grants. Invite limits count retained invitations created in the last day, so deletion can bypass that convenience guard; a wider public launch needs independent abuse controls. Username invitations permit account-existence inference. User-supplied text is rendered as text, not HTML. Browser sessions are stored by the SDK; keep your hosting origin/dependencies secure and log out on shared devices. Supabase user deletion cascades their profile/workouts/friendships; this app has no account-deletion interface.

## Database verification
On a separate TEST project, run supabase/security-tests.sql for existing ownership/friendship policies and supabase/security-exercise-tests.sql for new points, exercise isolation, tiers, opt-out, friends filtering and raw-log privacy. Both create test auth fixtures inside transactions and roll back. If execution aborts, issue ROLLBACK. These scripts were supplied but not executed against a database during this update.

Before publishing to real users, test signup/confirmation/login, two-device saves, invitations/acceptance/removal, both scopes for multiple movements, opt-out, and your own placement. No live cloud write or deployment was performed by this update. See TEST-RESULTS.md for the checks actually completed.

Official references: https://supabase.com/docs/guides/auth/managing-user-data ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://supabase.com/docs/guides/database/functions
