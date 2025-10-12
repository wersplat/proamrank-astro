import { useState } from "react";

type BracketMatch = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  stage: string | null;
  series_number: number | null;
  winner_id: string | null;
  team_a?: { name: string | null; logo_url: string | null };
  team_b?: { name: string | null; logo_url: string | null };
};

type BracketFormat = "single-elimination" | "double-elimination" | "swiss" | "round-robin" | "unknown";

type BracketDisplayProps = {
  matches: BracketMatch[];
  tournamentName: string;
  champion?: string | null;
  prizePool?: number | null;
  status?: string | null;
  startDate?: string | null;
  finalsDate?: string | null;
};

// Stage ordering for single elimination
const SINGLE_ELIM_STAGES = ["Round 1", "Round 2", "Round 3", "Round 4", "Semi Finals", "Finals", "Grand Finals"];
const WINNERS_STAGES = ["W1", "W2", "W3", "W4", "WF", "Grand Finals"];
const LOSERS_STAGES = ["L1", "L2", "L3", "L4", "L5", "LF"];
const SWISS_STAGES = ["Round 1", "Round 2", "Round 3", "Round 4"];

export default function BracketDisplay({
  matches,
  tournamentName,
  champion,
  prizePool,
  status,
  startDate,
  finalsDate,
}: BracketDisplayProps) {
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);

  // Detect bracket format
  const detectFormat = (): BracketFormat => {
    const stages = matches.map((m) => m.stage).filter(Boolean);
    
    if (stages.some(s => LOSERS_STAGES.includes(s!))) return "double-elimination";
    if (stages.some(s => s === "Group Play")) return "round-robin";
    if (stages.some(s => SWISS_STAGES.includes(s!) && matches.length > 8)) return "swiss";
    if (stages.some(s => SINGLE_ELIM_STAGES.includes(s!))) return "single-elimination";
    
    return "unknown";
  };

  const format = detectFormat();

  const getFormatBadge = (format: BracketFormat) => {
    const badges = {
      "single-elimination": { label: "Single Elimination", color: "bg-blue-900 text-blue-300" },
      "double-elimination": { label: "Double Elimination", color: "bg-purple-900 text-purple-300" },
      "swiss": { label: "Swiss System", color: "bg-green-900 text-green-300" },
      "round-robin": { label: "Round Robin", color: "bg-yellow-900 text-yellow-300" },
      "unknown": { label: "Tournament", color: "bg-neutral-800 text-neutral-300" },
    };
    const badge = badges[format];
    return (
      <span className={`px-3 py-1 rounded text-xs font-bold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getWinnerClass = (match: BracketMatch, teamId: string) => {
    if (!match.winner_id) return "";
    return match.winner_id === teamId ? "font-bold text-green-400" : "text-neutral-500 line-through";
  };

  const groupMatchesByStage = (matches: BracketMatch[], stages: string[]) => {
    const grouped: { [key: string]: BracketMatch[] } = {};
    stages.forEach((stage) => {
      grouped[stage] = matches
        .filter((m) => m.stage === stage)
        .sort((a, b) => (a.series_number || 0) - (b.series_number || 0));
    });
    return grouped;
  };

  // Render Single Elimination Bracket
  const renderSingleElimination = () => {
    const relevantStages = SINGLE_ELIM_STAGES.filter(stage => 
      matches.some(m => m.stage === stage)
    );
    const groupedMatches = groupMatchesByStage(matches, relevantStages);

    return (
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max p-4">
          {relevantStages.map((stage) => (
            <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
              <h3 className="text-sm font-bold text-neutral-400 text-center sticky top-0 bg-neutral-900 py-2">
                {stage}
              </h3>
              <div className="flex flex-col gap-4">
                {groupedMatches[stage]?.map((match) => (
                  <div
                    key={match.id}
                    className="border border-neutral-700 rounded-lg p-3 bg-neutral-800/50 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {match.team_a?.logo_url ? (
                            <img src={match.team_a.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                              {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                            </div>
                          )}
                          <span className="truncate">{match.team_a?.name || "TBD"}</span>
                        </div>
                        <span className="font-bold">{match.score_a ?? "-"}</span>
                      </div>
                    </div>
                    <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {match.team_b?.logo_url ? (
                            <img src={match.team_b.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                              {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                            </div>
                          )}
                          <span className="truncate">{match.team_b?.name || "TBD"}</span>
                        </div>
                        <span className="font-bold">{match.score_b ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Double Elimination Bracket
  const renderDoubleElimination = () => {
    const winnersStages = WINNERS_STAGES.filter(stage => matches.some(m => m.stage === stage));
    const losersStages = LOSERS_STAGES.filter(stage => matches.some(m => m.stage === stage));
    
    const winnersMatches = groupMatchesByStage(matches, winnersStages);
    const losersMatches = groupMatchesByStage(matches, losersStages);

    return (
      <div className="space-y-8">
        {/* Winners Bracket */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-400">Winners Bracket</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-max p-4">
              {winnersStages.map((stage) => (
                <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
                  <h4 className="text-sm font-bold text-neutral-400 text-center sticky top-0 bg-neutral-900 py-2">
                    {stage}
                  </h4>
                  <div className="flex flex-col gap-4">
                    {winnersMatches[stage]?.map((match) => (
                      <div
                        key={match.id}
                        className="border border-neutral-700 rounded-lg p-3 bg-neutral-800/50 hover:border-blue-500 transition cursor-pointer"
                        onClick={() => setSelectedMatch(match)}
                      >
                        <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {match.team_a?.logo_url ? (
                                <img src={match.team_a.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                  {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                                </div>
                              )}
                              <span className="truncate">{match.team_a?.name || "TBD"}</span>
                            </div>
                            <span className="font-bold">{match.score_a ?? "-"}</span>
                          </div>
                        </div>
                        <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {match.team_b?.logo_url ? (
                                <img src={match.team_b.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                  {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                                </div>
                              )}
                              <span className="truncate">{match.team_b?.name || "TBD"}</span>
                            </div>
                            <span className="font-bold">{match.score_b ?? "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Losers Bracket */}
        {losersStages.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-red-400">Losers Bracket</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-max p-4">
                {losersStages.map((stage) => (
                  <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
                    <h4 className="text-sm font-bold text-neutral-400 text-center sticky top-0 bg-neutral-900 py-2">
                      {stage}
                    </h4>
                    <div className="flex flex-col gap-4">
                      {losersMatches[stage]?.map((match) => (
                        <div
                          key={match.id}
                          className="border border-neutral-700 rounded-lg p-3 bg-neutral-800/50 hover:border-red-500 transition cursor-pointer"
                          onClick={() => setSelectedMatch(match)}
                        >
                          <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {match.team_a?.logo_url ? (
                                  <img src={match.team_a.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                    {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                                  </div>
                                )}
                                <span className="truncate">{match.team_a?.name || "TBD"}</span>
                              </div>
                              <span className="font-bold">{match.score_a ?? "-"}</span>
                            </div>
                          </div>
                          <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {match.team_b?.logo_url ? (
                                  <img src={match.team_b.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                    {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                                  </div>
                                )}
                                <span className="truncate">{match.team_b?.name || "TBD"}</span>
                              </div>
                              <span className="font-bold">{match.score_b ?? "-"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Swiss System
  const renderSwiss = () => {
    const rounds = SWISS_STAGES.filter(stage => matches.some(m => m.stage === stage));
    const groupedMatches = groupMatchesByStage(matches, rounds);

    return (
      <div className="space-y-6">
        {rounds.map((round) => (
          <div key={round}>
            <h3 className="text-lg font-bold mb-3 text-neutral-300">{round}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedMatches[round]?.map((match) => (
                <div
                  key={match.id}
                  className="border border-neutral-700 rounded-lg p-3 bg-neutral-800/50 hover:border-green-500 transition cursor-pointer"
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.team_a?.logo_url ? (
                          <img src={match.team_a.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                            {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                          </div>
                        )}
                        <span className="truncate">{match.team_a?.name || "TBD"}</span>
                      </div>
                      <span className="font-bold">{match.score_a ?? "-"}</span>
                    </div>
                  </div>
                  <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.team_b?.logo_url ? (
                          <img src={match.team_b.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                            {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                          </div>
                        )}
                        <span className="truncate">{match.team_b?.name || "TBD"}</span>
                      </div>
                      <span className="font-bold">{match.score_b ?? "-"}</span>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {new Date(match.played_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render Round Robin / Unknown format
  const renderRoundRobin = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="border border-neutral-700 rounded-lg p-3 bg-neutral-800/50 hover:border-yellow-500 transition cursor-pointer"
            onClick={() => setSelectedMatch(match)}
          >
            <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {match.team_a?.logo_url ? (
                    <img src={match.team_a.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                      {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                    </div>
                  )}
                  <span className="truncate">{match.team_a?.name || "TBD"}</span>
                </div>
                <span className="font-bold">{match.score_a ?? "-"}</span>
              </div>
            </div>
            <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {match.team_b?.logo_url ? (
                    <img src={match.team_b.logo_url} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-[8px] font-bold flex-shrink-0">
                      {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                    </div>
                  )}
                  <span className="truncate">{match.team_b?.name || "TBD"}</span>
                </div>
                <span className="font-bold">{match.score_b ?? "-"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
              {match.stage && <span>{match.stage}</span>}
              <span>{new Date(match.played_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <p>No bracket matches available.</p>
        <p className="text-sm mt-2">Matches will appear here once the tournament begins.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tournament Info Header */}
      <div className="mb-6 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-xl font-bold">{tournamentName}</h2>
          {getFormatBadge(format)}
          {status && (
            <span className={`px-3 py-1 rounded text-xs font-bold capitalize ${
              status === 'completed' ? 'bg-green-900 text-green-300' :
              status === 'in progress' ? 'bg-blue-900 text-blue-300' :
              'bg-neutral-800 text-neutral-300'
            }`}>
              {status}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
          {startDate && (
            <div>
              <span className="text-neutral-500">Start:</span>{" "}
              <span className="text-neutral-300">{new Date(startDate).toLocaleDateString()}</span>
            </div>
          )}
          {finalsDate && (
            <div>
              <span className="text-neutral-500">Finals:</span>{" "}
              <span className="text-neutral-300">{new Date(finalsDate).toLocaleDateString()}</span>
            </div>
          )}
          {prizePool && (
            <div>
              <span className="text-neutral-500">Prize Pool:</span>{" "}
              <span className="text-green-400 font-semibold">${prizePool.toLocaleString()}</span>
            </div>
          )}
          {champion && (
            <div>
              <span className="text-neutral-500">Champion:</span>{" "}
              <span className="text-yellow-400 font-bold">🏆 {champion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="bg-neutral-900/30 rounded-lg p-4 border border-neutral-800">
        {format === "single-elimination" && renderSingleElimination()}
        {format === "double-elimination" && renderDoubleElimination()}
        {format === "swiss" && renderSwiss()}
        {(format === "round-robin" || format === "unknown") && renderRoundRobin()}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            className="bg-neutral-900 rounded-lg max-w-md w-full border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-800">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold">Match Details</h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className={`p-3 rounded border ${
                  selectedMatch.winner_id === selectedMatch.team_a_id
                    ? "border-green-500 bg-green-900/20"
                    : "border-neutral-700 bg-neutral-800/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.team_a?.logo_url ? (
                        <img src={selectedMatch.team_a.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs font-bold">
                          {selectedMatch.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                        </div>
                      )}
                      <span className="font-semibold">{selectedMatch.team_a?.name || "Team A"}</span>
                    </div>
                    <span className="text-2xl font-bold">{selectedMatch.score_a ?? "-"}</span>
                  </div>
                </div>
                <div className={`p-3 rounded border ${
                  selectedMatch.winner_id === selectedMatch.team_b_id
                    ? "border-green-500 bg-green-900/20"
                    : "border-neutral-700 bg-neutral-800/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.team_b?.logo_url ? (
                        <img src={selectedMatch.team_b.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs font-bold">
                          {selectedMatch.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                        </div>
                      )}
                      <span className="font-semibold">{selectedMatch.team_b?.name || "Team B"}</span>
                    </div>
                    <span className="text-2xl font-bold">{selectedMatch.score_b ?? "-"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-sm">
                {selectedMatch.stage && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Stage:</span>
                    <span className="text-neutral-200">{selectedMatch.stage}</span>
                  </div>
                )}
                {selectedMatch.series_number && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Series:</span>
                    <span className="text-neutral-200">#{selectedMatch.series_number}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Date:</span>
                  <span className="text-neutral-200">
                    {new Date(selectedMatch.played_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

