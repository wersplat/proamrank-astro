export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievement_rules: {
        Row: {
          award_template: Json | null
          created_at: string
          game_year: string | null
          id: string
          is_active: boolean
          league_id: string | null
          name: string
          predicate: Json
          requires_approval: boolean
          scope: Database["public"]["Enums"]["achievement_scope"]
          season_id: string | null
          tier: Database["public"]["Enums"]["achievement_tier"]
          updated_at: string
          window_predicate: Json | null
          window_size: number | null
        }
        Insert: {
          award_template?: Json | null
          created_at?: string
          game_year?: string | null
          id?: string
          is_active?: boolean
          league_id?: string | null
          name: string
          predicate: Json
          requires_approval?: boolean
          scope: Database["public"]["Enums"]["achievement_scope"]
          season_id?: string | null
          tier: Database["public"]["Enums"]["achievement_tier"]
          updated_at?: string
          window_predicate?: Json | null
          window_size?: number | null
        }
        Update: {
          award_template?: Json | null
          created_at?: string
          game_year?: string | null
          id?: string
          is_active?: boolean
          league_id?: string | null
          name?: string
          predicate?: Json
          requires_approval?: boolean
          scope?: Database["public"]["Enums"]["achievement_scope"]
          season_id?: string | null
          tier?: Database["public"]["Enums"]["achievement_tier"]
          updated_at?: string
          window_predicate?: Json | null
          window_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_rules_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "achievement_rules_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "achievement_rules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "achievement_rules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "achievement_rules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "achievement_rules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_rules_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      achievements: {
        Row: {
          achievement_badge: string | null
          category: Database["public"]["Enums"]["achievement_category"] | null
          created_at: string
          description: string | null
          id: string
          is_player: boolean | null
          is_team: boolean | null
          name: string | null
          rarity: Database["public"]["Enums"]["achievement_rarity"] | null
          rp_value: number | null
          type: Database["public"]["Enums"]["achievement_type"] | null
        }
        Insert: {
          achievement_badge?: string | null
          category?: Database["public"]["Enums"]["achievement_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          is_player?: boolean | null
          is_team?: boolean | null
          name?: string | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"] | null
          rp_value?: number | null
          type?: Database["public"]["Enums"]["achievement_type"] | null
        }
        Update: {
          achievement_badge?: string | null
          category?: Database["public"]["Enums"]["achievement_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          is_player?: boolean | null
          is_team?: boolean | null
          name?: string | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"] | null
          rp_value?: number | null
          type?: Database["public"]["Enums"]["achievement_type"] | null
        }
        Relationships: []
      }
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      awards_race: {
        Row: {
          award_type: Database["public"]["Enums"]["award_types"] | null
          award_winner: boolean | null
          created_at: string
          id: string
          league_id: string | null
          player_id: string | null
          rank: number | null
          rp_bonus: number | null
          team_id: string
          tournament_id: string | null
        }
        Insert: {
          award_type?: Database["public"]["Enums"]["award_types"] | null
          award_winner?: boolean | null
          created_at?: string
          id?: string
          league_id?: string | null
          player_id?: string | null
          rank?: number | null
          rp_bonus?: number | null
          team_id: string
          tournament_id?: string | null
        }
        Update: {
          award_type?: Database["public"]["Enums"]["award_types"] | null
          award_winner?: boolean | null
          created_at?: string
          id?: string
          league_id?: string | null
          player_id?: string | null
          rank?: number | null
          rp_bonus?: number | null
          team_id?: string
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_race_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "awards_race_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      city_crews: {
        Row: {
          created_at: string
          crew_logo: string | null
          crewLead: string | null
          crewName: string | null
          crewRank: number | null
          crewRegion: string | null
          discord_url: string | null
          id: string
          twitch_url: string | null
          twitter_url: string | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          crew_logo?: string | null
          crewLead?: string | null
          crewName?: string | null
          crewRank?: number | null
          crewRegion?: string | null
          discord_url?: string | null
          id?: string
          twitch_url?: string | null
          twitter_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          crew_logo?: string | null
          crewLead?: string | null
          crewName?: string | null
          crewRank?: number | null
          crewRegion?: string | null
          discord_url?: string | null
          id?: string
          twitch_url?: string | null
          twitter_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewLead_fkey"
            columns: ["crewLead"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_crews_crewRegion_fkey"
            columns: ["crewRegion"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_pool: {
        Row: {
          created_at: string | null
          declared_at: string | null
          draft_notes: string | null
          draft_rating: number | null
          league_id: string | null
          player_id: string
          season: string | null
          status: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          declared_at?: string | null
          draft_notes?: string | null
          draft_rating?: number | null
          league_id?: string | null
          player_id: string
          season?: string | null
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          declared_at?: string | null
          draft_notes?: string | null
          draft_rating?: number | null
          league_id?: string | null
          player_id?: string
          season?: string | null
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_pool_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "draft_pool_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "draft_pool_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "draft_pool_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "draft_pool_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_pool_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "draft_pool_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_queue: {
        Row: {
          attempts: number
          created_at: string
          id: number
          last_error: string | null
          player_stats_id: string
          status: string
          updated_at: string
          visible_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: number
          last_error?: string | null
          player_stats_id: string
          status?: string
          updated_at?: string
          visible_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: number
          last_error?: string | null
          player_stats_id?: string
          status?: string
          updated_at?: string
          visible_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_queue_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_queue_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "v_player_global_rating_per_game"
            referencedColumns: ["stat_id"]
          },
        ]
      }
      event_results: {
        Row: {
          awarded_at: string | null
          bonus_rp: number | null
          id: string
          last_decay_date: string | null
          league_id: string | null
          placement: number | null
          prize_amount: number | null
          remaining_rp: number | null
          rp_awarded: number | null
          rp_decay_start_days: number | null
          season_id: string | null
          team_id: string
          total_rp: number | null
          tournament_id: string | null
          winner_banner_url: string | null
        }
        Insert: {
          awarded_at?: string | null
          bonus_rp?: number | null
          id?: string
          last_decay_date?: string | null
          league_id?: string | null
          placement?: number | null
          prize_amount?: number | null
          remaining_rp?: number | null
          rp_awarded?: number | null
          rp_decay_start_days?: number | null
          season_id?: string | null
          team_id: string
          total_rp?: number | null
          tournament_id?: string | null
          winner_banner_url?: string | null
        }
        Update: {
          awarded_at?: string | null
          bonus_rp?: number | null
          id?: string
          last_decay_date?: string | null
          league_id?: string | null
          placement?: number | null
          prize_amount?: number | null
          remaining_rp?: number | null
          rp_awarded?: number | null
          rp_decay_start_days?: number | null
          season_id?: string | null
          team_id?: string
          total_rp?: number | null
          tournament_id?: string | null
          winner_banner_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "event_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tiers: {
        Row: {
          created_at: string
          event_tier: Database["public"]["Enums"]["event_tier"] | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          is_tournament: boolean | null
          max_rp: number | null
          player_rp_bonus: number | null
          tier_name: string | null
        }
        Insert: {
          created_at?: string
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          is_tournament?: boolean | null
          max_rp?: number | null
          player_rp_bonus?: number | null
          tier_name?: string | null
        }
        Update: {
          created_at?: string
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          is_tournament?: boolean | null
          max_rp?: number | null
          player_rp_bonus?: number | null
          tier_name?: string | null
        }
        Relationships: []
      }
      fine_tuning_examples: {
        Row: {
          created_at: string | null
          error_count: number | null
          extracted_text: string
          has_validation_errors: boolean | null
          id: string
          match_id: string | null
          mode: string
          model_version: string | null
          ocr_provider: string | null
          processing_time_ms: number | null
          successful_response: Json
          team_a_name: string
          team_b_name: string
          trained_at: string | null
          training_batch_id: string | null
          used_for_training: boolean | null
          validation_score: number | null
        }
        Insert: {
          created_at?: string | null
          error_count?: number | null
          extracted_text: string
          has_validation_errors?: boolean | null
          id?: string
          match_id?: string | null
          mode: string
          model_version?: string | null
          ocr_provider?: string | null
          processing_time_ms?: number | null
          successful_response: Json
          team_a_name: string
          team_b_name: string
          trained_at?: string | null
          training_batch_id?: string | null
          used_for_training?: boolean | null
          validation_score?: number | null
        }
        Update: {
          created_at?: string | null
          error_count?: number | null
          extracted_text?: string
          has_validation_errors?: boolean | null
          id?: string
          match_id?: string | null
          mode?: string
          model_version?: string | null
          ocr_provider?: string | null
          processing_time_ms?: number | null
          successful_response?: Json
          team_a_name?: string
          team_b_name?: string
          trained_at?: string | null
          training_batch_id?: string | null
          used_for_training?: boolean | null
          validation_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fine_tuning_examples_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "fine_tuning_examples_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fine_tuning_examples_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
        ]
      }
      group_matches: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          match_id: string
          match_number: number
          round: number
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          match_id: string
          match_number: number
          round: number
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          match_id?: string
          match_number?: number
          round?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_matches_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tournament_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "group_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
        ]
      }
      group_standings: {
        Row: {
          group_id: string
          id: string
          losses: number | null
          matches_played: number | null
          point_differential: number | null
          points_against: number | null
          points_for: number | null
          position: number | null
          team_id: string
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          group_id: string
          id?: string
          losses?: number | null
          matches_played?: number | null
          point_differential?: number | null
          points_against?: number | null
          points_for?: number | null
          position?: number | null
          team_id: string
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          group_id?: string
          id?: string
          losses?: number | null
          matches_played?: number | null
          point_differential?: number | null
          points_against?: number | null
          points_for?: number | null
          position?: number | null
          team_id?: string
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_standings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tournament_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      kv_store_10f5458b: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_f16f1f5f: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      league_open: {
        Row: {
          created_at: string
          finals_date: string | null
          hr_per_rd: number | null
          id: string
          open_champion: string | null
          open_prize: number | null
          rp_value: number | null
          season_id: string
          series_format: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          team_count: number | null
          tier_label: string | null
          tournament_type:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Insert: {
          created_at?: string
          finals_date?: string | null
          hr_per_rd?: number | null
          id?: string
          open_champion?: string | null
          open_prize?: number | null
          rp_value?: number | null
          season_id: string
          series_format?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          team_count?: number | null
          tier_label?: string | null
          tournament_type?:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Update: {
          created_at?: string
          finals_date?: string | null
          hr_per_rd?: number | null
          id?: string
          open_champion?: string | null
          open_prize?: number | null
          rp_value?: number | null
          season_id?: string
          series_format?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          team_count?: number | null
          tier_label?: string | null
          tournament_type?:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_open_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      league_open_matches: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          season_id: string | null
          series_number: number | null
          stage: Database["public"]["Enums"]["stage"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          season_id?: string | null
          series_number?: number | null
          stage?: Database["public"]["Enums"]["stage"] | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          season_id?: string | null
          series_number?: number | null
          stage?: Database["public"]["Enums"]["stage"] | null
        }
        Relationships: [
          {
            foreignKeyName: "league_open_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "league_open_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_open_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_open_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_open_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_open_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      league_playoff: {
        Row: {
          created_at: string
          finals_date: string | null
          hr_per_rd: number | null
          id: string
          playoff_champion: string | null
          playoff_prize: number | null
          rp_value: number | null
          season_id: string
          series_format: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          team_count: number | null
          tier: Database["public"]["Enums"]["event_tier"] | null
          tournament_type:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Insert: {
          created_at?: string
          finals_date?: string | null
          hr_per_rd?: number | null
          id?: string
          playoff_champion?: string | null
          playoff_prize?: number | null
          rp_value?: number | null
          season_id: string
          series_format?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          team_count?: number | null
          tier?: Database["public"]["Enums"]["event_tier"] | null
          tournament_type?:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Update: {
          created_at?: string
          finals_date?: string | null
          hr_per_rd?: number | null
          id?: string
          playoff_champion?: string | null
          playoff_prize?: number | null
          rp_value?: number | null
          season_id?: string
          series_format?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          team_count?: number | null
          tier?: Database["public"]["Enums"]["event_tier"] | null
          tournament_type?:
            | Database["public"]["Enums"]["tournament_format"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_playoff_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      league_playoff_matches: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          season_id: string | null
          series_number: number | null
          stage: Database["public"]["Enums"]["stage"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          season_id?: string | null
          series_number?: number | null
          stage?: Database["public"]["Enums"]["stage"] | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          season_id?: string | null
          series_number?: number | null
          stage?: Database["public"]["Enums"]["stage"] | null
        }
        Relationships: [
          {
            foreignKeyName: "league_playoff_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "league_playoff_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_playoff_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_playoff_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "league_playoff_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_playoff_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      league_rp_values: {
        Row: {
          created_at: string
          days_to_complete_decay: number | null
          decay_days_start: number | null
          decay_rate: number | null
          event_tier: Database["public"]["Enums"]["event_tier"] | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          league_id: string | null
          leagues: Database["public"]["Enums"]["leagues"] | null
          player_rp_bonus: number | null
          rp_max: number | null
          runner_up_rp: number | null
          winner_rp: number | null
        }
        Insert: {
          created_at?: string
          days_to_complete_decay?: number | null
          decay_days_start?: number | null
          decay_rate?: number | null
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          leagues?: Database["public"]["Enums"]["leagues"] | null
          player_rp_bonus?: number | null
          rp_max?: number | null
          runner_up_rp?: number | null
          winner_rp?: number | null
        }
        Update: {
          created_at?: string
          days_to_complete_decay?: number | null
          decay_days_start?: number | null
          decay_rate?: number | null
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          leagues?: Database["public"]["Enums"]["leagues"] | null
          player_rp_bonus?: number | null
          rp_max?: number | null
          runner_up_rp?: number | null
          winner_rp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_rp_values_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
        ]
      }
      league_seasons: {
        Row: {
          created_at: string
          end_date: string
          entry_fee: number | null
          id: string
          is_active: boolean | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"]
          prize_pool: number | null
          season_number: number
          start_date: string
          updated_at: string
          year: Database["public"]["Enums"]["game_year"] | null
        }
        Insert: {
          created_at?: string
          end_date: string
          entry_fee?: number | null
          id?: string
          is_active?: boolean | null
          league_id?: string | null
          league_name: Database["public"]["Enums"]["leagues"]
          prize_pool?: number | null
          season_number: number
          start_date: string
          updated_at?: string
          year?: Database["public"]["Enums"]["game_year"] | null
        }
        Update: {
          created_at?: string
          end_date?: string
          entry_fee?: number | null
          id?: string
          is_active?: boolean | null
          league_id?: string | null
          league_name?: Database["public"]["Enums"]["leagues"]
          prize_pool?: number | null
          season_number?: number
          start_date?: string
          updated_at?: string
          year?: Database["public"]["Enums"]["game_year"] | null
        }
        Relationships: [
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["league"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["league_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["organizer_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["organizer_name"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["organizer"]
          },
          {
            foreignKeyName: "league_seasons_league_name_fkey"
            columns: ["league_name"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_name"]
          },
        ]
      }
      leagues_info: {
        Row: {
          created_at: string
          id: string
          league: Database["public"]["Enums"]["leagues"] | null
          lg_discord: string | null
          lg_logo_url: string | null
          lg_rules_url: string | null
          lg_url: string | null
          sponsor_info: string | null
          twitch_url: string | null
          twitter_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          league?: Database["public"]["Enums"]["leagues"] | null
          lg_discord?: string | null
          lg_logo_url?: string | null
          lg_rules_url?: string | null
          lg_url?: string | null
          sponsor_info?: string | null
          twitch_url?: string | null
          twitter_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          league?: Database["public"]["Enums"]["leagues"] | null
          lg_discord?: string | null
          lg_logo_url?: string | null
          lg_rules_url?: string | null
          lg_url?: string | null
          sponsor_info?: string | null
          twitch_url?: string | null
          twitter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leagues_info_sponsor_info_fkey"
            columns: ["sponsor_info"]
            isOneToOne: false
            referencedRelation: "sponsor_info"
            referencedColumns: ["sponsor_name"]
          },
        ]
      }
      lg_conf: {
        Row: {
          abbr: string | null
          conf_logo: string | null
          created_at: string
          gm_yr: Database["public"]["Enums"]["game_year"] | null
          id: string
          league: string | null
          name: string | null
          season: string | null
        }
        Insert: {
          abbr?: string | null
          conf_logo?: string | null
          created_at?: string
          gm_yr?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league?: string | null
          name?: string | null
          season?: string | null
        }
        Update: {
          abbr?: string | null
          conf_logo?: string | null
          created_at?: string
          gm_yr?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league?: string | null
          name?: string | null
          season?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_conf_league_fkey"
            columns: ["league"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "lg_conf_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_conf_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_conf_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_conf_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_conf_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      lg_division_conferences: {
        Row: {
          conference_id: string
          created_at: string
          division_id: string
          id: string
        }
        Insert: {
          conference_id: string
          created_at?: string
          division_id: string
          id?: string
        }
        Update: {
          conference_id?: string
          created_at?: string
          division_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lg_division_conferences_conference_id_fkey"
            columns: ["conference_id"]
            isOneToOne: false
            referencedRelation: "lg_conf"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_division_conferences_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "lg_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      lg_divisions: {
        Row: {
          abbr: string | null
          conference_id: string | null
          created_at: string
          display_order: number | null
          division_logo: string | null
          id: string
          league_id: string | null
          name: string
          season_id: string | null
        }
        Insert: {
          abbr?: string | null
          conference_id?: string | null
          created_at?: string
          display_order?: number | null
          division_logo?: string | null
          id?: string
          league_id?: string | null
          name: string
          season_id?: string | null
        }
        Update: {
          abbr?: string | null
          conference_id?: string | null
          created_at?: string
          display_order?: number | null
          division_logo?: string | null
          id?: string
          league_id?: string | null
          name?: string
          season_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lg_divisions_conference_id_fkey"
            columns: ["conference_id"]
            isOneToOne: false
            referencedRelation: "lg_conf"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_divisions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      match_contexts: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          league_id: string | null
          match_id: string
          season_id: string | null
          submitted_by: string | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          league_id?: string | null
          match_id: string
          season_id?: string | null
          submitted_by?: string | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          league_id?: string | null
          match_id?: string
          season_id?: string | null
          submitted_by?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "match_contexts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_contexts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "match_contexts_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      match_mvp: {
        Row: {
          match_id: string
          player_id: string
        }
        Insert: {
          match_id: string
          player_id: string
        }
        Update: {
          match_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_mvp_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_mvp_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      match_points: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          match_id: string
          point_type: string
          points_earned: number
          team_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          match_id: string
          point_type: string
          points_earned: number
          team_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          match_id?: string
          point_type?: string
          points_earned?: number
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_points_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tournament_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_points_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_points_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_points_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      match_submissions: {
        Row: {
          created_at: string
          id: string
          ipfs_cid: string | null
          league_id: string | null
          match_id: string | null
          payload: Json | null
          played_at: string | null
          review_notes: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          season_id: string | null
          status: string | null
          submissions_upload_url: string | null
          team_a_id: string | null
          team_a_name: string | null
          team_b_id: string | null
          team_b_name: string | null
          tournament_id: string | null
          tx_hash: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ipfs_cid?: string | null
          league_id?: string | null
          match_id?: string | null
          payload?: Json | null
          played_at?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          season_id?: string | null
          status?: string | null
          submissions_upload_url?: string | null
          team_a_id?: string | null
          team_a_name?: string | null
          team_b_id?: string | null
          team_b_name?: string | null
          tournament_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ipfs_cid?: string | null
          league_id?: string | null
          match_id?: string | null
          payload?: Json | null
          played_at?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          season_id?: string | null
          status?: string | null
          submissions_upload_url?: string | null
          team_a_id?: string | null
          team_a_name?: string | null
          team_b_id?: string | null
          team_b_name?: string | null
          tournament_id?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_submissions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "match_submissions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_submissions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_submissions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_submissions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_submissions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_a_name_fkey"
            columns: ["team_a_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_team_b_name_fkey"
            columns: ["team_b_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_submissions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          boxscore_url: string | null
          game_number: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          league_id: string | null
          played_at: string | null
          possible_duplicate_of: string | null
          score_a: number | null
          score_b: number | null
          season_id: string | null
          stage: Database["public"]["Enums"]["stage"] | null
          status: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          verified: boolean
          winner_id: string | null
        }
        Insert: {
          boxscore_url?: string | null
          game_number?: number | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          played_at?: string | null
          possible_duplicate_of?: string | null
          score_a?: number | null
          score_b?: number | null
          season_id?: string | null
          stage?: Database["public"]["Enums"]["stage"] | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          verified?: boolean
          winner_id?: string | null
        }
        Update: {
          boxscore_url?: string | null
          game_number?: number | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          played_at?: string | null
          possible_duplicate_of?: string | null
          score_a?: number | null
          score_b?: number | null
          season_id?: string | null
          stage?: Database["public"]["Enums"]["stage"] | null
          status?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          verified?: boolean
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_possible_duplicate_of_fkey"
            columns: ["possible_duplicate_of"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "matches_possible_duplicate_of_fkey"
            columns: ["possible_duplicate_of"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_possible_duplicate_of_fkey"
            columns: ["possible_duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ocr_corrections: {
        Row: {
          corrected_gamertag: string
          corrected_player_id: string
          correction_type: string
          created_at: string | null
          created_by: string | null
          id: string
          match_context: Json | null
          match_id: string | null
          ocr_detected_name: string
          original_confidence: number | null
          player_stats_id: string | null
        }
        Insert: {
          corrected_gamertag: string
          corrected_player_id: string
          correction_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          match_context?: Json | null
          match_id?: string | null
          ocr_detected_name: string
          original_confidence?: number | null
          player_stats_id?: string | null
        }
        Update: {
          corrected_gamertag?: string
          corrected_player_id?: string
          correction_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          match_context?: Json | null
          match_id?: string | null
          ocr_detected_name?: string
          original_confidence?: number | null
          player_stats_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "ocr_corrections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "v_player_global_rating_per_game"
            referencedColumns: ["stat_id"]
          },
        ]
      }
      ocr_validations: {
        Row: {
          "auto-corrected": boolean | null
          created_at: string
          error: string | null
          id: string
          match_id: string | null
          player_stats_id: string | null
          verified: boolean | null
        }
        Insert: {
          "auto-corrected"?: boolean | null
          created_at?: string
          error?: string | null
          id?: string
          match_id?: string | null
          player_stats_id?: string | null
          verified?: boolean | null
        }
        Update: {
          "auto-corrected"?: boolean | null
          created_at?: string
          error?: string | null
          id?: string
          match_id?: string | null
          player_stats_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ocr_validations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "ocr_validations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_validations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_validations_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "player_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_validations_player_stats_id_fkey"
            columns: ["player_stats_id"]
            isOneToOne: false
            referencedRelation: "v_player_global_rating_per_game"
            referencedColumns: ["stat_id"]
          },
        ]
      }
      past_champions: {
        Row: {
          champion_logo: string | null
          console: Database["public"]["Enums"]["console"] | null
          created_at: string
          event_tier: Database["public"]["Enums"]["event_tier"] | null
          id: string
          is_tournament: boolean
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          lg_logo: string | null
          season: number | null
          season_id: string | null
          team_id: string | null
          team_name: string | null
          tournament_date: string | null
          tournament_id: string | null
          year: Database["public"]["Enums"]["game_year"] | null
        }
        Insert: {
          champion_logo?: string | null
          console?: Database["public"]["Enums"]["console"] | null
          created_at?: string
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          id?: string
          is_tournament?: boolean
          league_id?: string | null
          league_name?: Database["public"]["Enums"]["leagues"] | null
          lg_logo?: string | null
          season?: number | null
          season_id?: string | null
          team_id?: string | null
          team_name?: string | null
          tournament_date?: string | null
          tournament_id?: string | null
          year?: Database["public"]["Enums"]["game_year"] | null
        }
        Update: {
          champion_logo?: string | null
          console?: Database["public"]["Enums"]["console"] | null
          created_at?: string
          event_tier?: Database["public"]["Enums"]["event_tier"] | null
          id?: string
          is_tournament?: boolean
          league_id?: string | null
          league_name?: Database["public"]["Enums"]["leagues"] | null
          lg_logo?: string | null
          season?: number | null
          season_id?: string | null
          team_id?: string | null
          team_name?: string | null
          tournament_date?: string | null
          tournament_id?: string | null
          year?: Database["public"]["Enums"]["game_year"] | null
        }
        Relationships: [
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "past_champions_lg_logo_fkey"
            columns: ["lg_logo"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "past_champions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "past_champions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "past_champions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "past_champions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["team_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "past_champions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_awards: {
        Row: {
          asset_png_url: string | null
          asset_svg_url: string | null
          awarded_at: string
          game_year: Database["public"]["Enums"]["game_year"]
          id: string
          issuer: string
          league_id: string
          level: number
          match_id: string | null
          nft_mint_id: string | null
          player_id: string
          rule_id: string
          scope_key: string | null
          season_id: string | null
          sig_alg: string | null
          signature: string | null
          stats: Json | null
          tier: Database["public"]["Enums"]["achievement_tier"]
          title: string
          token_uri: string | null
          version: string
        }
        Insert: {
          asset_png_url?: string | null
          asset_svg_url?: string | null
          awarded_at?: string
          game_year: Database["public"]["Enums"]["game_year"]
          id?: string
          issuer?: string
          league_id: string
          level?: number
          match_id?: string | null
          nft_mint_id?: string | null
          player_id: string
          rule_id: string
          scope_key?: string | null
          season_id?: string | null
          sig_alg?: string | null
          signature?: string | null
          stats?: Json | null
          tier: Database["public"]["Enums"]["achievement_tier"]
          title: string
          token_uri?: string | null
          version?: string
        }
        Update: {
          asset_png_url?: string | null
          asset_svg_url?: string | null
          awarded_at?: string
          game_year?: Database["public"]["Enums"]["game_year"]
          id?: string
          issuer?: string
          league_id?: string
          level?: number
          match_id?: string | null
          nft_mint_id?: string | null
          player_id?: string
          rule_id?: string
          scope_key?: string | null
          season_id?: string | null
          sig_alg?: string | null
          signature?: string | null
          stats?: Json | null
          tier?: Database["public"]["Enums"]["achievement_tier"]
          title?: string
          token_uri?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "player_awards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_awards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_awards_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "achievement_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      player_badges: {
        Row: {
          badge_type: string
          created_at: string
          id: string
          ipfs_uri: string | null
          league_id: string | null
          match_id: number
          player_wallet: string
          season_id: string | null
          token_id: number | null
          tournament_id: string | null
          tx_hash: string | null
        }
        Insert: {
          badge_type: string
          created_at?: string
          id?: string
          ipfs_uri?: string | null
          league_id?: string | null
          match_id: number
          player_wallet: string
          season_id?: string | null
          token_id?: number | null
          tournament_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          badge_type?: string
          created_at?: string
          id?: string
          ipfs_uri?: string | null
          league_id?: string | null
          match_id?: number
          player_wallet?: string
          season_id?: string | null
          token_id?: number | null
          tournament_id?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_badges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "player_badges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_badges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_badges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_badges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_badges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_badges_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_counters: {
        Row: {
          ast_total: number
          blk_total: number
          created_at: string
          fga_total: number
          fgm_total: number
          fta_total: number
          ftm_total: number
          game_window: Json | null
          games_played: number
          has_50pt_game: boolean
          has_triple_double: boolean
          id: string
          player_id: string
          pts_total: number
          reb_total: number
          scope: Database["public"]["Enums"]["counter_scope"]
          season_id: string | null
          stl_total: number
          tov_total: number
          tpa_total: number
          tpm_total: number
          updated_at: string
        }
        Insert: {
          ast_total?: number
          blk_total?: number
          created_at?: string
          fga_total?: number
          fgm_total?: number
          fta_total?: number
          ftm_total?: number
          game_window?: Json | null
          games_played?: number
          has_50pt_game?: boolean
          has_triple_double?: boolean
          id?: string
          player_id: string
          pts_total?: number
          reb_total?: number
          scope: Database["public"]["Enums"]["counter_scope"]
          season_id?: string | null
          stl_total?: number
          tov_total?: number
          tpa_total?: number
          tpm_total?: number
          updated_at?: string
        }
        Update: {
          ast_total?: number
          blk_total?: number
          created_at?: string
          fga_total?: number
          fgm_total?: number
          fta_total?: number
          ftm_total?: number
          game_window?: Json | null
          games_played?: number
          has_50pt_game?: boolean
          has_triple_double?: boolean
          id?: string
          player_id?: string
          pts_total?: number
          reb_total?: number
          scope?: Database["public"]["Enums"]["counter_scope"]
          season_id?: string | null
          stl_total?: number
          tov_total?: number
          tpa_total?: number
          tpm_total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_counters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_counters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_counters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_counters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_counters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      player_handles: {
        Row: {
          alt_gt: string | null
          created_at: string
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          player_id: string
          primary_gt: string | null
          season_id: string | null
          tournament_id: string | null
          valid_from: string | null
          valid_to: string | null
          verified_at: string | null
        }
        Insert: {
          alt_gt?: string | null
          created_at?: string
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          player_id: string
          primary_gt?: string | null
          season_id?: string | null
          tournament_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          verified_at?: string | null
        }
        Update: {
          alt_gt?: string | null
          created_at?: string
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          player_id?: string
          primary_gt?: string | null
          season_id?: string | null
          tournament_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_handles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_handles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_handles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "player_handles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_handles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_handles_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_rating_weights: {
        Row: {
          bonus_points: number
          created_at: string | null
          description: string | null
          event_tier: Database["public"]["Enums"]["event_tier"]
          id: string
          weight_multiplier: number
        }
        Insert: {
          bonus_points: number
          created_at?: string | null
          description?: string | null
          event_tier: Database["public"]["Enums"]["event_tier"]
          id?: string
          weight_multiplier: number
        }
        Update: {
          bonus_points?: number
          created_at?: string | null
          description?: string | null
          event_tier?: Database["public"]["Enums"]["event_tier"]
          id?: string
          weight_multiplier?: number
        }
        Relationships: []
      }
      player_rp_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          league_id: string | null
          match_id: string | null
          player_id: string | null
          tournament_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          league_id?: string | null
          match_id?: string | null
          player_id?: string | null
          tournament_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          league_id?: string | null
          match_id?: string | null
          player_id?: string | null
          tournament_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "player_rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_salary_tiers: {
        Row: {
          id: number
          max_value: number | null
          min_value: number | null
          multiplier: number
          tier_name: string
        }
        Insert: {
          id?: number
          max_value?: number | null
          min_value?: number | null
          multiplier: number
          tier_name: string
        }
        Update: {
          id?: number
          max_value?: number | null
          min_value?: number | null
          multiplier?: number
          tier_name?: string
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          assists: number | null
          blocks: number | null
          created_at: string | null
          display_gt: string | null
          display_gt_resolved_at: string | null
          fga: number | null
          fgm: number | null
          fouls: number | null
          fta: number | null
          ftm: number | null
          grd: string | null
          id: string
          match_id: string
          needs_review: boolean | null
          player_id: string | null
          player_name: string | null
          plus_minus: number | null
          points: number | null
          ps: number | null
          rebounds: number | null
          slot_index: number | null
          steals: number | null
          team_id: string | null
          three_points_attempted: number | null
          three_points_made: number | null
          turnovers: number | null
          updated_at: string | null
          verified: boolean
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          display_gt?: string | null
          display_gt_resolved_at?: string | null
          fga?: number | null
          fgm?: number | null
          fouls?: number | null
          fta?: number | null
          ftm?: number | null
          grd?: string | null
          id?: string
          match_id: string
          needs_review?: boolean | null
          player_id?: string | null
          player_name?: string | null
          plus_minus?: number | null
          points?: number | null
          ps?: number | null
          rebounds?: number | null
          slot_index?: number | null
          steals?: number | null
          team_id?: string | null
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
          verified?: boolean
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          display_gt?: string | null
          display_gt_resolved_at?: string | null
          fga?: number | null
          fgm?: number | null
          fouls?: number | null
          fta?: number | null
          ftm?: number | null
          grd?: string | null
          id?: string
          match_id?: string
          needs_review?: boolean | null
          player_id?: string | null
          player_name?: string | null
          plus_minus?: number | null
          points?: number | null
          ps?: number | null
          rebounds?: number | null
          slot_index?: number | null
          steals?: number | null
          team_id?: string | null
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      player_stats_submissions: {
        Row: {
          assists: number | null
          blocks: number | null
          created_at: string | null
          display_gt: string | null
          display_gt_resolved_at: string | null
          fga: number | null
          fgm: number | null
          fouls: number | null
          fta: number | null
          ftm: number | null
          id: string
          match_id: string
          player_id: string | null
          player_name: string | null
          plus_minus: number | null
          points: number | null
          ps: number | null
          rebounds: number | null
          steals: number | null
          team_id: string
          three_points_attempted: number | null
          three_points_made: number | null
          turnovers: number | null
          updated_at: string | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          display_gt?: string | null
          display_gt_resolved_at?: string | null
          fga?: number | null
          fgm?: number | null
          fouls?: number | null
          fta?: number | null
          ftm?: number | null
          id?: string
          match_id: string
          player_id?: string | null
          player_name?: string | null
          plus_minus?: number | null
          points?: number | null
          ps?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          display_gt?: string | null
          display_gt_resolved_at?: string | null
          fga?: number | null
          fgm?: number | null
          fouls?: number | null
          fta?: number | null
          ftm?: number | null
          id?: string
          match_id?: string
          player_id?: string | null
          player_name?: string | null
          plus_minus?: number | null
          points?: number | null
          ps?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id?: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          alternate_gamertag: string | null
          created_at: string | null
          crew_affiliation: string | null
          crewName: string | null
          current_team_id: string | null
          currentTeamName: string | null
          discord_id: string | null
          gamertag: string
          id: string
          is_rookie: boolean | null
          monthly_value: number | null
          performance_score: number | null
          player_rank_score: number | null
          player_rp: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          salary_tier: Database["public"]["Enums"]["salary_tier"] | null
          twitch: string | null
          twitter_id: string | null
        }
        Insert: {
          alternate_gamertag?: string | null
          created_at?: string | null
          crew_affiliation?: string | null
          crewName?: string | null
          current_team_id?: string | null
          currentTeamName?: string | null
          discord_id?: string | null
          gamertag: string
          id?: string
          is_rookie?: boolean | null
          monthly_value?: number | null
          performance_score?: number | null
          player_rank_score?: number | null
          player_rp?: number | null
          position?: Database["public"]["Enums"]["player_position"] | null
          salary_tier?: Database["public"]["Enums"]["salary_tier"] | null
          twitch?: string | null
          twitter_id?: string | null
        }
        Update: {
          alternate_gamertag?: string | null
          created_at?: string | null
          crew_affiliation?: string | null
          crewName?: string | null
          current_team_id?: string | null
          currentTeamName?: string | null
          discord_id?: string | null
          gamertag?: string
          id?: string
          is_rookie?: boolean | null
          monthly_value?: number | null
          performance_score?: number | null
          player_rank_score?: number | null
          player_rp?: number | null
          position?: Database["public"]["Enums"]["player_position"] | null
          salary_tier?: Database["public"]["Enums"]["salary_tier"] | null
          twitch?: string | null
          twitter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_crew_affiliation_fkey"
            columns: ["crew_affiliation"]
            isOneToOne: false
            referencedRelation: "city_crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_crewName_fkey"
            columns: ["crewName"]
            isOneToOne: false
            referencedRelation: "city_crews"
            referencedColumns: ["crewName"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "players_currentTeamName_fkey"
            columns: ["currentTeamName"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
        ]
      }
      playlist: {
        Row: {
          created_at: string
          game_no: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          league_id: string | null
          season_id: string | null
          stage: Database["public"]["Enums"]["stage"] | null
          stream_url: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          game_no?: number | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          season_id?: string | null
          stage?: Database["public"]["Enums"]["stage"] | null
          stream_url?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          game_no?: number | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          league_id?: string | null
          season_id?: string | null
          stage?: Database["public"]["Enums"]["stage"] | null
          stream_url?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "playlist_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "playlist_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "playlist_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "playlist_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "playlist_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "playlist_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      profiles: {
        Row: {
          app_role: Database["public"]["Enums"]["app_role"] | null
          created_at: string | null
          email: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          app_role?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string | null
          email?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          app_role?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ranking_points: {
        Row: {
          awarded_at: string | null
          expires_at: string | null
          id: string
          league_id: string | null
          points: number | null
          source: string | null
          team_id: string | null
          tournament_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          expires_at?: string | null
          id?: string
          league_id?: string | null
          points?: number | null
          source?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          expires_at?: string | null
          id?: string
          league_id?: string | null
          points?: number | null
          source?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_points_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "ranking_points_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: string
          role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          id?: never
          permission: string
          role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          id?: never
          permission?: string
          role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      rp_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          last_decay_date: string | null
          league_id: string | null
          remaining_rp: number | null
          rp_decay_start: number | null
          season_id: string | null
          team_id: string | null
          tournament_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          last_decay_date?: string | null
          league_id?: string | null
          remaining_rp?: number | null
          rp_decay_start?: number | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          last_decay_date?: string | null
          league_id?: string | null
          remaining_rp?: number | null
          rp_decay_start?: number | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rp_transactions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "rp_transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "rp_transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "rp_transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "rp_transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rp_transactions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "rp_transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_tiers: {
        Row: {
          description: string | null
          id: number
          label: string | null
          max_rating: number | null
          min_rating: number | null
          multiplier: number
          salary_tier: Database["public"]["Enums"]["salary_tier"]
        }
        Insert: {
          description?: string | null
          id?: never
          label?: string | null
          max_rating?: number | null
          min_rating?: number | null
          multiplier: number
          salary_tier: Database["public"]["Enums"]["salary_tier"]
        }
        Update: {
          description?: string | null
          id?: never
          label?: string | null
          max_rating?: number | null
          min_rating?: number | null
          multiplier?: number
          salary_tier?: Database["public"]["Enums"]["salary_tier"]
        }
        Relationships: []
      }
      series_formats: {
        Row: {
          created_at: string | null
          id: string
          season_id: string
          series_format: string
          stage: string
          tournament_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          season_id: string
          series_format: string
          stage: string
          tournament_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          season_id?: string
          series_format?: string
          stage?: string
          tournament_type?: string | null
        }
        Relationships: []
      }
      sponsor_info: {
        Row: {
          created_at: string
          id: string
          sponsor_logo: string | null
          sponsor_name: string | null
          sponsor_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          sponsor_logo?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          sponsor_logo?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
        }
        Relationships: []
      }
      team_match_stats: {
        Row: {
          assists: number | null
          blocks: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          fouls: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          grd: string | null
          id: string
          match_id: string
          plus_minus: number | null
          points: number | null
          rebounds: number | null
          steals: number | null
          team_id: string
          three_points_attempted: number | null
          three_points_made: number | null
          turnovers: number | null
          verified: boolean
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          fouls?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          grd?: string | null
          id?: string
          match_id: string
          plus_minus?: number | null
          points?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          verified?: boolean
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          fouls?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          grd?: string | null
          id?: string
          match_id?: string
          plus_minus?: number | null
          points?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id?: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "team_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "team_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_match_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      team_match_stats_submissions: {
        Row: {
          assists: number | null
          blocks: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          fouls: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          id: string
          match_id: string
          plus_minus: number | null
          points: number | null
          rebounds: number | null
          steals: number | null
          team_id: string
          three_points_attempted: number | null
          three_points_made: number | null
          turnovers: number | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          fouls?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          id?: string
          match_id: string
          plus_minus?: number | null
          points?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          fouls?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          id?: string
          match_id?: string
          plus_minus?: number | null
          points?: number | null
          rebounds?: number | null
          steals?: number | null
          team_id?: string
          three_points_attempted?: number | null
          three_points_made?: number | null
          turnovers?: number | null
        }
        Relationships: []
      }
      team_rosters: {
        Row: {
          division_id: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          left_at: string | null
          player_id: string | null
          season_id: string | null
          team_id: string | null
          tournament_id: string | null
        }
        Insert: {
          division_id?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          is_captain?: boolean | null
          is_player_coach?: boolean | null
          joined_at?: string | null
          league_id?: string | null
          left_at?: string | null
          player_id?: string | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          division_id?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          is_captain?: boolean | null
          is_player_coach?: boolean | null
          joined_at?: string | null
          league_id?: string | null
          left_at?: string | null
          player_id?: string | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_rosters_division_id"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "lg_divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          current_rp: number | null
          elo_rating: number | null
          global_rank: number | null
          hybrid_score: number | null
          id: string
          is_active: boolean | null
          leaderboard_tier: string | null
          lg_conf: string | null
          logo_url: string | null
          money_won: number | null
          name: string
          player_rank_score: number | null
          team_twitter: string | null
        }
        Insert: {
          created_at?: string | null
          current_rp?: number | null
          elo_rating?: number | null
          global_rank?: number | null
          hybrid_score?: number | null
          id?: string
          is_active?: boolean | null
          leaderboard_tier?: string | null
          lg_conf?: string | null
          logo_url?: string | null
          money_won?: number | null
          name: string
          player_rank_score?: number | null
          team_twitter?: string | null
        }
        Update: {
          created_at?: string | null
          current_rp?: number | null
          elo_rating?: number | null
          global_rank?: number | null
          hybrid_score?: number | null
          id?: string
          is_active?: boolean | null
          leaderboard_tier?: string | null
          lg_conf?: string | null
          logo_url?: string | null
          money_won?: number | null
          name?: string
          player_rank_score?: number | null
          team_twitter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_lg_conf_fkey"
            columns: ["lg_conf"]
            isOneToOne: false
            referencedRelation: "lg_conf"
            referencedColumns: ["id"]
          },
        ]
      }
      teams_pot_tracker: {
        Row: {
          created_at: string
          id: string
          league_id: string | null
          placement: number | null
          prize_amount: number | null
          season_id: string | null
          team_id: string | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          league_id?: string | null
          placement?: number | null
          prize_amount?: number | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: string | null
          placement?: number | null
          prize_amount?: number | null
          season_id?: string | null
          team_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "teams_pot_tracker_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_group_members: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          seed: number | null
          team_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          seed?: number | null
          team_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          seed?: number | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tournament_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "event_group_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      tournament_groups: {
        Row: {
          advancement_count: number | null
          created_at: string | null
          description: string | null
          id: string
          league_season_id: string | null
          max_teams: number | null
          name: string
          sort_order: number | null
          status: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          advancement_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          league_season_id?: string | null
          max_teams?: number | null
          name: string
          sort_order?: number | null
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          advancement_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          league_season_id?: string | null
          max_teams?: number | null
          name?: string
          sort_order?: number | null
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_groups_league_season_id_fkey"
            columns: ["league_season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_groups_league_season_id_fkey"
            columns: ["league_season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_groups_league_season_id_fkey"
            columns: ["league_season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "event_groups_league_season_id_fkey"
            columns: ["league_season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_groups_league_season_id_fkey"
            columns: ["league_season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "event_groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          champion: string | null
          console: Database["public"]["Enums"]["console"] | null
          created_at: string
          decay_days: number | null
          description: string | null
          end_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string
          max_rp: number | null
          name: string | null
          organizer_id: string | null
          organizer_logo_url: string | null
          place: string | null
          prize_pool: number | null
          processed_at: string | null
          rules_url: string | null
          runner_up: string | null
          sponsor: string | null
          sponsor_logo: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          tier: Database["public"]["Enums"]["event_tier"] | null
        }
        Insert: {
          banner_url?: string | null
          champion?: string | null
          console?: Database["public"]["Enums"]["console"] | null
          created_at?: string
          decay_days?: number | null
          description?: string | null
          end_date?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          max_rp?: number | null
          name?: string | null
          organizer_id?: string | null
          organizer_logo_url?: string | null
          place?: string | null
          prize_pool?: number | null
          processed_at?: string | null
          rules_url?: string | null
          runner_up?: string | null
          sponsor?: string | null
          sponsor_logo?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          tier?: Database["public"]["Enums"]["event_tier"] | null
        }
        Update: {
          banner_url?: string | null
          champion?: string | null
          console?: Database["public"]["Enums"]["console"] | null
          created_at?: string
          decay_days?: number | null
          description?: string | null
          end_date?: string | null
          game_year?: Database["public"]["Enums"]["game_year"] | null
          id?: string
          max_rp?: number | null
          name?: string | null
          organizer_id?: string | null
          organizer_logo_url?: string | null
          place?: string | null
          prize_pool?: number | null
          processed_at?: string | null
          rules_url?: string | null
          runner_up?: string | null
          sponsor?: string | null
          sponsor_logo?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          tier?: Database["public"]["Enums"]["event_tier"] | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["place"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_sponsor_fkey"
            columns: ["sponsor"]
            isOneToOne: false
            referencedRelation: "sponsor_info"
            referencedColumns: ["sponsor_name"]
          },
          {
            foreignKeyName: "tournaments_sponsor_logo_fkey"
            columns: ["sponsor_logo"]
            isOneToOne: false
            referencedRelation: "sponsor_info"
            referencedColumns: ["sponsor_logo"]
          },
        ]
      }
      upcoming_matches: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          league_id: string | null
          match_number: number | null
          notes: string | null
          round: number | null
          scheduled_at: string
          status: string | null
          stream_url: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          league_id?: string | null
          match_number?: number | null
          notes?: string | null
          round?: number | null
          scheduled_at: string
          status?: string | null
          stream_url?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          league_id?: string | null
          match_number?: number | null
          notes?: string | null
          round?: number | null
          scheduled_at?: string
          status?: string | null
          stream_url?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upcoming_matches_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tournament_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upcoming_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "upcoming_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      update_race: {
        Row: {
          id: number
          new_rank: number | null
          previous_rank: number | null
          race_id: string | null
          update_details: Json | null
          update_type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: never
          new_rank?: number | null
          previous_rank?: number | null
          race_id?: string | null
          update_details?: Json | null
          update_type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: never
          new_rank?: number | null
          previous_rank?: number | null
          race_id?: string | null
          update_details?: Json | null
          update_type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "update_race_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "awards_race"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["app_role"] | null
          role_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          role?: Database["public"]["Enums"]["app_role"] | null
          role_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          role?: Database["public"]["Enums"]["app_role"] | null
          role_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_config: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      achievement_eligibility_mart: {
        Row: {
          active_season_avg_points: number | null
          active_season_games: number | null
          active_season_league: string | null
          active_season_number: string | null
          active_streak_length: number | null
          active_streak_type: string | null
          assists_milestone_achieved: string | null
          assists_to_next_milestone: number | null
          century_club_eligible: string | null
          consistent_scorer_eligible: string | null
          current_team: string | null
          current_team_id: string | null
          fifty_point_eligible: string | null
          gamertag: string | null
          games_milestone_achieved: string | null
          next_achievement_alert: string | null
          player_id: string | null
          points_milestone_achieved: string | null
          points_to_next_milestone: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          rebounds_milestone_achieved: string | null
          season_award_eligible: string | null
          streak_last_game: string | null
          total_achievements_earned: number | null
          total_assists: number | null
          total_blocks: number | null
          total_games: number | null
          total_points: number | null
          total_rebounds: number | null
          total_steals: number | null
          triple_double_eligible: string | null
          veteran_eligible: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      event_strength_metrics_mv: {
        Row: {
          bracket_component: number | null
          bracket_size: number | null
          calculated_at: string | null
          event_key: string | null
          event_name: string | null
          event_strength: number | null
          event_type: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          hybrid_strength_component: number | null
          lan_bonus_component: number | null
          organizer_name: string | null
          parity_component: number | null
          player_value_component: number | null
          prize_pool: number | null
          prize_pool_component: number | null
          recent_strength_component: number | null
          rp_cap: number | null
          season_id: string | null
          start_date: string | null
          team_count: number | null
          tier_label: string | null
          tier_score: number | null
          top_field_component: number | null
          tournament_id: string | null
        }
        Relationships: []
      }
      head_to_head_matchup_mart: {
        Row: {
          avg_score_differential: number | null
          current_winner: string | null
          days_since_last_meeting: number | null
          first_meeting: string | null
          game_years: Database["public"]["Enums"]["game_year"][] | null
          last_meeting: string | null
          league_ids: string[] | null
          league_meetings: number | null
          team_1_avg_score: number | null
          team_1_id: string | null
          team_1_last_5_wins: number | null
          team_1_logo: string | null
          team_1_name: string | null
          team_1_wins: number | null
          team_2_avg_score: number | null
          team_2_id: string | null
          team_2_last_5_wins: number | null
          team_2_logo: string | null
          team_2_name: string | null
          team_2_wins: number | null
          total_meetings: number | null
          tournament_ids: string[] | null
          tournament_meetings: number | null
        }
        Relationships: []
      }
      league_calendar: {
        Row: {
          champion_id: string | null
          champion_logo: string | null
          champion_name: string | null
          championship_date: string | null
          discord_link: string | null
          end_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          is_active: boolean | null
          last_match_date: string | null
          league_id: string | null
          league_logo: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          league_status: string | null
          league_website: string | null
          next_match_time: string | null
          season_id: string | null
          season_number: number | null
          sort_order: number | null
          start_date: string | null
          total_matches: number | null
          tournament_count: number | null
          twitch_url: string | null
          twitter_id: string | null
          upcoming_matches_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_logo"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["logo_url"]
          },
          {
            foreignKeyName: "past_champions_champion_logo_fkey"
            columns: ["champion_logo"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_logo"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_id_fkey"
            columns: ["champion_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "past_champions_team_name_fkey"
            columns: ["champion_name"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
        ]
      }
      league_division_standings: {
        Row: {
          conference_abbrs: string[] | null
          conference_ids: string[] | null
          conference_names: string[] | null
          division_abbr: string | null
          division_display_order: number | null
          division_id: string | null
          division_logo: string | null
          division_name: string | null
          division_rank: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          games_played: number | null
          last_5_streak: string | null
          league_name: string | null
          losses: number | null
          overall_rank: number | null
          point_differential_per_game: number | null
          points_against: number | null
          points_for: number | null
          season_id: string | null
          season_number: number | null
          team_id: string | null
          team_logo: string | null
          team_name: string | null
          win_percentage: number | null
          wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_rosters_division_id"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "lg_divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      league_results: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          conference_name: string | null
          current_rp: number | null
          elo_rating: number | null
          fg_percentage: number | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          logo_url: string | null
          losses: number | null
          point_differential: number | null
          points_against: number | null
          points_for: number | null
          roster: Json | null
          season_id: string | null
          season_number: number | null
          stat_leaders: Json | null
          team_id: string | null
          team_name: string | null
          team_rankings: Json | null
          three_pt_percentage: number | null
          win_percentage: number | null
          wins: number | null
          year: Database["public"]["Enums"]["game_year"] | null
        }
        Relationships: []
      }
      league_season_performance_mart: {
        Row: {
          avg_total_points_per_game: number | null
          best_record_team: string | null
          division_stats: Json | null
          end_date: string | null
          first_match_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          is_active: boolean | null
          last_match_date: string | null
          league: string | null
          league_id: string | null
          league_name: string | null
          league_tier: string | null
          lg_logo_url: string | null
          open_champion: string | null
          open_end: string | null
          open_prize: number | null
          open_start: string | null
          open_status: Database["public"]["Enums"]["status"] | null
          open_team_count: number | null
          playoff_champion: string | null
          playoff_end: string | null
          playoff_prize: number | null
          playoff_start: string | null
          playoff_status: Database["public"]["Enums"]["status"] | null
          playoff_team_count: number | null
          prize_pool: number | null
          season_id: string | null
          season_number: number | null
          start_date: string | null
          top_scorers: string[] | null
          total_assists: number | null
          total_blocks: number | null
          total_divisions: number | null
          total_matches: number | null
          total_players: number | null
          total_points_scored: number | null
          total_rebounds: number | null
          total_registered_players: number | null
          total_steals: number | null
          total_unique_teams: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_open_open_champion_fkey"
            columns: ["open_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_1_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "head_to_head_matchup_mart"
            referencedColumns: ["team_2_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_division_standings"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_a_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["team_b_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["winner_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_league_season_stats_mart"
            referencedColumns: ["season_team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_current"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "team_roster_history"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["current_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["champion_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["runner_up_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["third_place_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["champion_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["runner_up_team"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_rosters"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_playoff_playoff_champion_fkey"
            columns: ["playoff_champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_name"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
        ]
      }
      league_season_team_rosters: {
        Row: {
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          left_at: string | null
          player_id: string | null
          player_name: string | null
          player_position: Database["public"]["Enums"]["player_position"] | null
          season_id: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      league_team_rosters: {
        Row: {
          id: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          left_at: string | null
          player_id: string | null
          player_name: string | null
          player_position: Database["public"]["Enums"]["player_position"] | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: []
      }
      match_analytics_mart: {
        Row: {
          boxscore_url: string | null
          fiscal_quarter: string | null
          game_number: number | null
          game_type: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          has_primary_context: boolean | null
          league_ids: string[] | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          match_id: string | null
          month: number | null
          mvp_name: string | null
          mvp_player_id: string | null
          played_at: string | null
          quarter: number | null
          score_a: number | null
          score_b: number | null
          score_differential: number | null
          season_ids: string[] | null
          stage: Database["public"]["Enums"]["stage"] | null
          status: string | null
          team_a_assists: number | null
          team_a_blocks: number | null
          team_a_id: string | null
          team_a_logo: string | null
          team_a_name: string | null
          team_a_points: number | null
          team_a_rebounds: number | null
          team_a_steals: number | null
          team_a_turnovers: number | null
          team_b_assists: number | null
          team_b_blocks: number | null
          team_b_id: string | null
          team_b_logo: string | null
          team_b_name: string | null
          team_b_points: number | null
          team_b_rebounds: number | null
          team_b_steals: number | null
          team_b_turnovers: number | null
          total_player_stats: number | null
          tournament_ids: string[] | null
          tournament_name: string | null
          verified: boolean | null
          winner_id: string | null
          winner_name: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      ocr_correction_patterns: {
        Row: {
          avg_confidence: number | null
          corrected_gamertag: string | null
          corrected_player_id: string | null
          last_corrected_at: string | null
          occurrence_count: number | null
          ocr_detected_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "ocr_corrections_corrected_player_id_fkey"
            columns: ["corrected_player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      ocr_correction_stats: {
        Row: {
          correction_type: string | null
          count_by_type: number | null
          total_corrections: number | null
          unique_ocr_names: number | null
          unique_players: number | null
        }
        Relationships: []
      }
      past_champions_by_league: {
        Row: {
          champion_teams: string[] | null
          championship_count: number | null
          consoles: Database["public"]["Enums"]["console"][] | null
          event_tiers: Database["public"]["Enums"]["event_tier"][] | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          years: Database["public"]["Enums"]["game_year"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_champions_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
        ]
      }
      past_champions_by_year: {
        Row: {
          champion_teams: string[] | null
          championship_count: number | null
          consoles: Database["public"]["Enums"]["console"][] | null
          event_tiers: Database["public"]["Enums"]["event_tier"][] | null
          leagues: Database["public"]["Enums"]["leagues"][] | null
          year: Database["public"]["Enums"]["game_year"] | null
        }
        Relationships: []
      }
      player_hot_streak_mart: {
        Row: {
          career_avg_performance: number | null
          career_avg_points: number | null
          current_team: string | null
          current_team_id: string | null
          form_trend: string | null
          gamertag: string | null
          games_last_10: number | null
          games_last_20: number | null
          games_last_5: number | null
          last_10_avg_assists: number | null
          last_10_avg_performance: number | null
          last_10_avg_points: number | null
          last_10_avg_rebounds: number | null
          last_20_avg_assists: number | null
          last_20_avg_performance: number | null
          last_20_avg_points: number | null
          last_20_avg_rebounds: number | null
          last_5_avg_assists: number | null
          last_5_avg_performance: number | null
          last_5_avg_points: number | null
          last_5_avg_rebounds: number | null
          perf_vs_position_avg_pct: number | null
          performance_consistency_stddev: number | null
          performance_form_vs_career_pct: number | null
          player_id: string | null
          points_consistency_stddev: number | null
          points_form_vs_career_pct: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          pts_vs_position_avg_pct: number | null
          total_career_games: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      player_league_season_stats_mart: {
        Row: {
          apg: number | null
          avg_performance_score: number | null
          bpg: number | null
          division_abbr: string | null
          division_id: string | null
          division_name: string | null
          fg_pct: number | null
          ft_pct: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          games_played: number | null
          is_captain: boolean | null
          league_id: string | null
          league_name: string | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          potential_season_award: string | null
          ppg: number | null
          rpg: number | null
          season_assists_rank: number | null
          season_high_assists: number | null
          season_high_points: number | null
          season_high_rebounds: number | null
          season_id: string | null
          season_last_game: string | null
          season_number: number | null
          season_performance_rank: number | null
          season_points_rank: number | null
          season_rebounds_rank: number | null
          season_start_date: string | null
          season_team_id: string | null
          season_team_name: string | null
          spg: number | null
          three_pt_pct: number | null
          total_assists: number | null
          total_blocks: number | null
          total_points: number | null
          total_rebounds: number | null
          total_steals: number | null
          total_turnovers: number | null
          tpg: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_rosters_division_id"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "lg_divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      player_performance_by_game_year: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_performance_score: number | null
          avg_plus_minus: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          games_20plus_points: number | null
          matches_played: number | null
          mvp_count: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          total_assists: number | null
          total_blocks: number | null
          total_points: number | null
          total_rebounds: number | null
          total_steals: number | null
        }
        Relationships: []
      }
      player_performance_mart: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_fg_pct: number | null
          avg_ft_pct: number | null
          avg_performance_score: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_three_pct: number | null
          avg_turnovers: number | null
          current_team_id: string | null
          days_since_last_game: number | null
          gamertag: string | null
          games_played: number | null
          global_rating: number | null
          is_captain: boolean | null
          last_game_date: string | null
          league_ids: string[] | null
          max_performance_score: number | null
          player_id: string | null
          player_rank_score: number | null
          player_rp: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          rating_tier: string | null
          recent_avg_performance_score: number | null
          recent_avg_points: number | null
          recent_games: number | null
          season_ids: string[] | null
          team_name: string | null
          total_achievements: number | null
          tournament_ids: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      player_performance_view: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_performance_score: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          current_team_id: string | null
          gamertag: string | null
          games_played: number | null
          id: string | null
          monthly_value: number | null
          player_rank_score: number | null
          player_rp: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          salary_tier: Database["public"]["Enums"]["salary_tier"] | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      player_roster_history: {
        Row: {
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          id: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          left_at: string | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          season_number: number | null
          status: string | null
          team_id: string | null
          team_name: string | null
          tournament_id: string | null
          tournament_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats_by_league_season: {
        Row: {
          assists: number | null
          avg_assists: number | null
          avg_blocks: number | null
          avg_fouls: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          blocks: number | null
          fga: number | null
          fgm: number | null
          fouls: number | null
          fta: number | null
          ftm: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          games_played: number | null
          league_id: string | null
          league_season_id: string | null
          performance_score: number | null
          player_gamertag: string | null
          player_id: string | null
          plus_minus: number | null
          points: number | null
          rebounds: number | null
          season_number: number | null
          steals: number | null
          three_points_attempted: number | null
          three_points_made: number | null
          turnovers: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      player_stats_tracking_mart: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          career_assists: number | null
          career_blocks: number | null
          career_games: number | null
          career_high_assists: number | null
          career_high_blocks: number | null
          career_high_points: number | null
          career_high_rebounds: number | null
          career_high_steals: number | null
          career_points: number | null
          career_rebounds: number | null
          career_steals: number | null
          career_turnovers: number | null
          count_10ast_games: number | null
          count_10reb_games: number | null
          count_30pt_games: number | null
          count_40pt_games: number | null
          count_50pt_games: number | null
          count_5blk_games: number | null
          count_5stl_games: number | null
          count_dbl_ast_reb: number | null
          count_dbl_pt_ast: number | null
          count_dbl_pt_reb: number | null
          count_double_doubles: number | null
          count_triple_doubles: number | null
          current_team: string | null
          current_team_id: string | null
          days_since_last_game: number | null
          fg_pct: number | null
          first_game_date: string | null
          ft_pct: number | null
          gamertag: string | null
          global_rating: number | null
          last_10_avg_assists: number | null
          last_10_avg_points: number | null
          last_10_avg_rebounds: number | null
          last_game_date: string | null
          league_ids: string[] | null
          leagues_played: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          rating_tier: string | null
          season_ids: string[] | null
          seasons_played: number | null
          three_pt_pct: number | null
          tournament_ids: string[] | null
          tournaments_played: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      roster_value_comparison_mart: {
        Row: {
          a_tier_players: number | null
          avg_big_rating: number | null
          avg_guard_rating: number | null
          avg_lock_rating: number | null
          avg_player_value: number | null
          avg_roster_rating: number | null
          b_tier_players: number | null
          bench_players: number | null
          c_tier_players: number | null
          captain_id: string | null
          captain_name: string | null
          center_rank: number | null
          d_tier_players: number | null
          elite_players: number | null
          lock_rank: number | null
          logo_url: string | null
          pf_rank: number | null
          pg_rank: number | null
          player_coaches: number | null
          positional_balance_score: number | null
          role_players: number | null
          roster_depth_status: string | null
          roster_size: number | null
          roster_tier_assessment: string | null
          s_tier_players: number | null
          sg_rank: number | null
          team_id: string | null
          team_name: string | null
          total_big_value: number | null
          total_bigs: number | null
          total_guard_value: number | null
          total_guards: number | null
          total_lock_value: number | null
          total_locks: number | null
          total_roster_value: number | null
        }
        Relationships: []
      }
      team_analytics_mart: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_fg_pct: number | null
          avg_player_rating: number | null
          avg_points_allowed: number | null
          avg_points_scored: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_three_pct: number | null
          avg_turnovers: number | null
          current_rp: number | null
          days_since_last_game: number | null
          division_abbr: string | null
          division_id: string | null
          division_name: string | null
          division_season_id: string | null
          elite_players: number | null
          elo_rating: number | null
          games_played: number | null
          hybrid_score: number | null
          last_game_date: string | null
          league_ids: string[] | null
          leagues_played: number | null
          logo_url: string | null
          losses: number | null
          player_ids: string[] | null
          role_players: number | null
          roster_size: number | null
          rp_tier: string | null
          starter_players: number | null
          team_id: string | null
          team_name: string | null
          team_twitter: string | null
          total_achievements: number | null
          total_prize_money: number | null
          tournament_ids: string[] | null
          tournament_wins: number | null
          tournaments_played: number | null
          win_percentage: number | null
          wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_rosters_division_id"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "lg_divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["division_season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["division_season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["division_season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["division_season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lg_divisions_season_id_fkey"
            columns: ["division_season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
        ]
      }
      team_momentum_indicators_mart: {
        Row: {
          avg_rest_days_last_10: number | null
          current_elo: number | null
          current_loss_streak: number | null
          current_rp: number | null
          current_win_streak: number | null
          last_10_avg_allowed: number | null
          last_10_avg_scored: number | null
          last_10_games: number | null
          last_10_point_diff: number | null
          last_10_win_pct: number | null
          last_10_wins: number | null
          last_20_avg_allowed: number | null
          last_20_avg_scored: number | null
          last_20_games: number | null
          last_20_point_diff: number | null
          last_20_win_pct: number | null
          last_20_wins: number | null
          last_5_avg_allowed: number | null
          last_5_avg_scored: number | null
          last_5_games: number | null
          last_5_point_diff: number | null
          last_5_win_pct: number | null
          last_5_wins: number | null
          league_games_last_10: number | null
          league_win_rate_last_10: number | null
          logo_url: string | null
          momentum_status: string | null
          team_id: string | null
          team_name: string | null
          tournament_games_last_10: number | null
          tournament_win_rate_last_10: number | null
        }
        Relationships: []
      }
      team_performance_by_game_year: {
        Row: {
          avg_points_allowed: number | null
          avg_points_scored: number | null
          best_placement: number | null
          current_elo: number | null
          current_ranking_points: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          matches_lost: number | null
          matches_won: number | null
          points_allowed: number | null
          points_scored: number | null
          team_id: string | null
          team_name: string | null
          total_matches: number | null
          total_prize_amount: number | null
          tournament_placements: number | null
          win_percentage: number | null
        }
        Relationships: []
      }
      team_performance_view: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_field_goals_attempted: number | null
          avg_field_goals_made: number | null
          avg_points_per_match: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_three_points_attempted: number | null
          avg_three_points_made: number | null
          avg_turnovers: number | null
          championship_count: number | null
          current_roster_count: number | null
          current_rp: number | null
          elo_rating: number | null
          field_goal_percentage: number | null
          global_rank: number | null
          leaderboard_tier: string | null
          logo_url: string | null
          matches_lost: number | null
          matches_won: number | null
          money_won: number | null
          roster_last_changed: string | null
          team_id: string | null
          team_name: string | null
          three_point_percentage: number | null
          total_matches_played: number | null
          total_prize_earnings: number | null
          tournament_appearances: number | null
          tournament_wins: number | null
          win_percentage: number | null
        }
        Relationships: []
      }
      team_roster_current: {
        Row: {
          gamertag: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          monthly_value: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          salary_tier: Database["public"]["Enums"]["salary_tier"] | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      team_roster_history: {
        Row: {
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          id: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          league_name: Database["public"]["Enums"]["leagues"] | null
          left_at: string | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          season_number: number | null
          status: string | null
          team_id: string | null
          team_logo: string | null
          team_name: string | null
          tournament_id: string | null
          tournament_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      top_tournament_performers: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_performance_score: number | null
          avg_plus_minus: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          current_team: string | null
          current_team_id: string | null
          fg_percentage: number | null
          ft_percentage: number | null
          gamertag: string | null
          games_won: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          three_pt_percentage: number | null
          total_games: number | null
          tournaments_played: number | null
          tournaments_won: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "players_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      tournament_calendar: {
        Row: {
          banner_url: string | null
          champion: string | null
          champion_logo: string | null
          champion_name: string | null
          description: string | null
          end_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string | null
          league_logo: string | null
          next_match_time: string | null
          organizer_logo_url: string | null
          organizer_name: Database["public"]["Enums"]["leagues"] | null
          prize_pool: number | null
          runner_up: string | null
          runner_up_logo: string | null
          runner_up_name: string | null
          sort_order: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          third_place_id: string | null
          third_place_logo: string | null
          third_place_name: string | null
          tier: Database["public"]["Enums"]["event_tier"] | null
          tournament_name: string | null
          tournament_status: string | null
          upcoming_matches_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_champion_fkey"
            columns: ["champion"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["lg_logo_url"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["league_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "tournaments_organizer_logo_url_fkey"
            columns: ["organizer_logo_url"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["organizer_logo"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_place_fkey"
            columns: ["third_place_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tournaments_runner_up_fkey"
            columns: ["runner_up"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      tournament_champions_by_year: {
        Row: {
          champion_logo: string | null
          champion_team_id: string | null
          champion_team_name: string | null
          console: Database["public"]["Enums"]["console"] | null
          end_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          organizer_logo: string | null
          organizer_name: Database["public"]["Enums"]["leagues"] | null
          prize_pool: number | null
          start_date: string | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_tier: Database["public"]["Enums"]["event_tier"] | null
        }
        Relationships: []
      }
      tournament_mvps: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_performance_score: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          award_type: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          games_played: number | null
          is_champion: boolean | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          team_id: string | null
          team_name: string | null
          tournament_id: string | null
          tournament_name: string | null
        }
        Relationships: []
      }
      tournament_performance_mart: {
        Row: {
          avg_total_points_per_game: number | null
          banner_url: string | null
          calculated_tier: string | null
          champion_team: string | null
          console: Database["public"]["Enums"]["console"] | null
          end_date: string | null
          event_strength: number | null
          first_match_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          group_count: number | null
          group_names: string | null
          is_completed: boolean | null
          is_past_event: boolean | null
          last_match_date: string | null
          organizer: Database["public"]["Enums"]["leagues"] | null
          organizer_logo: string | null
          planned_team_capacity: number | null
          prize_pool: number | null
          runner_up_team: string | null
          sponsor: string | null
          sponsor_logo: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          tier_score: number | null
          top_3_teams: string | null
          total_matches: number | null
          total_players: number | null
          total_points_scored: number | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_tier: Database["public"]["Enums"]["event_tier"] | null
          unique_teams: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_sponsor_fkey"
            columns: ["sponsor"]
            isOneToOne: false
            referencedRelation: "sponsor_info"
            referencedColumns: ["sponsor_name"]
          },
          {
            foreignKeyName: "tournaments_sponsor_logo_fkey"
            columns: ["sponsor_logo"]
            isOneToOne: false
            referencedRelation: "sponsor_info"
            referencedColumns: ["sponsor_logo"]
          },
        ]
      }
      tournament_player_stats: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_fouls: number | null
          avg_performance_score: number | null
          avg_plus_minus: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          fg_percentage: number | null
          ft_percentage: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          gamertag: string | null
          games_played: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          team_id: string | null
          team_name: string | null
          three_pt_percentage: number | null
          total_3pa: number | null
          total_3pm: number | null
          total_assists: number | null
          total_blocks: number | null
          total_fga: number | null
          total_fgm: number | null
          total_fouls: number | null
          total_fta: number | null
          total_ftm: number | null
          total_performance_score: number | null
          total_plus_minus: number | null
          total_points: number | null
          total_rebounds: number | null
          total_steals: number | null
          total_turnovers: number | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_tier: Database["public"]["Enums"]["event_tier"] | null
        }
        Relationships: []
      }
      tournament_results: {
        Row: {
          avg_assists: number | null
          avg_blocks: number | null
          avg_points: number | null
          avg_rebounds: number | null
          avg_steals: number | null
          avg_turnovers: number | null
          awards: Json | null
          current_rp: number | null
          elo_rating: number | null
          end_date: string | null
          fg_percentage: number | null
          final_placement: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          group_standings: Json | null
          groups: string | null
          logo_url: string | null
          losses: number | null
          organizer_id: string | null
          organizer_name: Database["public"]["Enums"]["leagues"] | null
          point_differential: number | null
          points_against: number | null
          points_for: number | null
          prize_pool: number | null
          prize_won: number | null
          roster: Json | null
          start_date: string | null
          stat_leaders: Json | null
          team_id: string | null
          team_name: string | null
          team_rankings: Json | null
          three_pt_percentage: number | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_status: Database["public"]["Enums"]["status"] | null
          tournament_tier: Database["public"]["Enums"]["event_tier"] | null
          win_percentage: number | null
          wins: number | null
        }
        Relationships: []
      }
      tournament_team_rosters: {
        Row: {
          discord_id: string | null
          end_date: string | null
          gamertag: string | null
          id: string | null
          is_captain: boolean | null
          is_player_coach: boolean | null
          joined_at: string | null
          league_id: string | null
          left_at: string | null
          player_id: string | null
          player_rank_score: number | null
          position: Database["public"]["Enums"]["player_position"] | null
          salary_tier: Database["public"]["Enums"]["salary_tier"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["status"] | null
          team_id: string | null
          team_logo: string | null
          team_name: string | null
          tournament_id: string | null
          tournament_name: string | null
          twitter_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "team_rosters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_team_stats: {
        Row: {
          avg_team_assists: number | null
          avg_team_blocks: number | null
          avg_team_points: number | null
          avg_team_rebounds: number | null
          avg_team_steals: number | null
          avg_team_turnovers: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          games_lost: number | null
          games_played: number | null
          games_won: number | null
          team_fg_percentage: number | null
          team_ft_percentage: number | null
          team_id: string | null
          team_name: string | null
          team_three_pt_percentage: number | null
          tournament_id: string | null
          tournament_name: string | null
          tournament_result: string | null
          tournament_tier: Database["public"]["Enums"]["event_tier"] | null
          win_percentage: number | null
        }
        Relationships: []
      }
      v_matches_with_primary_context: {
        Row: {
          boxscore_url: string | null
          game_number: number | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          id: string | null
          league_id: string | null
          played_at: string | null
          primary_league_id: string | null
          primary_season_id: string | null
          primary_tournament_id: string | null
          score_a: number | null
          score_b: number | null
          season_id: string | null
          stage: Database["public"]["Enums"]["stage"] | null
          status: string | null
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string | null
          verified: boolean | null
          winner_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_league_id_fkey"
            columns: ["primary_league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["primary_season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["primary_season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["primary_season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["primary_season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_season_id_fkey"
            columns: ["primary_season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "match_contexts_tournament_id_fkey"
            columns: ["primary_tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "roster_value_comparison_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_analytics_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_momentum_indicators_mart"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_by_game_year"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_performance_view"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["champion_team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["team_id"]
          },
        ]
      }
      v_player_game_per: {
        Row: {
          game_date: string | null
          league_id: string | null
          league_ts_avg: number | null
          match_id: string | null
          month: string | null
          player_id: string | null
          raw_score: number | null
          season_id: string | null
          tournament_id: string | null
          ts_pct: number | null
          ts_plus: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      v_player_global_rating: {
        Row: {
          base_rating: number | null
          consistency_bonus: number | null
          days_since_last_game: number | null
          decay_penalty: number | null
          event_bonus: number | null
          game_impact: number | null
          gamertag: string | null
          global_rating: number | null
          peak_performance: number | null
          player_id: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          rating_tier: string | null
          recent_games: number | null
          total_games: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      v_player_global_rating_per_game: {
        Row: {
          assists: number | null
          blocks: number | null
          days_ago: number | null
          event_tier: Database["public"]["Enums"]["event_tier"] | null
          game_date: string | null
          game_year: Database["public"]["Enums"]["game_year"] | null
          league_avg_points: number | null
          league_avg_ts: number | null
          league_id: string | null
          match_id: string | null
          player_id: string | null
          points: number | null
          raw_score: number | null
          rebounds: number | null
          season_id: string | null
          stat_id: string | null
          steals: number | null
          tier_bonus: number | null
          tournament_id: string | null
          ts_pct: number | null
          ts_plus: number | null
          turnovers: number | null
          weight_multiplier: number | null
          weighted_game_impact: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_analytics_mart"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "v_matches_with_primary_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      v_player_monthly_per: {
        Row: {
          games_played: number | null
          league_id: string | null
          month: string | null
          per_raw: number | null
          per15: number | null
          player_id: string | null
          season_id: string | null
          tournament_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
      v_player_yearly_per: {
        Row: {
          game_year: Database["public"]["Enums"]["game_year"] | null
          games_played: number | null
          league_id: string | null
          per_raw: number | null
          per15: number | null
          player_id: string | null
          season_id: string | null
          tournament_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["organizer_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_calendar"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_results"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_season_performance_mart"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "player_stats_by_league_season"
            referencedColumns: ["league_season_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_champions_by_year"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_performance_mart"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_results"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournament_team_stats"
            referencedColumns: ["tournament_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "achievement_eligibility_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_season_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "league_team_rosters"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_hot_streak_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_by_game_year"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_performance_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_stats_tracking_mart"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "top_tournament_performers"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_mvps"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_player_stats"
            referencedColumns: ["player_id"]
          },
        ]
      }
    }
    Functions: {
      _sign_payload: {
        Args: { payload: Json }
        Returns: string
      }
      analyze_elo_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          elo_range: string
          percentage: number
          team_count: number
        }[]
      }
      apply_rp_decay: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_role: {
        Args: { role_to_assign: string; target_user_id: string }
        Returns: boolean
      }
      assign_role_to_user: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      calculate_all_player_salaries: {
        Args: Record<PropertyKey, never>
        Returns: {
          monthly_value: number
          player_name: string
          player_uuid: string
          raw_score: number
          tier_name: string
        }[]
      }
      calculate_hybrid_score: {
        Args: { team_id_param: string }
        Returns: number
      }
      calculate_normalized_elo: {
        Args: Record<PropertyKey, never> | { team_id_param: string }
        Returns: number
      }
      calculate_normalized_rp: {
        Args: { team_id_param: string }
        Returns: number
      }
      calculate_player_salary: {
        Args: { player_uuid: string }
        Returns: {
          monthly_value: number
          player_name: string
          raw_score: number
          tier_name: string
        }[]
      }
      calculate_team_total_money_won: {
        Args: { team_uuid: string }
        Returns: number
      }
      complete_upcoming_match: {
        Args: {
          p_score_a: number
          p_score_b: number
          p_upcoming_match_id: string
          p_winner_id?: string
        }
        Returns: string
      }
      compute_hmac_hex: {
        Args: { body: string; secret: string }
        Returns: string
      }
      custom_jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_elo_bounds: {
        Args: Record<PropertyKey, never>
        Returns: {
          max_bound: number
          min_bound: number
          normalized_starting: number
          starting_elo: number
        }[]
      }
      get_my_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          permission: string
        }[]
      }
      get_team_performance: {
        Args: { team_id_param: string }
        Returns: {
          metric_name: string
          metric_value: string
        }[]
      }
      get_user_roles: {
        Args: { user_id_param?: string }
        Returns: {
          role: string
        }[]
      }
      has_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      has_role: {
        Args: { required_role: string }
        Returns: boolean
      }
      initialize_new_season: {
        Args: { season_name: string }
        Returns: undefined
      }
      initialize_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_league_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_queue_retry: {
        Args: {
          p_error_message: string
          p_max_attempts: number
          p_queue_id: number
        }
        Returns: Json
      }
      promote_to_league_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      recalculate_all_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recent_games_for_player: {
        Args: { player_id_param: string }
        Returns: {
          assists: number
          blocks: number
          fg_pct: number
          fga: number
          fgm: number
          ft_pct: number
          fta: number
          ftm: number
          location: string
          match_id: string
          opponent_logo: string
          opponent_name: string
          opponent_team_id: string
          pf: number
          played_at: string
          points: number
          rebounds: number
          result: string
          score_a: number
          score_b: number
          steals: number
          three_points_attempted: number
          three_points_made: number
          three_pt_pct: number
          turnovers: number
        }[]
      }
      record_match_forfeit: {
        Args: { p_forfeiting_team_id: string; p_match_id: string }
        Returns: undefined
      }
      refresh_all_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      remove_role: {
        Args: { role_to_remove: string; target_user_id: string }
        Returns: boolean
      }
      remove_role_from_user: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      resolve_gamertag: {
        Args:
          | {
              p_game_year: Database["public"]["Enums"]["game_year"]
              p_match_date: string
              p_player: string
              p_season: string
              p_tournament: string
            }
          | {
              p_game_year: Database["public"]["Enums"]["game_year"]
              p_played_at: string
              p_player: string
              p_season: string
              p_tournament: string
            }
        Returns: string
      }
      sync_user_roles_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_all_teams_money_won: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_elo_after_match: {
        Args: {
          k_factor?: number
          loser_id_param: string
          winner_id_param: string
        }
        Returns: undefined
      }
      update_existing_draft_pool_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_group_standings: {
        Args: { p_group_id: string }
        Returns: undefined
      }
      update_player_global_ratings: {
        Args: Record<PropertyKey, never>
        Returns: {
          gamertag: string
          new_rating: number
          old_rating: number
          player_id: string
          rating_change: number
        }[]
      }
      update_player_ps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_player_rank_score: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_player_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_team_money_won: {
        Args: { team_uuid: string }
        Returns: undefined
      }
      update_team_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_claims: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      upsert_player_counter: {
        Args: {
          p_ast_total?: number
          p_blk_total?: number
          p_fga_total?: number
          p_fgm_total?: number
          p_fta_total?: number
          p_ftm_total?: number
          p_games_played?: number
          p_has_50pt_game?: boolean
          p_has_triple_double?: boolean
          p_player_id: string
          p_pts_total?: number
          p_reb_total?: number
          p_scope: Database["public"]["Enums"]["counter_scope"]
          p_season_id?: string
          p_stl_total?: number
          p_tov_total?: number
          p_tpa_total?: number
          p_tpm_total?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      achievement_category:
        | "Scoring"
        | "Assists"
        | "Defense"
        | "Rebounding"
        | "Mixed Stats"
        | "Streak & Longevity"
        | "Legendary"
      achievement_event_type: "match_event" | "player_stat_event"
      achievement_rarity: "Common" | "Rare" | "Epic" | "Legendary"
      achievement_scope: "per_game" | "season" | "career" | "streak" | "event"
      achievement_tier:
        | "bronze"
        | "silver"
        | "gold"
        | "platinum"
        | "common"
        | "rare"
        | "legendary"
        | "epic"
      achievement_type:
        | "Career Points Milestone"
        | "Single Game"
        | "Efficiency"
        | "Season"
        | "Career Milestones"
        | "Blocks"
        | "Steals"
        | "Lockdown"
        | "Streak"
        | "Longevity"
        | "Mixed Stats"
      app_role:
        | "admin"
        | "league_staff"
        | "user"
        | "editor"
        | "analyst"
        | "team_staff"
        | "player"
      award_types: "Offensive MVP" | "Defensive MVP" | "Rookie of Tournament"
      console: "Cross Play" | "Playstation" | "Xbox"
      counter_scope: "career" | "season" | "rolling10" | "game"
      event_tier: "T1" | "T2" | "T3" | "T4" | "T5"
      event_type: "League" | "Tournament" | "match_event" | "player_stat_event"
      game_year:
        | "2K16"
        | "2K17"
        | "2K18"
        | "2K19"
        | "2K20"
        | "2K21"
        | "2K22"
        | "2K23"
        | "2K24"
        | "2K25"
        | "2K26"
      leaderboard_tier: "S" | "A" | "B" | "C" | "D"
      leagues:
        | "Unified Pro Am Association"
        | "UPA College"
        | "WR"
        | "MPBA"
        | "Rising Stars"
        | "Staten Island Basketball Association"
        | "Hall Of Fame League"
        | "Dunk League"
        | "Road to 25K"
        | "Association"
        | "USA Basketball"
        | "HOF EU"
        | "UPA EU"
      player_position:
        | "Point Guard"
        | "Shooting Guard"
        | "Lock"
        | "Power Forward"
        | "Center"
      queue_status: "queued" | "processing" | "done" | "error"
      salary_tier: "S" | "A" | "B" | "C" | "D"
      stage:
        | "Regular Season"
        | "Group Play"
        | "Round 1"
        | "Round 2"
        | "Round 3"
        | "Round 4"
        | "Semi Finals"
        | "Finals"
        | "Grand Finals"
        | "L1"
        | "L2"
        | "L3"
        | "L4"
        | "L5"
        | "W1"
        | "W2"
        | "W3"
        | "W4"
        | "LF"
        | "WF"
        | "Playoffs"
        | "Open"
      status:
        | "scheduled"
        | "in progress"
        | "completed"
        | "under review"
        | "reviewed"
        | "approved"
      tournament_format:
        | "single-elimination"
        | "double-elimination"
        | "swiss"
        | "round-robin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "Scoring",
        "Assists",
        "Defense",
        "Rebounding",
        "Mixed Stats",
        "Streak & Longevity",
        "Legendary",
      ],
      achievement_event_type: ["match_event", "player_stat_event"],
      achievement_rarity: ["Common", "Rare", "Epic", "Legendary"],
      achievement_scope: ["per_game", "season", "career", "streak", "event"],
      achievement_tier: [
        "bronze",
        "silver",
        "gold",
        "platinum",
        "common",
        "rare",
        "legendary",
        "epic",
      ],
      achievement_type: [
        "Career Points Milestone",
        "Single Game",
        "Efficiency",
        "Season",
        "Career Milestones",
        "Blocks",
        "Steals",
        "Lockdown",
        "Streak",
        "Longevity",
        "Mixed Stats",
      ],
      app_role: [
        "admin",
        "league_staff",
        "user",
        "editor",
        "analyst",
        "team_staff",
        "player",
      ],
      award_types: ["Offensive MVP", "Defensive MVP", "Rookie of Tournament"],
      console: ["Cross Play", "Playstation", "Xbox"],
      counter_scope: ["career", "season", "rolling10", "game"],
      event_tier: ["T1", "T2", "T3", "T4", "T5"],
      event_type: ["League", "Tournament", "match_event", "player_stat_event"],
      game_year: [
        "2K16",
        "2K17",
        "2K18",
        "2K19",
        "2K20",
        "2K21",
        "2K22",
        "2K23",
        "2K24",
        "2K25",
        "2K26",
      ],
      leaderboard_tier: ["S", "A", "B", "C", "D"],
      leagues: [
        "Unified Pro Am Association",
        "UPA College",
        "WR",
        "MPBA",
        "Rising Stars",
        "Staten Island Basketball Association",
        "Hall Of Fame League",
        "Dunk League",
        "Road to 25K",
        "Association",
        "USA Basketball",
        "HOF EU",
        "UPA EU",
      ],
      player_position: [
        "Point Guard",
        "Shooting Guard",
        "Lock",
        "Power Forward",
        "Center",
      ],
      queue_status: ["queued", "processing", "done", "error"],
      salary_tier: ["S", "A", "B", "C", "D"],
      stage: [
        "Regular Season",
        "Group Play",
        "Round 1",
        "Round 2",
        "Round 3",
        "Round 4",
        "Semi Finals",
        "Finals",
        "Grand Finals",
        "L1",
        "L2",
        "L3",
        "L4",
        "L5",
        "W1",
        "W2",
        "W3",
        "W4",
        "LF",
        "WF",
        "Playoffs",
        "Open",
      ],
      status: [
        "scheduled",
        "in progress",
        "completed",
        "under review",
        "reviewed",
        "approved",
      ],
      tournament_format: [
        "single-elimination",
        "double-elimination",
        "swiss",
        "round-robin",
      ],
    },
  },
} as const
