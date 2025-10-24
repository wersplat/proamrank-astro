-- Sample Data for College Portal Testing
-- Run this after applying the main migration to populate with test data

-- Insert Sample Colleges
INSERT INTO colleges (name, location, size, majors_offered, majors_page_url, avg_cost_to_attend, scholarships_offered, program_benefits, student_work_jobs, other_games_offered, logo_url) VALUES
(
  'Grand Canyon University',
  'Phoenix, AZ',
  'Large (25,000+ students)',
  ARRAY['Computer Science', 'Business Administration', 'Marketing', 'Game Design', 'Sports Management'],
  'https://www.gcu.edu/academics',
  'Out-of-state: $35,000/year, In-state: $18,000/year',
  'Full and partial scholarships available. Top-tier players can receive up to $20,000/year. Academic merit scholarships available up to $15,000/year.',
  'State-of-the-art 3,500 sq ft gaming arena, 50+ gaming stations, dedicated practice rooms, team jerseys and apparel, travel support to major tournaments, professional coaching staff, nutritionist and sports psychologist support, content creation studio.',
  'Paid positions: Stream production assistant ($15/hr), social media coordinator ($16/hr), event staff ($14/hr), coaching assistant ($18/hr). Work-study opportunities available in esports operations.',
  ARRAY['NBA 2K', 'League of Legends', 'Valorant', 'Rocket League', 'Overwatch 2', 'Call of Duty'],
  NULL
),
(
  'University of California, Irvine',
  'Irvine, CA',
  'Large (30,000+ students)',
  ARRAY['Computer Science', 'Engineering', 'Business Administration', 'Information Technology', 'Data Science'],
  'https://www.uci.edu/academics',
  'Out-of-state: $45,000/year, In-state: $15,000/year',
  'Merit-based scholarships ranging from $5,000-$15,000. Need-based aid available. Esports program offers competitive scholarships up to $10,000/year.',
  'UCI Esports Arena with 80+ gaming PCs, broadcast studio, team practice areas, official varsity status, Nike team gear, tournament travel stipends, academic tutoring, career development.',
  'Student positions available in arena operations, content creation, broadcast production. Internship opportunities with esports companies.',
  ARRAY['NBA 2K', 'League of Legends', 'Valorant', 'Overwatch 2', 'Fortnite', 'Rocket League', 'Hearthstone'],
  NULL
),
(
  'Robert Morris University',
  'Chicago, IL',
  'Small (5,000-10,000 students)',
  ARRAY['Business Administration', 'Communications', 'Sport Management', 'Computer Science', 'Digital Media'],
  'https://www.robertmorris.edu/academics',
  'Out-of-state: $32,000/year, In-state: $32,000/year',
  'First school to offer esports scholarships. Full athletic scholarships available for top players. Academic scholarships up to $18,000/year.',
  'Dedicated esports facility, team housing available, official athletic program status, Nike apparel, coaching staff, strength and conditioning, mental skills training.',
  'Work-study positions in esports operations and facility management available.',
  ARRAY['NBA 2K', 'League of Legends', 'Dota 2', 'Rocket League'],
  NULL
),
(
  'Maryville University',
  'St. Louis, MO',
  'Medium (10,000-20,000 students)',
  ARRAY['Game Design', 'Computer Science', 'Cybersecurity', 'Business', 'Marketing'],
  'https://www.maryville.edu/academics',
  '$28,000/year',
  'Full esports scholarships available for varsity players. Academic scholarships up to $20,000/year. Combined packages can cover full tuition.',
  'Award-winning esports program, custom gaming facility, team uniforms, professional coaching, nutritionist, academic support, career services, industry connections.',
  'Paid positions available in esports operations, streaming, and social media. Internship program with local game companies.',
  ARRAY['NBA 2K', 'League of Legends', 'Overwatch 2', 'Rocket League', 'Valorant', 'Rainbow Six Siege'],
  NULL
),
(
  'Ohio State University',
  'Columbus, OH',
  'Large (60,000+ students)',
  ARRAY['Computer Science', 'Engineering', 'Business', 'Game Design', 'Psychology', 'Communications'],
  'https://www.osu.edu/academics',
  'Out-of-state: $38,000/year, In-state: $12,000/year',
  'Need-based aid available. Esports club scholarships range from $1,000-$5,000. Academic scholarships available.',
  'Multiple esports facilities across campus, 100+ gaming stations, varsity and club teams, Nike team gear, tournament travel support, large competitive community.',
  'Student employment opportunities in facility operations and event management.',
  ARRAY['NBA 2K', 'League of Legends', 'Valorant', 'Overwatch 2', 'Super Smash Bros', 'Rocket League', 'CS:GO'],
  NULL
);

