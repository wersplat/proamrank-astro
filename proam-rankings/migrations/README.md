# Database Migrations

## League Divisions Migration

This directory contains the migration files for adding the `lg_divisions` table and related changes.

### Quick Start

To apply the complete lg_divisions migration:

```bash
# 1. Apply the main migration
psql -d your_database -f add_lg_divisions_table.sql

# 2. Create the division standings view
psql -d your_database -f ../views/league_division_standings.sql

# 3. Update mart definitions
psql -d your_database -f "../marts/Player League Season Stats Mart.sql"
psql -d your_database -f "../marts/Team Analytics Data Mart.sql"
psql -d your_database -f "../marts/League Season Performance Mart.sql"

# 4. Refresh materialized views
psql -d your_database -f refresh_marts_after_divisions.sql

# 5. Regenerate TypeScript types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > ../src/lib/db.types.ts
```

### Using Supabase CLI

If you're using Supabase:

```bash
# Apply migrations
supabase db push

# Or apply specific migration
supabase migration up

# Generate types
supabase gen types typescript --local > ../src/lib/db.types.ts
```

### Files in This Directory

- **`add_lg_divisions_table.sql`** - Main migration for lg_divisions table
- **`refresh_marts_after_divisions.sql`** - Helper to refresh affected marts
- **`README.md`** - This file

### Documentation

Complete documentation available in `/documentation/`:

- **LG_DIVISIONS_SUMMARY.md** - Implementation overview and deployment checklist
- **LG_DIVISIONS_IMPLEMENTATION.md** - Detailed implementation guide
- **LG_DIVISIONS_QUICK_REFERENCE.md** - Common queries and patterns

### Pre-Deployment Checklist

- [ ] Backup your database
- [ ] Review the migration SQL
- [ ] Test on development/staging first
- [ ] Verify existing queries still work
- [ ] Plan for downtime (if any)

### Post-Deployment Checklist

- [ ] Verify tables and columns exist
- [ ] Test division creation
- [ ] Refresh materialized views
- [ ] Regenerate TypeScript types
- [ ] Test frontend functionality
- [ ] Populate initial division data

### Need Help?

Refer to:
1. `/documentation/LG_DIVISIONS_IMPLEMENTATION.md` - Complete guide
2. `/documentation/LG_DIVISIONS_QUICK_REFERENCE.md` - Query examples
3. `/documentation/LG_DIVISIONS_SUMMARY.md` - Overview and checklist

