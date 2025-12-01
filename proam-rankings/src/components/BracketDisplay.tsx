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
  series_format?: string | null;
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
  tournamentType?: string | null;
  seriesFormat?: string | null;
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
  tournamentType,
  seriesFormat,
}: BracketDisplayProps) {
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);

  // Detect bracket format
  const detectFormat = (): BracketFormat => {
    const stages = matches.map((m) => m.stage).filter(Boolean);
    
    if (stages.some(s => LOSERS_STAGES.includes(s!))) return "double-elimination";
    if (stages.some(s => s === "Group Play")) return "round-robin";
    if (stages.some(s => SWISS_STAGES.includes(s!) && matches.length > 8)) return "swiss";
    if (stages.some(s => SINGLE_ELIM_STAGES.includes(s!))) return "single-elimination";
    
    return "unknown";
  };

  // Use provided tournament type or fall back to auto-detection
  const format = (tournamentType as BracketFormat) || detectFormat();

  // Format series display
  const getSeriesDisplay = (seriesNumber: number | null, seriesFormat: string | null) => {
    if (!seriesNumber || !seriesFormat) return '';
    
    const formatMap = {
      'bo1': 'BO1',
      'bo3': 'BO3', 
      'bo5': 'BO5',
      'bo7': 'BO7'
    };
    
    const formatText = formatMap[seriesFormat as keyof typeof formatMap] || seriesFormat.toUpperCase();
    return `Game ${seriesNumber} (${formatText})`;
  };

  // Get series format for a match (prefer match-level, fallback to tournament-level)
  const getMatchSeriesFormat = (match: BracketMatch) => {
    return match.series_format || seriesFormat || 'bo1';
  };

  const getFormatBadge = (format: BracketFormat) => {
    const badges = {
      "single-elimination": { label: "Single Elimination", color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" },
      "double-elimination": { label: "Double Elimination", color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" },
      "swiss": { label: "Swiss System", color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" },
      "round-robin": { label: "Round Robin", color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" },
      "unknown": { label: "Tournament", color: "bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300" },
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
    return match.winner_id === teamId ? "font-bold text-green-600 dark:text-green-400" : "text-gray-500 dark:text-neutral-500 line-through";
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

  // Group matches by series within each stage
  const groupMatchesBySeries = (matches: BracketMatch[]) => {
    const seriesMap = new Map<string, BracketMatch[]>();
    
    matches.forEach((match) => {
      const seriesKey = `${match.stage}-${match.series_number || 0}`;
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, []);
      }
      seriesMap.get(seriesKey)!.push(match);
    });

    // Convert to array of series objects
    return Array.from(seriesMap.entries()).map(([seriesKey, seriesMatches]) => {
      const firstMatch = seriesMatches[0];
      const seriesFormat = getMatchSeriesFormat(firstMatch);
      
      // Get all unique team IDs in this series
      const teamIds = Array.from(new Set([
        ...seriesMatches.map(m => m.team_a_id),
        ...seriesMatches.map(m => m.team_b_id)
      ]));
      
      // Use first match's teams as reference (teamA and teamB)
      const teamA = firstMatch.team_a;
      const teamB = firstMatch.team_b;
      
      return {
        seriesKey,
        stage: firstMatch.stage,
        seriesNumber: firstMatch.series_number,
        seriesFormat,
        matches: seriesMatches.sort((a, b) => (a.series_number || 0) - (b.series_number || 0)),
        teamA,
        teamB,
        // Determine series winner
        seriesWinner: determineSeriesWinner(seriesMatches, seriesFormat, teamA.id, teamB.id),
      };
    });
  };

  // Determine series winner based on series format
  const determineSeriesWinner = (matches: BracketMatch[], seriesFormat: string, teamAId: string, teamBId: string) => {
    const teamAWins = matches.filter(m => m.winner_id === teamAId).length;
    const teamBWins = matches.filter(m => m.winner_id === teamBId).length;
    
    const formatMap = {
      'bo1': 1,
      'bo3': 2,
      'bo5': 3,
      'bo7': 4
    };
    
    const winsNeeded = formatMap[seriesFormat as keyof typeof formatMap] || 1;
    
    if (teamAWins >= winsNeeded) return teamAId;
    if (teamBWins >= winsNeeded) return teamBId;
    return null; // Series not complete
  };

  // Get series display with win count
  const getSeriesDisplayWithWins = (series: any) => {
    const teamAWins = series.matches.filter((m: BracketMatch) => m.winner_id === series.teamA.id).length;
    const teamBWins = series.matches.filter((m: BracketMatch) => m.winner_id === series.teamB.id).length;
    
    const formatMap = {
      'bo1': 'BO1',
      'bo3': 'BO3', 
      'bo5': 'BO5',
      'bo7': 'BO7'
    };
    
    const formatText = formatMap[series.seriesFormat as keyof typeof formatMap] || series.seriesFormat.toUpperCase();
    
    return `${formatText} (${teamAWins}-${teamBWins})`;
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
          {relevantStages.map((stage) => {
            const stageMatches = groupedMatches[stage] || [];
            const series = groupMatchesBySeries(stageMatches);
            
            return (
              <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
                <h3 className="text-sm font-bold text-gray-600 dark:text-neutral-400 text-center sticky top-0 bg-white dark:bg-neutral-900 py-2">
                  {stage}
                </h3>
                <div className="flex flex-col gap-4">
                  {series.map((seriesData) => (
                    <div
                      key={seriesData.seriesKey}
                      className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer"
                      onClick={() => setSelectedSeries(seriesData)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedSeries(seriesData);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`text-sm mb-1 ${getWinnerClass({ winner_id: seriesData.seriesWinner } as BracketMatch, seriesData.teamA?.id || '')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {seriesData.teamA?.logo_url ? (
                              <img src={seriesData.teamA.logo_url} alt={`${seriesData.teamA.name || 'Team A'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                {seriesData.teamA?.name?.substring(0, 2).toUpperCase() || 'A'}
                              </div>
                            )}
                            <span className="truncate text-gray-900 dark:text-white">{seriesData.teamA?.name || "TBD"}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{seriesData.matches.filter(m => m.winner_id === seriesData.teamA.id).length}</span>
                        </div>
                      </div>
                      <div className={`text-sm ${getWinnerClass({ winner_id: seriesData.seriesWinner } as BracketMatch, seriesData.teamB?.id || '')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {seriesData.teamB?.logo_url ? (
                              <img src={seriesData.teamB.logo_url} alt={`${seriesData.teamB.name || 'Team B'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                {seriesData.teamB?.name?.substring(0, 2).toUpperCase() || 'B'}
                              </div>
                            )}
                            <span className="truncate text-gray-900 dark:text-white">{seriesData.teamB?.name || "TBD"}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{seriesData.matches.filter(m => m.winner_id === seriesData.teamB.id).length}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-neutral-400">
                            Series #{seriesData.seriesNumber}
                          </span>
                          <span className="text-xs text-gray-700 dark:text-neutral-300 font-semibold">
                            {getSeriesDisplayWithWins(seriesData)}
                          </span>
                        </div>
                        {seriesData.matches.length > 1 && (
                          <div className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                            {seriesData.matches.length} games
                          </div>
                        )}
                        {/* Spotlight link for Semi Finals/Finals */}
                        {(stage === "Semi Finals" || stage === "Finals" || stage === "Grand Finals") && (
                          <div className="mt-2">
                            <a 
                              href={`/matchups/${seriesData.matches[0]?.id}`}
                              className="text-xs bg-patriot-blue-100 dark:bg-blue-900 hover:bg-patriot-blue-200 dark:hover:bg-blue-800 text-patriot-blue-700 dark:text-blue-300 px-2 py-1 rounded transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Spotlight Matchup
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
          <h3 className="text-lg font-bold mb-4 text-patriot-blue-600 dark:text-blue-400">Winners Bracket</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-max p-4">
              {winnersStages.map((stage) => (
                <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
                  <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-400 text-center sticky top-0 bg-white dark:bg-neutral-900 py-2">
                    {stage}
                  </h4>
                  <div className="flex flex-col gap-4">
                    {winnersMatches[stage]?.map((match) => (
                      <div
                        key={match.id}
                        className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer"
                        onClick={() => setSelectedMatch(match)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedMatch(match);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {match.team_a?.logo_url ? (
                                <img src={match.team_a.logo_url} alt={`${match.team_a.name || 'Team A'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                  {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                                </div>
                              )}
                              <span className="truncate text-gray-900 dark:text-white">{match.team_a?.name || "TBD"}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{match.score_a ?? "-"}</span>
                          </div>
                        </div>
                        <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {match.team_b?.logo_url ? (
                                <img src={match.team_b.logo_url} alt={`${match.team_b.name || 'Team B'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                  {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                                </div>
                              )}
                              <span className="truncate text-gray-900 dark:text-white">{match.team_b?.name || "TBD"}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{match.score_b ?? "-"}</span>
                          </div>
                        </div>
                        {match.series_number && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                            <span className="text-xs text-gray-600 dark:text-neutral-400">
                              {getSeriesDisplay(match.series_number, getMatchSeriesFormat(match))}
                            </span>
                          </div>
                        )}
                        {/* Spotlight link for Semi Finals/Finals */}
                        {(match.stage === "Semi Finals" || match.stage === "Finals" || match.stage === "Grand Finals") && (
                          <div className="mt-2">
                            <a 
                              href={`/matchups/${match.id}`}
                              className="text-xs bg-patriot-blue-100 dark:bg-blue-900 hover:bg-patriot-blue-200 dark:hover:bg-blue-800 text-patriot-blue-700 dark:text-blue-300 px-2 py-1 rounded transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Spotlight Matchup
                            </a>
                          </div>
                        )}
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
            <h3 className="text-lg font-bold mb-4 text-patriot-red-600 dark:text-red-400">Losers Bracket</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-max p-4">
                {losersStages.map((stage) => (
                  <div key={stage} className="flex flex-col gap-4 min-w-[200px]">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-400 text-center sticky top-0 bg-white dark:bg-neutral-900 py-2">
                      {stage}
                    </h4>
                    <div className="flex flex-col gap-4">
                      {losersMatches[stage]?.map((match) => (
                        <div
                          key={match.id}
                          className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:border-red-500 dark:hover:border-red-500 transition cursor-pointer"
                          onClick={() => setSelectedMatch(match)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedMatch(match);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {match.team_a?.logo_url ? (
                                  <img src={match.team_a.logo_url} alt={`${match.team_a.name || 'Team A'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                    {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                                  </div>
                                )}
                                <span className="truncate text-gray-900 dark:text-white">{match.team_a?.name || "TBD"}</span>
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">{match.score_a ?? "-"}</span>
                            </div>
                          </div>
                          <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {match.team_b?.logo_url ? (
                                  <img src={match.team_b.logo_url} alt={`${match.team_b.name || 'Team B'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                                    {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                                  </div>
                                )}
                                <span className="truncate text-gray-900 dark:text-white">{match.team_b?.name || "TBD"}</span>
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">{match.score_b ?? "-"}</span>
                            </div>
                          </div>
                          {match.series_number && seriesFormat && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                              <span className="text-xs text-gray-600 dark:text-neutral-400">
                                {getSeriesDisplay(match.series_number, seriesFormat)}
                              </span>
                            </div>
                          )}
                          {/* Spotlight link for Semi Finals/Finals */}
                          {(match.stage === "Semi Finals" || match.stage === "Finals" || match.stage === "Grand Finals") && (
                            <div className="mt-2">
                              <a 
                                href={`/matchups/${match.id}`}
                                className="text-xs bg-patriot-blue-100 dark:bg-blue-900 hover:bg-patriot-blue-200 dark:hover:bg-blue-800 text-patriot-blue-700 dark:text-blue-300 px-2 py-1 rounded transition"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Spotlight Matchup
                              </a>
                            </div>
                          )}
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
            <h3 className="text-lg font-bold mb-3 text-gray-700 dark:text-neutral-300">{round}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedMatches[round]?.map((match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:border-green-500 dark:hover:border-green-500 transition cursor-pointer"
                  onClick={() => setSelectedMatch(match)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMatch(match);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.team_a?.logo_url ? (
                          <img src={match.team_a.logo_url} alt={`${match.team_a.name || 'Team A'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                            {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                          </div>
                        )}
                        <span className="truncate text-gray-900 dark:text-white">{match.team_a?.name || "TBD"}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{match.score_a ?? "-"}</span>
                    </div>
                  </div>
                  <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.team_b?.logo_url ? (
                          <img src={match.team_b.logo_url} alt={`${match.team_b.name || 'Team B'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                            {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                          </div>
                        )}
                        <span className="truncate text-gray-900 dark:text-white">{match.team_b?.name || "TBD"}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{match.score_b ?? "-"}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                    {new Date(match.played_at).toLocaleDateString()}
                  </div>
                  {match.series_number && seriesFormat && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                      <span className="text-xs text-gray-600 dark:text-neutral-400">
                        {getSeriesDisplay(match.series_number, seriesFormat)}
                      </span>
                    </div>
                  )}
                  {/* Spotlight link for Semi Finals/Finals */}
                  {(match.stage === "Semi Finals" || match.stage === "Finals" || match.stage === "Grand Finals") && (
                    <div className="mt-2">
                      <a 
                        href={`/matchups/${match.id}`}
                        className="text-xs bg-patriot-blue-100 dark:bg-blue-900 hover:bg-patriot-blue-200 dark:hover:bg-blue-800 text-patriot-blue-700 dark:text-blue-300 px-2 py-1 rounded transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Spotlight Matchup
                      </a>
                    </div>
                  )}
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
            className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:border-yellow-500 dark:hover:border-yellow-500 transition cursor-pointer"
            onClick={() => setSelectedMatch(match)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedMatch(match);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className={`text-sm mb-1 ${getWinnerClass(match, match.team_a_id)}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {match.team_a?.logo_url ? (
                    <img src={match.team_a.logo_url} alt={`${match.team_a.name || 'Team A'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                      {match.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                    </div>
                  )}
                  <span className="truncate text-gray-900 dark:text-white">{match.team_a?.name || "TBD"}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{match.score_a ?? "-"}</span>
              </div>
            </div>
            <div className={`text-sm ${getWinnerClass(match, match.team_b_id)}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {match.team_b?.logo_url ? (
                    <img src={match.team_b.logo_url} alt={`${match.team_b.name || 'Team B'} logo`} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-[8px] font-bold flex-shrink-0">
                      {match.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                    </div>
                  )}
                  <span className="truncate text-gray-900 dark:text-white">{match.team_b?.name || "TBD"}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{match.score_b ?? "-"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-500 mt-1">
              {match.stage && <span className="text-gray-700 dark:text-neutral-300">{match.stage}</span>}
              <span>{new Date(match.played_at).toLocaleDateString()}</span>
            </div>
            {match.series_number && seriesFormat && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="text-xs text-gray-600 dark:text-neutral-400">
                  {getSeriesDisplay(match.series_number, seriesFormat)}
                </span>
              </div>
            )}
            {/* Spotlight link for Semi Finals/Finals */}
            {(match.stage === "Semi Finals" || match.stage === "Finals" || match.stage === "Grand Finals") && (
              <div className="mt-2">
                <a 
                  href={`/matchups/${match.id}`}
                  className="text-xs bg-patriot-blue-100 dark:bg-blue-900 hover:bg-patriot-blue-200 dark:hover:bg-blue-800 text-patriot-blue-700 dark:text-blue-300 px-2 py-1 rounded transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Spotlight Matchup
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-neutral-400">
        <p>No bracket matches available.</p>
        <p className="text-sm mt-2">Matches will appear here once the tournament begins.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tournament Info Header */}
      <div className="mb-6 p-4 border border-gray-200 dark:border-neutral-800 rounded-lg bg-gray-50 dark:bg-neutral-900/50">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tournamentName}</h2>
          {getFormatBadge(format)}
          {status && (
            <span className={`px-3 py-1 rounded text-xs font-bold capitalize ${
              status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
              status === 'in progress' ? 'bg-patriot-blue-100 dark:bg-blue-900 text-patriot-blue-700 dark:text-blue-300' :
              'bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300'
            }`}>
              {status}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-neutral-400">
          {startDate && (
            <div>
              <span className="text-gray-500 dark:text-neutral-500">Start:</span>{" "}
              <span className="text-gray-700 dark:text-neutral-300">{new Date(startDate).toLocaleDateString()}</span>
            </div>
          )}
          {finalsDate && (
            <div>
              <span className="text-gray-500 dark:text-neutral-500">Finals:</span>{" "}
              <span className="text-gray-700 dark:text-neutral-300">{new Date(finalsDate).toLocaleDateString()}</span>
            </div>
          )}
          {prizePool && (
            <div>
              <span className="text-gray-500 dark:text-neutral-500">Prize Pool:</span>{" "}
              <span className="text-green-600 dark:text-green-400 font-semibold">${prizePool.toLocaleString()}</span>
            </div>
          )}
          {champion && (
            <div>
              <span className="text-gray-500 dark:text-neutral-500">Champion:</span>{" "}
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">🏆 {champion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="bg-gray-50 dark:bg-neutral-900/30 rounded-lg p-4 border border-gray-200 dark:border-neutral-800">
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
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedMatch(null);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full border border-gray-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Match Details</h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
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
                    ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.team_a?.logo_url ? (
                        <img src={selectedMatch.team_a.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-xs font-bold">
                          {selectedMatch.team_a?.name?.substring(0, 2).toUpperCase() || 'A'}
                        </div>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedMatch.team_a?.name || "Team A"}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMatch.score_a ?? "-"}</span>
                  </div>
                </div>
                <div className={`p-3 rounded border ${
                  selectedMatch.winner_id === selectedMatch.team_b_id
                    ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.team_b?.logo_url ? (
                        <img src={selectedMatch.team_b.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-xs font-bold">
                          {selectedMatch.team_b?.name?.substring(0, 2).toUpperCase() || 'B'}
                        </div>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedMatch.team_b?.name || "Team B"}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMatch.score_b ?? "-"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 space-y-2 text-sm">
                {selectedMatch.stage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Stage:</span>
                    <span className="text-gray-900 dark:text-neutral-200">{selectedMatch.stage}</span>
                  </div>
                )}
                {selectedMatch.series_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Series:</span>
                    <span className="text-gray-900 dark:text-neutral-200">
                      {getSeriesDisplay(selectedMatch.series_number, getMatchSeriesFormat(selectedMatch))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-neutral-400">Date:</span>
                  <span className="text-gray-900 dark:text-neutral-200">
                    {new Date(selectedMatch.played_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Series Details Modal */}
      {selectedSeries && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSeries(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedSeries(null);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full border border-gray-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Series Details</h3>
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {/* Series Header */}
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{selectedSeries.stage} - Series #{selectedSeries.seriesNumber}</h4>
                    <span className="text-sm text-gray-700 dark:text-neutral-300 font-semibold">
                      {getSeriesDisplayWithWins(selectedSeries)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      {selectedSeries.teamA?.logo_url ? (
                        <img src={selectedSeries.teamA.logo_url} alt="" className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-xs font-bold">
                          {selectedSeries.teamA?.name?.substring(0, 2).toUpperCase() || 'A'}
                        </div>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedSeries.teamA?.name || "TBD"}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedSeries.matches.filter((m: BracketMatch) => m.winner_id === selectedSeries.teamA.id).length} - {selectedSeries.matches.filter((m: BracketMatch) => m.winner_id === selectedSeries.teamB.id).length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedSeries.teamB?.name || "TBD"}</span>
                      {selectedSeries.teamB?.logo_url ? (
                        <img src={selectedSeries.teamB.logo_url} alt="" className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-gray-600 dark:text-neutral-500 text-xs font-bold">
                          {selectedSeries.teamB?.name?.substring(0, 2).toUpperCase() || 'B'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Games */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-700 dark:text-neutral-300">Games</h5>
                  {selectedSeries.matches.map((match: BracketMatch, index: number) => (
                    <div
                      key={match.id}
                      className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                      onClick={() => {
                        setSelectedSeries(null);
                        setSelectedMatch(match);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedSeries(null);
                          setSelectedMatch(match);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-600 dark:text-neutral-400">Game {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 dark:text-white">{match.score_a ?? "-"}</span>
                            <span className="text-gray-500 dark:text-neutral-500">-</span>
                            <span className="text-sm text-gray-900 dark:text-white">{match.score_b ?? "-"}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-500">
                          {new Date(match.played_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

