# College Portal Migration Guide

## Overview

This migration creates the College Portal feature for Pro-Am Rankings, adding support for:
- College/University esports program profiles
- Student profiles seeking collegiate opportunities
- Linking students to existing player competitive profiles
- Major/academic program filtering

## Database Tables Created

### 1. `colleges`
Stores information about college and university esports programs.

**Key Fields:**
- Basic info: name, location, size, logo
- Academic: majors_offered (array), majors_page_url
- Financial: avg_cost_to_attend, scholarships_offered
- Esports: program_benefits, student_work_jobs, other_games_offered (array)

### 2. `college_students`
Student profiles seeking collegiate esports opportunities.

**Key Fields:**
- Identity: first_name, last_initial, gamertag
- Academic: gpa, graduation_year, is_transfer, majors_desired (array)
- Preferences: willing_to_travel_out_of_state
- Competitive: competitive_accomplishments, goals_with_competing, film_links (array)
- Optional link: player_id (FK to players table)

### 3. `college_majors`
Predefined list of academic majors for filtering (seeded with 20 common majors).

## Migration Steps

### Step 1: Apply the Migration

**Option A: Using Supabase CLI**
```bash
# From project root
supabase db push --include-seed
```

**Option B: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `create_college_portal_tables.sql`
4. Paste and execute the SQL

### Step 2: Verify Tables Created

Run this query in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('colleges', 'college_students', 'college_majors');
```

You should see all three tables listed.

### Step 3: Regenerate TypeScript Types

From your project root, run:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID (found in Project Settings).

### Step 4: Verify Type Generation

Check that `src/lib/db.types.ts` includes the new tables:
- `Database['public']['Tables']['colleges']`
- `Database['public']['Tables']['college_students']`
- `Database['public']['Tables']['college_majors']`

## Frontend Pages Created

### Public Routes

1. **`/colleges`** - College listing page with search and filters
2. **`/colleges/[id]`** - Individual college profile page
3. **`/students`** - Student listing page with search and filters
4. **`/students/[id]`** - Individual student profile page

All pages are added to the navigation menu (desktop and mobile).

## Testing the Implementation

### 1. Create Sample College
```sql
INSERT INTO colleges (name, location, size, majors_offered, avg_cost_to_attend, other_games_offered, scholarships_offered, program_benefits, student_work_jobs)
VALUES (
  'University of Example',
  'Los Angeles, CA',
  'Medium (10,000-20,000 students)',
  ARRAY['Computer Science', 'Business Administration', 'Game Design'],
  '$45,000/year (Out-of-state: $35k, In-state: $15k)',
  ARRAY['NBA 2K', 'League of Legends', 'Valorant', 'Rocket League'],
  'Full and partial scholarships available based on competitive performance and academic merit. Up to $20k/year for top performers.',
  'State-of-the-art gaming facility with 30+ gaming stations, dedicated practice rooms, team jerseys and apparel, travel support for tournaments, professional coaching staff.',
  'Paid positions available: stream production assistant, social media manager, event coordinator. Work-study opportunities in esports lab.'
);
```

### 2. Create Sample Student
```sql
INSERT INTO college_students (first_name, last_initial, gamertag, gpa, graduation_year, majors_desired, willing_to_travel_out_of_state, competitive_accomplishments, goals_with_competing, film_links)
VALUES (
  'John',
  'D',
  'JDoeGaming',
  3.85,
  2025,
  ARRAY['Computer Science', 'Business Administration'],
  true,
  'Top 8 finish at Regional Championship 2024
3x High School League MVP
2K+ hours competitive play
Average 18 PPG in league play',
  'Looking to compete at the collegiate level while pursuing my degree. Goal is to make it to nationals and potentially go pro after graduation. Want to improve my game IQ and leadership skills.',
  ARRAY[
    'https://www.youtube.com/watch?v=example1',
    'https://www.twitch.tv/videos/example2',
    'https://example.com/highlight-reel'
  ]
);
```

### 3. Link Student to Existing Player (Optional)
```sql
-- First, find the player ID
SELECT id, gamertag FROM players WHERE gamertag ILIKE '%searchterm%';

-- Then update the student record
UPDATE college_students 
SET player_id = 'PLAYER_UUID_HERE'
WHERE id = 'STUDENT_UUID_HERE';
```

### 4. Test the Pages

Visit these URLs in your browser:
- `http://localhost:4321/colleges` - Should show the sample college
- `http://localhost:4321/colleges/{college_id}` - Should show college details
- `http://localhost:4321/students` - Should show the sample student
- `http://localhost:4321/students/{student_id}` - Should show student profile

## Security (RLS Policies)

The migration includes Row Level Security (RLS) policies:
- **Read access**: All tables have public SELECT access (anyone can view)
- **Write access**: Not configured (admin-only via direct database access)

### To Add Write Access (Future Enhancement)

If you want to allow users to create profiles, add these policies:

```sql
-- Allow authenticated users to insert their own student profiles
CREATE POLICY "Users can insert their own student profile"
ON college_students FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id); -- You'd need to add a user_id column first

-- Allow colleges to manage their profiles
CREATE POLICY "Colleges can update their profile"
ON colleges FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id); -- You'd need to add an owner_id column first
```

## Maintenance

### Adding More Majors

```sql
INSERT INTO college_majors (name, category) 
VALUES ('Your Major Name', 'Category')
ON CONFLICT (name) DO NOTHING;
```

### Backup Before Migration

```bash
# Using Supabase CLI
supabase db dump -f backup_before_college_portal.sql
```

## Rollback (If Needed)

If you need to undo this migration:

```sql
DROP TABLE IF EXISTS college_students CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS college_majors CASCADE;
```

⚠️ **Warning**: This will delete all data in these tables.

## Support

For issues or questions:
1. Check Supabase dashboard logs for database errors
2. Check browser console for frontend errors
3. Verify TypeScript types were regenerated correctly
4. Ensure RLS policies are active

## Next Steps

After successful migration:
1. Create sample data for testing
2. Consider adding authentication for profile creation
3. Add image upload capability for logos and profile pictures
4. Implement email notifications for recruiting interests
5. Add analytics to track profile views and engagement

