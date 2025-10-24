-- College Portal Tables Migration
-- Creates colleges, college_students, and college_majors tables

-- 1. Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT, -- City, State format
  size TEXT, -- e.g., "5,000 students", "Medium (10-20k)"
  majors_offered TEXT[], -- Array of major names
  majors_page_url TEXT, -- External link to university majors page
  avg_cost_to_attend TEXT, -- e.g., "$45,000/year", "In-state: $15k, Out-of-state: $35k"
  scholarships_offered TEXT, -- Description of scholarship opportunities
  program_benefits TEXT, -- Facilities, travel, jerseys, equipment, etc.
  student_work_jobs TEXT, -- Available work-study or esports jobs
  other_games_offered TEXT[], -- Other esports titles
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create college_students table
CREATE TABLE IF NOT EXISTS college_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_initial TEXT NOT NULL,
  gamertag TEXT NOT NULL,
  player_id UUID, -- Optional FK to players table
  gpa NUMERIC(3,2), -- e.g., 3.85
  graduation_year INTEGER, -- High school grad year
  is_transfer BOOLEAN DEFAULT false,
  majors_desired TEXT[], -- Array of desired majors
  willing_to_travel_out_of_state BOOLEAN DEFAULT true,
  competitive_accomplishments TEXT, -- Free text description
  goals_with_competing TEXT, -- Free text description
  film_links TEXT[], -- Array of URLs to gameplay footage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL
);

-- 3. Create college_majors table (predefined list for filters/suggestions)
CREATE TABLE IF NOT EXISTS college_majors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT -- e.g., "STEM", "Business", "Arts", etc.
);

-- 4. Seed college_majors with common majors
INSERT INTO college_majors (name, category) VALUES
  ('Computer Science', 'STEM'),
  ('Business Administration', 'Business'),
  ('Marketing', 'Business'),
  ('Game Design', 'Arts'),
  ('Communications', 'Liberal Arts'),
  ('Sports Management', 'Business'),
  ('Digital Media', 'Arts'),
  ('Engineering', 'STEM'),
  ('Psychology', 'Social Sciences'),
  ('Graphic Design', 'Arts'),
  ('Information Technology', 'STEM'),
  ('Finance', 'Business'),
  ('Accounting', 'Business'),
  ('Film Production', 'Arts'),
  ('Data Science', 'STEM'),
  ('Cybersecurity', 'STEM'),
  ('Economics', 'Social Sciences'),
  ('Kinesiology', 'Health Sciences'),
  ('Nursing', 'Health Sciences'),
  ('Education', 'Education')
ON CONFLICT (name) DO NOTHING;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_college_students_gamertag ON college_students(gamertag);
CREATE INDEX IF NOT EXISTS idx_college_students_graduation_year ON college_students(graduation_year);
CREATE INDEX IF NOT EXISTS idx_college_students_player_id ON college_students(player_id);
CREATE INDEX IF NOT EXISTS idx_college_students_first_name ON college_students(first_name);

-- 6. Enable Row Level Security (RLS) - Public read access
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_majors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON colleges FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON college_students FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON college_majors FOR SELECT USING (true);

-- Comment on tables for documentation
COMMENT ON TABLE colleges IS 'College and university esports programs';
COMMENT ON TABLE college_students IS 'Student profiles seeking college esports opportunities';
COMMENT ON TABLE college_majors IS 'Predefined list of academic majors for filtering';

