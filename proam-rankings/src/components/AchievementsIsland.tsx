import React, { useState, useMemo } from 'react';
import { achievements } from '../data/achievements';
import { Achievement, AchievementCategory } from '../types/achievements';

interface Props {
  searchParam?: string;
  categoryParam?: string;
  rarityParam?: string;
  viewParam?: string;
}

const categoryOptions = [
  { value: '', label: 'All Categories', icon: '📁' },
  { value: 'scoring', label: 'Scoring', icon: '🏀' },
  { value: 'assists', label: 'Assists', icon: '🎯' },
  { value: 'defense', label: 'Defense', icon: '🛡️' },
  { value: 'rebounding', label: 'Rebounding', icon: '🪣' },
  { value: 'mixed', label: 'Mixed Stats', icon: '📊' },
  { value: 'streak', label: 'Streak & Longevity', icon: '🔥' },
  { value: 'legendary', label: 'Legendary', icon: '🌟' }
];

const rarityOptions = [
  { value: '', label: 'All Rarities' },
  { value: 'common', label: 'Common' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' }
];

const rarityStyles = {
  common: 'bg-gray-100 text-gray-700 border-gray-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  epic: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
};

export default function AchievementsIsland({ 
  searchParam = '', 
  categoryParam = '', 
  rarityParam = '',
  viewParam = 'grid'
}: Props) {
  const [search, setSearch] = useState(searchParam);
  const [category, setCategory] = useState(categoryParam);
  const [rarity, setRarity] = useState(rarityParam);
  const [view, setView] = useState<'grid' | 'list'>(viewParam as 'grid' | 'list' || 'grid');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesSearch = !search || 
        achievement.title.toLowerCase().includes(search.toLowerCase()) ||
        achievement.description.toLowerCase().includes(search.toLowerCase()) ||
        achievement.badge.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !category || achievement.category === category;
      const matchesRarity = !rarity || achievement.rarity === rarity;
      
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [search, category, rarity]);

  const hasActiveFilters = search || category || rarity;

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setRarity('');
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:min-w-[250px]">
              <input
                type="text"
                placeholder="Search achievements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-white/20 bg-patriot-blue-900/50 text-white focus:outline-none focus:ring-2 focus:ring-patriot-red-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-white/20 bg-patriot-blue-900/50 text-white focus:outline-none focus:ring-2 focus:ring-patriot-red-500"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="px-4 py-2 rounded-lg border border-white/20 bg-patriot-blue-900/50 text-white focus:outline-none focus:ring-2 focus:ring-patriot-red-500"
            >
              {rarityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' ? 'bg-patriot-red-600 text-white' : 'bg-patriot-blue-900/50 text-neutral-300 hover:text-white border border-white/20'
              }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list' ? 'bg-patriot-red-600 text-white' : 'bg-patriot-blue-900/50 text-neutral-300 hover:text-white border border-white/20'
              }`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-400">Active filters:</span>
            {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-white/20 bg-patriot-blue-900/50 text-neutral-200">
                Search: "{search}"
                <button onClick={() => setSearch('')} className="hover:text-white">×</button>
              </span>
            )}
            {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-white/20 bg-patriot-blue-900/50 text-neutral-200">
                Category: {categoryOptions.find(opt => opt.value === category)?.label}
                <button onClick={() => setCategory('')} className="hover:text-white">×</button>
              </span>
            )}
            {rarity && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-white/20 bg-patriot-blue-900/50 text-neutral-200">
                Rarity: {rarityOptions.find(opt => opt.value === rarity)?.label}
                <button onClick={() => setRarity('')} className="hover:text-white">×</button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-sm border border-red-700 bg-red-900/20 text-red-300 hover:bg-red-900/40 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No achievements found</h3>
          <p className="text-neutral-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && filteredAchievements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className="rounded-lg border border-white/20 bg-patriot-blue-900/50 p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-patriot-red-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-3xl mx-auto mb-3">
                  {achievement.icon}
                </div>
                
                <span className="inline-block px-3 py-1 rounded-full text-xs border border-white/20 bg-patriot-blue-900/50 text-neutral-200 mb-3">
                  {achievement.badge}
                </span>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {achievement.title}
                </h3>
                
                <p className="text-sm text-neutral-400 mb-3 min-h-[40px]">
                  {achievement.description}
                </p>
                
                <div className="flex justify-center gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${rarityStyles[achievement.rarity]}`}>
                    {achievement.rarity}
                  </span>
                  <span className="px-2 py-1 rounded text-xs border border-neutral-700 bg-neutral-800 text-neutral-300">
                    {categoryOptions.find(c => c.value === achievement.category)?.icon}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-500 mt-2">
                  {achievement.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && filteredAchievements.length > 0 && (
        <div className="rounded-lg border border-white/20 bg-patriot-blue-900/50 overflow-hidden">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`p-4 cursor-pointer hover:bg-patriot-blue-900 transition-colors ${
                index !== filteredAchievements.length - 1 ? 'border-b border-white/20' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {achievement.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs border border-white/20 bg-patriot-blue-900/50 text-neutral-200">
                      {achievement.badge}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${rarityStyles[achievement.rarity]}`}>
                      {achievement.rarity}
                    </span>
                    <span className="px-2 py-1 rounded text-xs border border-neutral-700 bg-neutral-800 text-neutral-300">
                      {categoryOptions.find(c => c.value === achievement.category)?.icon}
                    </span>
                    <span className="text-xs text-neutral-500">{achievement.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="bg-patriot-blue-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedAchievement.title}</h2>
                
                <span className="inline-block px-3 py-1 rounded-full text-sm border border-neutral-700 bg-neutral-800 text-neutral-300 mb-4">
                  {selectedAchievement.badge}
                </span>
                
                <p className="text-neutral-400 mb-6">{selectedAchievement.description}</p>
                
                <div className="bg-patriot-blue-900/50 p-4 rounded-lg mb-6 border border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-2">Requirements</h3>
                  <p className="text-sm text-neutral-300">{selectedAchievement.requirements}</p>
                </div>

                <div className="flex justify-center gap-2 flex-wrap mb-6">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${rarityStyles[selectedAchievement.rarity]}`}>
                    {selectedAchievement.rarity}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-sm border border-neutral-700 bg-neutral-800 text-neutral-300">
                    {categoryOptions.find(c => c.value === selectedAchievement.category)?.icon}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-sm border border-neutral-700 bg-neutral-800 text-neutral-300">
                    {selectedAchievement.type}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="px-6 py-2 rounded-lg bg-patriot-red-600 hover:bg-patriot-red-700 text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

