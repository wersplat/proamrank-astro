import { useState } from "react";

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

export default function MobileRankCard({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((row, idx) => (
        <MobileRankCardItem key={row.team_id} row={row} rank={idx + 1} />
      ))}
    </>
  );
}

function MobileRankCardItem({ row, rank }: { row: Row; rank: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <a 
      href={`/teams/${row.team_id}`}
      className="block rounded-lg border border-patriot-blue-800 bg-patriot-blue-900/30 p-4 hover:border-patriot-red-500 hover:bg-patriot-blue-900/50 transition-all duration-200 animate-slide-up"
      onClick={(e) => {
        if (isExpanded) {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
    >
      <article>
        <header className="flex items-center gap-3 mb-3">
          <div className="text-neutral-400 font-bold text-sm w-8">#{rank}</div>
          {row.logo_url ? (
            <img 
              src={row.logo_url}
              alt="" 
              className="h-10 w-10 rounded object-cover ring-2 ring-patriot-blue-800" 
              loading="lazy" 
            />
          ) : (
            <div className="h-10 w-10 rounded bg-patriot-blue-800 flex items-center justify-center text-neutral-300 text-xs font-bold ring-2 ring-patriot-blue-800">
              {row.team_name?.substring(0, 2).toUpperCase() || '??'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">{row.team_name}</div>
          </div>
          {row.leaderboard_tier && (
            <span className={`px-2 py-1 rounded text-xs font-bold ${getTierColor(row.leaderboard_tier)} shadow-sm`}>
              {row.leaderboard_tier}
            </span>
          )}
        </header>
        
        <dl className="grid grid-cols-3 gap-3 mb-2">
          <div className="text-center p-2 bg-patriot-blue-900/50 rounded">
            <dt className="text-neutral-400 text-xs mb-1">Score</dt>
            <dd className="font-bold text-lg text-patriot-red-400">{Math.round(row.hybrid_score ?? 0)}</dd>
          </div>
          <div className="text-center p-2 bg-patriot-blue-900/50 rounded">
            <dt className="text-neutral-400 text-xs mb-1">Elo</dt>
            <dd className="font-bold text-lg text-patriot-blue-400">{Math.round(row.elo_rating ?? 1500)}</dd>
          </div>
          <div className="text-center p-2 bg-patriot-blue-900/50 rounded">
            <dt className="text-neutral-400 text-xs mb-1">RP</dt>
            <dd className="font-bold text-lg">{row.current_rp ?? 0}</dd>
          </div>
        </dl>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full mt-2 text-xs text-neutral-400 hover:text-neutral-300 flex items-center justify-center gap-1"
        >
          <span>{isExpanded ? 'Less' : 'More'} Details</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-patriot-blue-800 animate-fade-in">
            <div className="text-xs text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Global Rank:</span>
                <span className="text-neutral-300 font-medium">#{row.global_rank ?? '-'}</span>
              </div>
              <div className="text-neutral-500 text-[10px] mt-2">
                Tap anywhere on card to view full team profile
              </div>
            </div>
          </div>
        )}
      </article>
    </a>
  );
}

