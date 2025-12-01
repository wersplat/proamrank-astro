import { supa } from "./supabase";
import type { Database } from "./db.types";

/**
 * Clerk User from FDW
 */
export type ClerkUser = {
  id: string;
  external_id: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  attrs: Record<string, any> | null;
};

/**
 * Player type from database
 */
type Player = Database["public"]["Tables"]["players"]["Row"];

/**
 * Service for querying Clerk FDW tables via Supabase and matching players by Discord ID
 */
export const clerkApi = {
  /**
   * Get a Clerk user by ID
   */
  getUserById: async (
    userId: string,
    locals?: { env?: any; runtime?: any }
  ): Promise<ClerkUser | null> => {
    try {
      const supabase = supa(locals);
      const { data, error } = await supabase
        .from("clerk.users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching Clerk user:", error);
        return null;
      }

      return data as ClerkUser;
    } catch (err) {
      console.error("Exception fetching Clerk user:", err);
      return null;
    }
  },

  /**
   * Extract Discord ID from Clerk user's external accounts
   * Discord ID is stored in attrs.external_accounts array
   */
  getUserDiscordId: async (
    userId: string,
    locals?: { env?: any; runtime?: any }
  ): Promise<string | null> => {
    try {
      const user = await clerkApi.getUserById(userId, locals);
      if (!user || !user.attrs) {
        return null;
      }

      // Clerk stores external accounts in attrs.external_accounts array
      // Each account has a provider and provider_user_id
      const externalAccounts = user.attrs.external_accounts;
      if (!Array.isArray(externalAccounts)) {
        return null;
      }

      // Find Discord account
      const discordAccount = externalAccounts.find(
        (account: any) => account.provider === "oauth_discord"
      );

      if (!discordAccount || !discordAccount.provider_user_id) {
        return null;
      }

      return discordAccount.provider_user_id as string;
    } catch (err) {
      console.error("Exception extracting Discord ID from Clerk user:", err);
      return null;
    }
  },

  /**
   * Match Clerk user to player by Discord ID
   * Gets Discord ID from Clerk user and matches it to players.discord_id
   */
  getPlayerByClerkUserId: async (
    clerkUserId: string,
    locals?: { env?: any; runtime?: any }
  ): Promise<Player | null> => {
    try {
      const discordId = await clerkApi.getUserDiscordId(clerkUserId, locals);
      if (!discordId) {
        return null;
      }

      return await clerkApi.getPlayerByDiscordId(discordId, locals);
    } catch (err) {
      console.error("Exception matching player to Clerk user:", err);
      return null;
    }
  },

  /**
   * Get player by Discord ID
   * Direct lookup using players.discord_id field
   */
  getPlayerByDiscordId: async (
    discordId: string,
    locals?: { env?: any; runtime?: any }
  ): Promise<Player | null> => {
    try {
      const supabase = supa(locals);
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("discord_id", discordId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching player by Discord ID:", error);
        return null;
      }

      return data as Player | null;
    } catch (err) {
      console.error("Exception fetching player by Discord ID:", err);
      return null;
    }
  },
};

