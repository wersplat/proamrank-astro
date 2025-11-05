import { useMemo, useState } from "react";

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

export default function RankTableIsland({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<keyof Row>("hybrid_score");
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as any, bv = b[sortKey] as any;
      return typeof av === "number" ? (bv ?? 0) - (av ?? 0) : String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }, [rows, sortKey]);

  return (
    <table className="w-full text-sm hidden sm:table" id="rankings-table">
      <thead className="text-neutral-200 sticky top-0 bg-patriot-blue-900">
        <tr>
          <th className="text-left py-2">Rank</th>
          <th className="text-left py-2">Team</th>
          <th className="text-right py-2 cursor-pointer hover:text-patriot-red-400 transition" onClick={() => setSortKey("hybrid_score")}>Score</th>
          <th className="text-right py-2 cursor-pointer hover:text-patriot-blue-400 transition" onClick={() => setSortKey("elo_rating")}>Elo</th>
          <th className="text-right py-2 cursor-pointer hover:text-patriot-red-400 transition" onClick={() => setSortKey("current_rp")}>RP</th>
          <th className="text-center py-2">Tier</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, idx) => (
          <tr key={r.team_id} className="border-b border-patriot-blue-800 hover:bg-patriot-blue-900/50 transition">
            <td className="py-2 text-neutral-300">#{idx + 1}</td>
            <td className="py-2">
              <a 
                href={`/teams/${r.team_id}`}
                className="flex items-center gap-2 hover:text-patriot-red-400 transition"
              >
                {r.logo_url ? (
                  <img 
                    src={r.logo_url} 
                    alt="" 
                    className="h-6 w-6 rounded object-cover" 
                    loading="lazy" 
                  />
                ) : (
                  <div className="h-6 w-6 rounded bg-patriot-blue-800 flex items-center justify-center text-neutral-300 text-[10px] font-bold">
                    {r.team_name?.substring(0, 2).toUpperCase() || '??'}
                  </div>
                )}
                {r.team_name}
              </a>
            </td>
            <td className="text-right font-medium">{Math.round(r.hybrid_score ?? 0)}</td>
            <td className="text-right">{Math.round(r.elo_rating ?? 1500)}</td>
            <td className="text-right">{r.current_rp ?? 0}</td>
            <td className="text-center">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-patriot-blue-800 text-white">
                {r.leaderboard_tier || '-'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
