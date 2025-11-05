import { useMemo, useState } from "react";
import Tooltip from "./Tooltip";

type Row = {
  team_id: string | null;
  team_name: string | null;
  logo_url: string | null;
  elo_rating: number | null;
  current_rp: number | null;
  global_rank: number | null;
  leaderboard_tier: string | null;
  hybrid_score: number | null;
};

function getTierColor(tier: string | null): string {
  if (!tier) return "bg-neutral-700 text-neutral-300";
  const tierLower = tier.toLowerCase();
  if (tierLower.includes("prospect")) {
    return "bg-patriot-blue-500 text-white";
  } else if (tierLower.includes("elite")) {
    return "bg-gradient-to-r from-brand-gold to-yellow-500 text-neutral-900 font-bold";
  } else if (tierLower.includes("premier")) {
    return "bg-gradient-to-r from-patriot-red-500 to-patriot-red-600 text-white";
  }
  return "bg-patriot-blue-800 text-white";
}

export default function RankTableIsland({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<keyof Row>("hybrid_score");
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as any, bv = b[sortKey] as any;
      return typeof av === "number" ? (bv ?? 0) - (av ?? 0) : String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }, [rows, sortKey]);

  return (
    <table className="w-full text-sm hidden sm:table" id="rankings-table" aria-label="Team rankings table">
      <thead className="text-neutral-200 sticky top-0 bg-patriot-blue-900/95 backdrop-blur-md z-10">
        <tr>
          <th scope="col" className="text-left py-3 px-2">Rank</th>
          <th scope="col" className="text-left py-3 px-2">Team</th>
          <th scope="col" className="text-right py-3 px-2">
            <div className="flex items-center justify-end gap-1">
              <button 
                type="button"
                className="cursor-pointer hover:text-patriot-red-400 transition focus:outline-none focus:ring-2 focus:ring-patriot-red-400 focus:ring-offset-2 rounded px-1"
                onClick={() => setSortKey("hybrid_score")}
                aria-label="Sort by Score"
              >
                Score
              </button>
              <Tooltip content="Hybrid Score combines ELO rating and win percentage to provide a comprehensive team ranking">
                <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Tooltip>
            </div>
          </th>
          <th scope="col" className="text-right py-3 px-2">
            <div className="flex items-center justify-end gap-1">
              <button 
                type="button"
                className="cursor-pointer hover:text-patriot-blue-400 transition focus:outline-none focus:ring-2 focus:ring-patriot-blue-400 focus:ring-offset-2 rounded px-1"
                onClick={() => setSortKey("elo_rating")}
                aria-label="Sort by Elo rating"
              >
                Elo
              </button>
              <Tooltip content="ELO rating measures team skill level based on match results against other teams">
                <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Tooltip>
            </div>
          </th>
          <th scope="col" className="text-right py-3 px-2">
            <div className="flex items-center justify-end gap-1">
              <button 
                type="button"
                className="cursor-pointer hover:text-patriot-red-400 transition focus:outline-none focus:ring-2 focus:ring-patriot-red-400 focus:ring-offset-2 rounded px-1"
                onClick={() => setSortKey("current_rp")}
                aria-label="Sort by Ranking Points"
              >
                RP
              </button>
              <Tooltip content="Ranking Points (RP) represent tournament and league achievements">
                <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Tooltip>
            </div>
          </th>
          <th scope="col" className="text-center py-3 px-2">Tier</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, idx) => (
          <tr 
            key={r.team_id} 
            className={`border-b border-patriot-blue-800/50 transition-all duration-200 hover:bg-patriot-blue-900/70 hover:shadow-md hover:neon-edge ${
              idx % 2 === 0 ? 'bg-patriot-blue-900/40' : 'bg-patriot-blue-900/20'
            } animate-slide-up`}
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            <td className="py-3 px-2">
              <div className="text-neutral-300 font-semibold">#{idx + 1}</div>
            </td>
            <td className="py-3 px-2">
              <a 
                href={`/teams/${r.team_id}`}
                className="flex items-center gap-3 hover:text-patriot-red-400 transition group focus:outline-none focus:ring-2 focus:ring-patriot-red-400 focus:ring-offset-2 rounded"
                aria-label={`View ${r.team_name || 'team'} profile`}
              >
                {r.logo_url ? (
                  <img 
                    src={r.logo_url} 
                    alt={`${r.team_name || 'Team'} logo`}
                    className="h-8 w-8 rounded object-cover ring-2 ring-patriot-blue-800 group-hover:ring-patriot-red-500 transition" 
                    loading="lazy" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-patriot-blue-800 flex items-center justify-center text-neutral-300 text-xs font-bold ring-2 ring-patriot-blue-800 group-hover:ring-patriot-red-500 transition" aria-label={`${r.team_name || 'Team'} logo placeholder`}>
                    {r.team_name?.substring(0, 2).toUpperCase() || '??'}
                  </div>
                )}
                <span className="font-medium">{r.team_name || 'Unknown Team'}</span>
              </a>
            </td>
            <td className="py-3 px-2">
              <div className="text-right">
                <div className="font-semibold text-lg">{Math.round(r.hybrid_score ?? 0)}</div>
              </div>
            </td>
            <td className="py-3 px-2">
              <div className="text-right">
                <div className="font-medium">{Math.round(r.elo_rating ?? 1500)}</div>
              </div>
            </td>
            <td className="py-3 px-2">
              <div className="text-right">
                <div className="font-medium">{r.current_rp ?? 0}</div>
              </div>
            </td>
            <td className="text-center py-3 px-2">
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${getTierColor(r.leaderboard_tier)} animate-tier-transition shadow-sm`}>
                {r.leaderboard_tier || '-'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
