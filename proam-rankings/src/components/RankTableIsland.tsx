import { useMemo, useState } from "react";

type Row = {
  team_id: string;
  team_name: string;
  rating: number;
  wins: number;
  losses: number;
};

export default function RankTableIsland({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<keyof Row>("rating");
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as any, bv = b[sortKey] as any;
      return typeof av === "number" ? bv - av : String(av).localeCompare(String(bv));
    });
  }, [rows, sortKey]);

  return (
    <table className="w-full text-sm hidden sm:table" id="rankings-table">
      <thead className="text-neutral-300 sticky top-0 bg-neutral-950">
        <tr>
          <th className="text-left py-2">Team</th>
          <th className="text-right py-2 cursor-pointer" onClick={() => setSortKey("rating")}>Rating</th>
          <th className="text-right py-2 cursor-pointer" onClick={() => setSortKey("wins")}>W</th>
          <th className="text-right py-2 cursor-pointer" onClick={() => setSortKey("losses")}>L</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(r => (
          <tr key={r.team_id} className="border-b border-neutral-800">
            <td className="py-2 flex items-center gap-2">
              <img src={`${import.meta.env.PUBLIC_ASSETS_BASE || ""}/logos/${r.team_id}.webp` } alt="" className="h-6 w-6 rounded" loading="lazy" />
              {r.team_name}
            </td>
            <td className="text-right">{r.rating}</td>
            <td className="text-right">{r.wins}</td>
            <td className="text-right">{r.losses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
