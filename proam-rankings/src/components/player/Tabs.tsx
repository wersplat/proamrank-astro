import { useState } from 'react';
import Overview from './tabs/Overview';
import Games from './tabs/Games';
import Career from './tabs/Career';
import Badges from './tabs/Badges';
import Media from './tabs/Media';

type TabsProps = {
  player: any;
  team: any;
  recentGames: any[];
  playerId: string;
  performance: any;
};

export default function PlayerTabs({ player, team, recentGames, playerId, performance }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'games', label: 'Games' },
    { id: 'career', label: 'Career' },
    { id: 'badges', label: 'Badges' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-neutral-800'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <Overview player={player} team={team} performance={performance} />
        )}
        {activeTab === 'games' && (
          <Games player={player} recentGames={recentGames} />
        )}
        {activeTab === 'career' && (
          <Career player={player} playerId={playerId} />
        )}
        {activeTab === 'badges' && (
          <Badges player={player} playerId={playerId} />
        )}
        {activeTab === 'media' && (
          <Media player={player} playerId={playerId} />
        )}
      </div>
    </div>
  );
}
