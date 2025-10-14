-- Migration: Add lg_divisions table and update team_rosters
-- Description: Creates divisions within conferences for league organization
-- Safety: Uses nullable foreign keys and LEFT JOINs for backward compatibility

-- ============================================================================
-- 1. CREATE lg_divisions TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lg_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    abbr TEXT,
    division_logo TEXT,
    conference_id UUID REFERENCES public.lg_conf(id) ON DELETE SET NULL,
    season_id UUID REFERENCES public.league_seasons(id) ON DELETE CASCADE,
    league_id UUID REFERENCES public.leagues_info(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate division names within the same season
    CONSTRAINT unique_division_per_season UNIQUE (season_id, name)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lg_divisions_conference_id ON public.lg_divisions(conference_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_season_id ON public.lg_divisions(season_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_league_id ON public.lg_divisions(league_id);
CREATE INDEX IF NOT EXISTS idx_lg_divisions_display_order ON public.lg_divisions(display_order);

-- Add comment for documentation
COMMENT ON TABLE public.lg_divisions IS 'League divisions within conferences - subdivides conference into competitive groups';
COMMENT ON COLUMN public.lg_divisions.conference_id IS 'Parent conference this division belongs to';
COMMENT ON COLUMN public.lg_divisions.season_id IS 'Season this division is active in';
COMMENT ON COLUMN public.lg_divisions.display_order IS 'Order for displaying divisions (lower numbers first)';

-- ============================================================================
-- 2. ADD division_id TO team_rosters
-- ============================================================================

-- Add division_id column (nullable for backward compatibility)
ALTER TABLE public.team_rosters 
ADD COLUMN IF NOT EXISTS division_id UUID;

-- Add foreign key constraint
ALTER TABLE public.team_rosters
ADD CONSTRAINT fk_team_rosters_division_id 
FOREIGN KEY (division_id) 
REFERENCES public.lg_divisions(id) 
ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_team_rosters_division_id ON public.team_rosters(division_id);

-- Add comment for documentation
COMMENT ON COLUMN public.team_rosters.division_id IS 'Division assignment for this roster entry (nullable for backward compatibility)';

-- ============================================================================
-- 3. GRANT PERMISSIONS (adjust as needed for your RLS policies)
-- ============================================================================

-- Grant select to authenticated users (adjust based on your security needs)
-- ALTER TABLE public.lg_divisions ENABLE ROW LEVEL SECURITY;

-- Example policy (uncomment and adjust as needed):
-- CREATE POLICY "Public read access for lg_divisions" 
-- ON public.lg_divisions FOR SELECT 
-- USING (true);

