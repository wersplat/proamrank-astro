import { useState } from "react";

type Player = {
  player_id: string;
  gamertag: string | null;
  position: string | null;
  salary_tier: string | null;
  twitch: string | null;
  discord_id: string | null;
};

type PlayerStats = {
  avg_points: number;
  avg_assists: number;
  avg_rebounds: number;
  avg_steals: number;
  avg_blocks: number;
  games_played: number;
};

type TeamTournamentStats = {
  wins: number;
  losses: number;
  points_for: number;
  points_against: number;
  final_placement: number | null;
} | null;

type HeadToHeadData = {
  total_meetings: number;
  team_1_wins: number;
  team_2_wins: number;
  team_1_avg_score: number;
  team_2_avg_score: number;
  avg_score_differential: number;
  last_meeting: string | null;
  days_since_last_meeting: number | null;
  current_winner: string | null;
  team_1_last_5_wins: number;
  team_2_last_5_wins: number;
  team_a_wins: number;
  team_b_wins: number;
} | null;

type Team = {
  id: string;
  name: string;
  logo_url: string | null;
  roster: Player[];
  player_stats: Map<string, PlayerStats>;
  tournament_stats: TeamTournamentStats;
};

type SpotlightMatch = {
  id: string | null;
  played_at: string | null;
  stage: string | null;
  team_a_id: string | null;
  team_b_id: string | null;
  score_a: number | null;
  score_b: number | null;
  winner_id: string | null;
  team_a: Team;
  team_b: Team;
  tournament: { id: string; name: string } | null;
  organizer_twitch: string | null;
  head_to_head: HeadToHeadData;
};

type SpotlightMatchupProps = {
  match: SpotlightMatch;
};

