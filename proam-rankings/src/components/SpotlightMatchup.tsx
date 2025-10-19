import { useState } from "react";

type Player = {
  player_id: string;
  player_name: string;
  position: string | null;
  salary_tier: string | null;
  twitch: string | null;
  twitter_id: string | null;
  discord_id: string | null;
};

type PlayerStats = {
  player_id: string;
  games_played: number;
  avg_points: string;
  avg_assists: string;
  avg_rebounds: string;
  avg_steals: string;
  avg_blocks: string;
};

type TeamTournamentStats = {
  wins: number;
  losses: number;
  points_for: number;
  points_against: number;
  final_placement: number | null;
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
};

type SpotlightMatchupProps = {
  match: SpotlightMatch;
};

export default function SpotlightMatchup({ match }: SpotlightMatchupProps) {
  const [activeTab, setActiveTab] = useState<'rosters' | 'stats'>('rosters');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'Min': 'text-blue-400',
      'Rookie': 'text-purple-400'
    };
    return colors[tier || ''] || 'text-neutral-400';
  };

  const PlayerCard = ({ player, team }: { player: Player; team: Team }) => {
    const stats = getPlayerStats(player.player_id, team);
    
    return (
      <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:border-blue-500 transition">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="font-semibold text-white">{player.player_name}</div>
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
              title={`Watch ${player.player_name} on Twitch`}
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
              <div className="font-semibold text-white">{stats.avg_points}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">APG</div>
              <div className="font-semibold text-white">{stats.avg_assists}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">RPG</div>
              <div className="font-semibold text-white">{stats.avg_rebounds}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">SPG</div>
              <div className="font-semibold text-white">{stats.avg_steals}</div>
            </div>
            <div className="text-center">
              <div className="text-neutral-400">BPG</div>
              <div className="font-semibold text-white">{stats.avg_blocks}</div>
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
        <div className={`rounded-lg p-6 mb-6 ${isWinner && match.winner_id ? 'bg-green-900/20 border-green-500' : 'bg-neutral-800'} border`}>
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
          <div className="bg-neutral-800 rounded-lg p-4 mb-6 border border-neutral-700">
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
            team.roster.map((player) => (
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
        <div className="flex border-b border-neutral-700 mb-4">
          <button
            onClick={() => setActiveTab('rosters')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'rosters'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Rosters
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'stats'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tournament Stats
          </button>
        </div>
      </div>
    </div>
  );
}