-- Insert Sample Students
INSERT INTO college_students (first_name, last_initial, gamertag, gpa, graduation_year, is_transfer, majors_desired, willing_to_travel_out_of_state, competitive_accomplishments, goals_with_competing, film_links) VALUES
(
  'Marcus',
  'J',
  'MJHoops23',
  3.92,
  2025,
  false,
  ARRAY['Computer Science', 'Business Administration'],
  true,
  'Top 8 finish at NACE Regional Championship 2024
3x High School League MVP
Season average: 22 PPG, 8 APG, 6 RPG
2,500+ hours competitive play
Team captain for 2 years
Led team to State Finals appearance',
  'Looking to compete at the highest collegiate level while pursuing my CS degree. Goal is to make nationals and compete for a championship. Want to develop my leadership and game IQ to potentially coach or go pro after graduation. Interested in varsity programs with strong academic support.',
  ARRAY[
    'https://www.youtube.com/watch?v=example1',
    'https://www.twitch.tv/videos/example2'
  ]
),
(
  'Sarah',
  'L',
  'SLGamer',
  3.75,
  2025,
  false,
  ARRAY['Game Design', 'Digital Media', 'Marketing'],
  true,
  'Regional Tournament Champion 2024
All-Conference First Team
Average 18 PPG, 5 APG in league play
Content creator with 5K+ followers
Experience with team management and strategy',
  'Want to balance competitive play with academic pursuits in game design. Looking for a program that values both athletics and academics. Goal is to gain experience for potential career in esports management or game development.',
  ARRAY[
    'https://www.youtube.com/watch?v=highlight-reel',
    'https://www.twitch.tv/slgamer'
  ]
),
(
  'David',
  'R',
  'DRocksNBA2K',
  3.45,
  2026,
  false,
  ARRAY['Sports Management', 'Business Administration'],
  false,
  'State Tournament Top 16
Consistent 15+ PPG scorer
Strong defensive specialist
Team leader in steals and blocks
2 years varsity experience',
  'Looking to stay close to home while competing. Want to improve my offensive game and court vision. Interested in programs with good sports management programs as I want to work in esports or traditional sports after college.',
  ARRAY[
    'https://www.youtube.com/watch?v=defense-highlights'
  ]
),
(
  'Alex',
  'M',
  'AM_Prodigy',
  4.0,
  2025,
  false,
  ARRAY['Computer Science', 'Engineering', 'Data Science'],
  true,
  'National Online Tournament Top 32
High Honor Roll all 4 years
Advanced stats analysis for high school team
20+ PPG in competitive leagues
Multiple MVP awards
Experience with team analytics',
  'Looking for elite academic institution with strong esports program. Want to pursue computer science while competing at high level. Interested in applying data science and analytics to improve competitive play. Goal is to balance academics and athletics at prestigious university.',
  ARRAY[
    'https://www.youtube.com/watch?v=gameplay-analysis',
    'https://www.twitch.tv/am_prodigy'
  ]
),
(
  'Jordan',
  'T',
  'JT_Clutch',
  3.30,
  2024,
  true,
  ARRAY['Communications', 'Marketing', 'Business'],
  true,
  'Looking to transfer with 2 years collegiate experience
Former JC All-American
Team captain at previous school
Strong clutch performer in close games
Experience in high-pressure situations',
  'Transfer student looking for program with strong competitive scene and academic support. Want to compete at D1 level and develop leadership skills. Open to programs nationwide. Looking to finish strong academically while maximizing competitive opportunities.',
  ARRAY[
    'https://www.youtube.com/watch?v=college-highlights',
    'https://example.com/transfer-profile'
  ]
),
(
  'Emily',
  'K',
  'EK_PointGod',
  3.88,
  2026,
  false,
  ARRAY['Psychology', 'Communications', 'Business'],
  true,
  'Junior year standout
Conference Player of the Year candidate
12 APG average (team leader)
Strong basketball IQ and court vision
Multiple scholarship offers',
  'Junior looking for colleges with good psychology programs and competitive esports. Want to study sports psychology and apply it to competitive gaming. Looking for programs that offer both academic rigor and top-tier competition.',
  ARRAY[
    'https://www.youtube.com/watch?v=assist-highlights'
  ]
);

-- Verify data was inserted
SELECT 'Colleges inserted:' as message, COUNT(*) as count FROM colleges;
SELECT 'Students inserted:' as message, COUNT(*) as count FROM college_students;
SELECT 'Majors available:' as message, COUNT(*) as count FROM college_majors;