export default function SpotlightMatchup({ match }: SpotlightMatchupProps) {
  const [activeTab, setActiveTab] = useState<'rosters' | 'stats' | 'head-to-head'>('rosters');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    
    // Apply the same timezone fix as in UpcomingSpotlightBanner
    // Based on the 4-hour offset issue with timestamptz fields
    const parsedDate = new Date(dateString);
    const adjustedDate = new Date(parsedDate.getTime() - (4 * 60 * 60 * 1000)); // Subtract 4 hours
    
    return adjustedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTeamRecord = (team: Team) => {
    if (!team.tournament_stats) return null;
    const { wins, losses } = team.tournament_stats;
    return `${wins}-${losses}`;
  };

  const getPlayerStats = (playerId: string, team: Team): PlayerStats | null => {
    return team.player_stats.get(playerId) || null;
  };

  const getSalaryTierColor = (tier: string | null) => {
    const colors: Record<string, string> = {
      'Max': 'text-yellow-400',
      'SuperMax': 'text-red-400',
      'Mid': 'text-green-400',
      'Min': 'text-patriot-blue-400',
      'Rookie': 'text-purple-400'
    };
    return colors[tier || ''] || 'text-neutral-400';
  };

  const PlayerCard = ({ player, team }: { player: Player; team: Team }) => {
    const stats = getPlayerStats(player.player_id, team);
    
    return (
      <div className="bg-patriot-blue-900 rounded-lg p-4 border border-patriot-blue-800 hover:border-patriot-red-500 transition">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="font-semibold text-white">{player.gamertag}</div>
              <div className="text-sm text-neutral-400">
                {player.position && (
                  <span className="mr-2">{player.position}</span>
                )}
                <span className={getSalaryTierColor(player.salary_tier)}>
                  {player.salary_tier || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          {player.twitch && (
            <a 
              href={`https://twitch.tv/${player.twitch}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition"
              title={`Watch ${player.gamertag} on Twitch`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.149 0L.537 4.119v15.838h5.731V24h3.224l3.045-3.043h3.135L24 15.365V0H2.149zm19.164 13.612l-2.591 2.579h-2.591l-2.579 2.579V16.19H4.322V2.149h16.991v11.463zm-3.406-3.406H18.063v6.056h-1.156v-6.056zm-4.365 0H13.697v6.056h-1.155v-6.056z"/>
              </svg>
            </a>
          )}
        </div>
        
        {stats && (
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div className="text-center">
              <div className="text-neutral-400">PPG</div>
              <div className="font-semibold text-white">{stats.avg_points?.toFixed(1) || '0.0'}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">APG</div>
              <div className="font-semibold text-white">{stats.avg_assists?.toFixed(1) || '0.0'}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">RPG</div>
              <div className="font-semibold text-white">{stats.avg_rebounds?.toFixed(1) || '0.0'}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">SPG</div>
              <div className="font-semibold text-white">{stats.avg_steals?.toFixed(1) || '0.0'}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">BPG</div>
              <div className="font-semibold text-white">{stats.avg_blocks?.toFixed(1) || '0.0'}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TeamSection = ({ team, isTeamA }: { team: Team; isTeamA: boolean }) => {
    const isWinner = match.winner_id === team.id;
    const teamScore = isTeamA ? match.score_a : match.score_b;
    const opponentScore = isTeamA ? match.score_b : match.score_a;
    const record = getTeamRecord(team);

    return (
      <div className={`flex-1 ${isTeamA ? 'pr-4' : 'pl-4'}`}>
        {/* Team Header */}
        <div className={`rounded-lg p-6 mb-6 ${isWinner && match.winner_id ? 'bg-green-900/20 border-green-500' : 'bg-patriot-blue-900'} border border-patriot-blue-800`}>
          <div className="flex items-center gap-4 mb-3">
            {team.logo_url ? (
              <img 
                src={team.logo_url} 
                alt={`${team.name} logo`} 
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded bg-neutral-700 flex items-center justify-center text-neutral-500 text-xl font-bold">
                {team.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{team.name}</h2>
              <div className="flex items-center gap-4 text-sm text-neutral-400">
                {record && <span>Record: {record}</span>}
                {team.tournament_stats?.final_placement && (
                  <span>Placement: #{team.tournament_stats.final_placement}</span>
                )}
              </div>
            </div>
          </div>
          
          {teamScore !== null && opponentScore !== null && (
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {teamScore} - {opponentScore}
              </div>
              {isWinner && (
                <div className="text-green-400 font-semibold mt-2">
                  🏆 Winner
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Stats */}
        {team.tournament_stats && (
          <div className="bg-patriot-blue-900 rounded-lg p-4 mb-6 border border-patriot-blue-800">
            <h3 className="text-lg font-semibold mb-3 text-white">Tournament Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-neutral-400">Points For</div>
                <div className="font-semibold text-white">{team.tournament_stats.points_for.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-neutral-400">Points Against</div>
                <div className="font-semibold text-white">{team.tournament_stats.points_against.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Players */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Roster</h3>
          {team.roster.length > 0 ? (
            team.roster
              .sort((a, b) => {
                // Define position order: Point Guard, Shooting Guard, Lock, Power Forward, C
                const positionOrder = {
                  'Point Guard': 1,
                  'Shooting Guard': 2,
                  'Lock': 3,
                  'Power Forward': 4,
                  'C': 5
                };
                
                const aOrder = positionOrder[a.position as keyof typeof positionOrder] || 999;
                const bOrder = positionOrder[b.position as keyof typeof positionOrder] || 999;
                
                return aOrder - bOrder;
              })
              .map((player) => (
                <PlayerCard key={player.player_id} player={player} team={team} />
              ))
          ) : (
            <div className="text-center py-8 text-neutral-400">
              No roster data available
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {match.stage || 'Match'}
        </h1>
        <div className="text-lg text-neutral-300 mb-2">
          {match.team_a.name} vs {match.team_b.name}
        </div>
        <div className="text-sm text-neutral-400 mb-4">
          {formatDate(match.played_at)}
        </div>
        {match.tournament && (
          <div className="inline-block bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm font-semibold">
            {match.tournament.name}
          </div>
        )}
      </div>

      {/* Organizer Twitch Link */}
      {match.organizer_twitch && (
        <div className="text-center">
          <a 
            href={match.organizer_twitch}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-900 hover:bg-purple-800 text-purple-300 px-4 py-2 rounded-lg transition font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.149 0L.537 4.119v15.838h5.731V24h3.224l3.045-3.043h3.135L24 15.365V0H2.149zm19.164 13.612l-2.591 2.579h-2.591l-2.579 2.579V16.19H4.322V2.149h16.991v11.463zm-3.406-3.406H18.063v6.056h-1.156v-6.056zm-4.365 0H13.697v6.056h-1.155v-6.056z"/>
            </svg>
            Watch Tournament Stream
          </a>
        </div>
      )}

      {/* Team Comparison */}
      <div className="flex gap-8">
        <TeamSection team={match.team_a} isTeamA={true} />
        <div className="w-px bg-neutral-700"></div>
        <TeamSection team={match.team_b} isTeamA={false} />
      </div>

      {/* Tab Navigation for Mobile */}
      <div className="md:hidden">
        <div className="flex border-b border-patriot-blue-800 mb-4">
          <button
            onClick={() => setActiveTab('rosters')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'rosters'
                ? 'text-patriot-red-400 border-b-2 border-patriot-red-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Rosters
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'stats'
                ? 'text-patriot-red-400 border-b-2 border-patriot-red-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tournament Stats
          </button>
          {match.head_to_head && (
            <button
              onClick={() => setActiveTab('head-to-head')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'head-to-head'
                  ? 'text-patriot-red-400 border-b-2 border-patriot-red-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Head-to-Head
            </button>
          )}
        </div>
      </div>

      {/* Head-to-Head Section */}
      {match.head_to_head && (
        <div className="bg-patriot-blue-900 rounded-lg p-6 border border-patriot-blue-800">
          <h3 className="text-xl font-bold text-white mb-6">Head-to-Head History</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Record */}
            <div className="bg-patriot-blue-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-4">All-Time Series</h4>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{match.head_to_head.team_a_wins}</div>
                  <div className="text-sm text-neutral-400">{match.team_a.name}</div>
                </div>
                <div className="text-neutral-500 text-sm">vs</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{match.head_to_head.team_b_wins}</div>
                  <div className="text-sm text-neutral-400">{match.team_b.name}</div>
                </div>
              </div>
              <div className="text-center text-sm text-neutral-400">
                Total meetings: {match.head_to_head.total_meetings}
              </div>
            </div>

            {/* Average Scores */}
            <div className="bg-patriot-blue-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Average Scores</h4>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{match.head_to_head.team_1_avg_score?.toFixed(1) || '0.0'}</div>
                  <div className="text-sm text-neutral-400">Team A</div>
                </div>
                <div className="text-neutral-500 text-sm">avg</div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{match.head_to_head.team_2_avg_score?.toFixed(1) || '0.0'}</div>
                  <div className="text-sm text-neutral-400">Team B</div>
                </div>
              </div>
              <div className="text-center text-sm text-neutral-400">
                Avg margin: {match.head_to_head.avg_score_differential?.toFixed(1) || '0.0'} points
              </div>
            </div>
          </div>

          {/* Last Meeting & Recent Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {match.head_to_head.last_meeting && (
              <div className="bg-patriot-blue-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Last Meeting</h4>
                <div className="text-sm text-neutral-400">
                  {new Date(match.head_to_head.last_meeting).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {match.head_to_head.days_since_last_meeting && (
                  <div className="text-xs text-neutral-500 mt-1">
                    {match.head_to_head.days_since_last_meeting} days ago
                  </div>
                )}
              </div>
            )}

            <div className="bg-patriot-blue-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Last 5 Meetings</h4>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{match.head_to_head.team_1_last_5_wins}</div>
                  <div className="text-sm text-neutral-400">{match.team_a.name}</div>
                </div>
                <div className="text-neutral-500 text-sm">vs</div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{match.head_to_head.team_2_last_5_wins}</div>
                  <div className="text-sm text-neutral-400">{match.team_b.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
