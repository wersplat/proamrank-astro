import { useState } from 'react';
import Overview from './tabs/Overview';
import Games from './tabs/Games';
import Career from './tabs/Career';
import Badges from './tabs/Badges';
import Media from './tabs/Media';
import StatsBySeason from './tabs/StatsBySeason';
import ScoutingReport from './tabs/ScoutingReport';

type TabsProps = {
  player: any;
  team: any;
  recentGames: any[];
  playerId: string;
  performance: any;
  globalRating?: any;
  seasonStats?: any[] | null;
};

export default function PlayerTabs({ player, team, recentGames, playerId, performance, globalRating, seasonStats }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'games', label: 'Games' },
    { id: 'career', label: 'Career' },
    { id: 'stats-by-season', label: 'Stats by Season' },
    { id: 'scouting-report', label: 'Scouting Report' },
    { id: 'badges', label: 'Badges' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-neutral-800 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${
              activeTab === tab.id
                ? 'text-patriot-blue-600 dark:text-blue-400 border-b-2 border-patriot-blue-600 dark:border-blue-400 bg-gray-50 dark:bg-neutral-800'
                : 'text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-4 md:p-6">
        {activeTab === 'overview' && (
          <Overview player={player} team={team} performance={performance} globalRating={globalRating} />
        )}
        {activeTab === 'games' && (
          <Games player={player} recentGames={recentGames} />
        )}
        {activeTab === 'career' && (
          <Career player={player} playerId={playerId} />
        )}
        {activeTab === 'stats-by-season' && (
          <StatsBySeason player={player} seasonStats={seasonStats} />
        )}
        {activeTab === 'scouting-report' && (
          <ScoutingReport player={player} performance={performance} recentGames={recentGames} />
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
