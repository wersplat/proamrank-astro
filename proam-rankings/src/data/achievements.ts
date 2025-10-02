import { Achievement } from '../types/achievements';

export const achievements: Achievement[] = [
  // 🏀 Scoring Badges
  {
    id: 'scoring-1k',
    title: '1K Scorer',
    description: 'Reach 1,000 career points',
    category: 'scoring',
    rarity: 'common',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '1,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-2-5k',
    title: '2.5K Scorer',
    description: 'Reach 2,500 career points',
    category: 'scoring',
    rarity: 'common',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '2,500+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-5k',
    title: '5K Scorer',
    description: 'Reach 5,000 career points',
    category: 'scoring',
    rarity: 'rare',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '5,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-7-5k',
    title: '7.5K Scorer',
    description: 'Reach 7,500 career points',
    category: 'scoring',
    rarity: 'rare',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '7,500+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-10k',
    title: '10K Scorer',
    description: 'Reach 10,000 career points',
    category: 'scoring',
    rarity: 'epic',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '10,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-15k',
    title: '15K Scorer',
    description: 'Reach 15,000 career points',
    category: 'scoring',
    rarity: 'epic',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '15,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-20k',
    title: '20K Scorer',
    description: 'Reach 20,000 career points',
    category: 'scoring',
    rarity: 'legendary',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '20,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-25k',
    title: '25K Scorer',
    description: 'Reach 25,000 career points',
    category: 'scoring',
    rarity: 'legendary',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '25,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-30k',
    title: '30K Club',
    description: 'Reach 30,000 career points',
    category: 'scoring',
    rarity: 'legendary',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '30,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-40-bomb',
    title: '40 Bomb',
    description: 'Score 40+ in one game',
    category: 'scoring',
    rarity: 'rare',
    icon: '💥',
    type: 'Single Game',
    requirements: '40+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-60-bomb',
    title: '60 Bomb',
    description: 'Score 60+ in one game',
    category: 'scoring',
    rarity: 'epic',
    icon: '💥',
    type: 'Single Game',
    requirements: '60+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-81-club',
    title: '81 Club',
    description: 'Score 81+ in one game',
    category: 'scoring',
    rarity: 'legendary',
    icon: '💥',
    type: 'Single Game',
    requirements: '81+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-100-club',
    title: '100 Club',
    description: 'Score 100+ in one game',
    category: 'scoring',
    rarity: 'legendary',
    icon: '💯',
    type: 'Single Game',
    requirements: '100+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-sharp-shooter',
    title: 'Sharp Shooter',
    description: '10+ threes in one game',
    category: 'scoring',
    rarity: 'epic',
    icon: '🎯',
    type: 'Efficiency',
    requirements: '10+ three-pointers in a single game',
    badge: 'Efficiency'
  },
  {
    id: 'scoring-flawless',
    title: 'Flawless',
    description: '100% FG, 10+ attempts',
    category: 'scoring',
    rarity: 'legendary',
    icon: '✨',
    type: 'Efficiency',
    requirements: '100% field goal percentage with 10+ attempts',
    badge: 'Efficiency'
  },
  {
    id: 'scoring-efficiency-king',
    title: 'Efficiency King',
    description: '70% FG, 15+ attempts',
    category: 'scoring',
    rarity: 'epic',
    icon: '👑',
    type: 'Efficiency',
    requirements: '70%+ field goal percentage with 15+ attempts',
    badge: 'Efficiency'
  },

  // 🎯 Assists Badges
  {
    id: 'assists-1k-dimes',
    title: '1K Dimes',
    description: '1,000 career assists',
    category: 'assists',
    rarity: 'common',
    icon: '🎯',
    type: 'Career Milestone',
    requirements: '1,000+ career assists',
    badge: 'Career Milestones'
  },
  {
    id: 'assists-2-5k-dimes',
    title: '2.5K Dimes',
    description: '2,500 assists',
    category: 'assists',
    rarity: 'rare',
    icon: '🎯',
    type: 'Career Milestone',
    requirements: '2,500+ career assists',
    badge: 'Career Milestones'
  },
  {
    id: 'assists-5k-dimes',
    title: '5K Dimes',
    description: '5,000 assists',
    category: 'assists',
    rarity: 'epic',
    icon: '🎯',
    type: 'Career Milestone',
    requirements: '5,000+ career assists',
    badge: 'Career Milestones'
  },
  {
    id: 'assists-10k-dimes',
    title: '10K Dimes',
    description: '10,000 assists',
    category: 'assists',
    rarity: 'legendary',
    icon: '🎯',
    type: 'Career Milestone',
    requirements: '10,000+ career assists',
    badge: 'Career Milestones'
  },
  {
    id: 'assists-double-dimes',
    title: 'Double Dimes',
    description: '20+ assists in a game',
    category: 'assists',
    rarity: 'epic',
    icon: '🎯',
    type: 'Single Game',
    requirements: '20+ assists in a single game',
    badge: 'Single Game'
  },
  {
    id: 'assists-floor-general',
    title: 'Floor General',
    description: '15+ assists in back-to-back games',
    category: 'assists',
    rarity: 'legendary',
    icon: '🎯',
    type: 'Single Game',
    requirements: '15+ assists in consecutive games',
    badge: 'Single Game'
  },
  {
    id: 'assists-10-apg',
    title: '10+ APG',
    description: 'Average 10+ assists per game in a season',
    category: 'assists',
    rarity: 'legendary',
    icon: '🎯',
    type: 'Season',
    requirements: '10+ assists per game average for a season',
    badge: 'Season'
  },

  // 🛡️ Defense Badges
  {
    id: 'defense-pickpocket',
    title: 'Pickpocket',
    description: '10+ steals in a game',
    category: 'defense',
    rarity: 'epic',
    icon: '🛡️',
    type: 'Steals',
    requirements: '10+ steals in a single game',
    badge: 'Steals'
  },
  {
    id: 'defense-season-stealer',
    title: 'Season Stealer',
    description: 'Lead league in steals per game',
    category: 'defense',
    rarity: 'legendary',
    icon: '🛡️',
    type: 'Steals',
    requirements: 'Lead the league in steals per game for a season',
    badge: 'Steals'
  },
  {
    id: 'defense-shot-block-party',
    title: 'Shot Block Party',
    description: '8+ blocks in a game',
    category: 'defense',
    rarity: 'epic',
    icon: '🛡️',
    type: 'Blocks',
    requirements: '8+ blocks in a single game',
    badge: 'Blocks'
  },
  {
    id: 'defense-season-swatter',
    title: 'Season Swatter',
    description: 'Lead league in blocks per game',
    category: 'defense',
    rarity: 'legendary',
    icon: '🛡️',
    type: 'Blocks',
    requirements: 'Lead the league in blocks per game for a season',
    badge: 'Blocks'
  },
  {
    id: 'defense-clamps',
    title: 'Clamps',
    description: 'Hold matchup to <5 points',
    category: 'defense',
    rarity: 'rare',
    icon: '🔒',
    type: 'Lockdown',
    requirements: 'Hold opposing player to under 5 points',
    badge: 'Lockdown'
  },
  {
    id: 'defense-beast',
    title: 'Defensive Beast',
    description: '5 steals and 5 blocks in one game',
    category: 'defense',
    rarity: 'legendary',
    icon: '🛡️',
    type: 'Lockdown',
    requirements: '5+ steals and 5+ blocks in a single game',
    badge: 'Lockdown'
  },

  // 🪣 Rebounding Badges
  {
    id: 'rebounding-1k-boards',
    title: '1K Boards',
    description: '1,000 career rebounds',
    category: 'rebounding',
    rarity: 'common',
    icon: '🪣',
    type: 'Career Milestone',
    requirements: '1,000+ career rebounds',
    badge: 'Career Milestones'
  },
  {
    id: 'rebounding-5k-boards',
    title: '5K Boards',
    description: '5,000 rebounds',
    category: 'rebounding',
    rarity: 'epic',
    icon: '🪣',
    type: 'Career Milestone',
    requirements: '5,000+ career rebounds',
    badge: 'Career Milestones'
  },
  {
    id: 'rebounding-10k-boards',
    title: '10K Boards',
    description: '10,000 rebounds',
    category: 'rebounding',
    rarity: 'legendary',
    icon: '🪣',
    type: 'Career Milestone',
    requirements: '10,000+ career rebounds',
    badge: 'Career Milestones'
  },
  {
    id: 'rebounding-glass-cleaner',
    title: 'Glass Cleaner',
    description: '20+ rebounds in a game',
    category: 'rebounding',
    rarity: 'epic',
    icon: '🪣',
    type: 'Single Game',
    requirements: '20+ rebounds in a single game',
    badge: 'Single Game'
  },
  {
    id: 'rebounding-30-board-club',
    title: '30 Board Club',
    description: '30+ rebounds in a game',
    category: 'rebounding',
    rarity: 'legendary',
    icon: '🪣',
    type: 'Single Game',
    requirements: '30+ rebounds in a single game',
    badge: 'Single Game'
  },
  {
    id: 'rebounding-board-leader',
    title: 'Board Leader',
    description: 'Lead league in rebounds per game',
    category: 'rebounding',
    rarity: 'legendary',
    icon: '🪣',
    type: 'Season',
    requirements: 'Lead the league in rebounds per game for a season',
    badge: 'Season'
  },

  // 📊 Mixed Stat Badges
  {
    id: 'mixed-double-double-machine',
    title: 'Double-Double Machine',
    description: '10+ in two categories, 10+ times in a season',
    category: 'mixed',
    rarity: 'epic',
    icon: '📊',
    type: 'Mixed Stats',
    requirements: '10+ double-doubles in a single season',
    badge: 'Mixed Stat Badges'
  },
  {
    id: 'mixed-triple-double-machine',
    title: 'Triple-Double Machine',
    description: 'Triple-double in a game',
    category: 'mixed',
    rarity: 'legendary',
    icon: '📊',
    type: 'Mixed Stats',
    requirements: 'Triple-double in a single game',
    badge: 'Mixed Stat Badges'
  },
  {
    id: 'mixed-5x5-club',
    title: '5x5 Club',
    description: 'At least 5 in five categories',
    category: 'mixed',
    rarity: 'legendary',
    icon: '📊',
    type: 'Mixed Stats',
    requirements: '5+ in points, rebounds, assists, steals, and blocks in one game',
    badge: 'Mixed Stat Badges'
  },
  {
    id: 'mixed-quadruple-double',
    title: 'Quadruple-Double',
    description: 'Ultra-rare feat',
    category: 'mixed',
    rarity: 'legendary',
    icon: '📊',
    type: 'Mixed Stats',
    requirements: '10+ in four statistical categories in one game',
    badge: 'Mixed Stat Badges'
  },

  // 🔥 Streak & Longevity Badges
  {
    id: 'streak-hot-streak',
    title: 'Hot Streak',
    description: '5 straight 20+ point games',
    category: 'streak',
    rarity: 'rare',
    icon: '🔥',
    type: 'Streak',
    requirements: '5 consecutive games with 20+ points',
    badge: 'Streak & Longevity'
  },
  {
    id: 'streak-consistency-award',
    title: 'Consistency Award',
    description: '15/5/5 average across 10 games',
    category: 'streak',
    rarity: 'epic',
    icon: '🔥',
    type: 'Streak',
    requirements: '15+ points, 5+ rebounds, 5+ assists average over 10 games',
    badge: 'Streak & Longevity'
  },
  {
    id: 'streak-iron-man',
    title: 'Iron Man',
    description: 'Appear in every game of a season',
    category: 'streak',
    rarity: 'rare',
    icon: '🔥',
    type: 'Longevity',
    requirements: 'Play in every game of a season',
    badge: 'Streak & Longevity'
  },
  {
    id: 'streak-career-longevity',
    title: 'Career Longevity',
    description: '500+ games played',
    category: 'streak',
    rarity: 'epic',
    icon: '🔥',
    type: 'Longevity',
    requirements: '500+ career games played',
    badge: 'Streak & Longevity'
  },

  // 🌟 Legendary / Rare Badges
  {
    id: 'legendary-perfect-game',
    title: 'Perfect Game',
    description: 'No turnovers, 100% FG, 10+ attempts',
    category: 'legendary',
    rarity: 'legendary',
    icon: '🌟',
    type: 'Legendary',
    requirements: 'No turnovers, 100% field goal percentage with 10+ attempts',
    badge: 'Legendary / Rare'
  },
  {
    id: 'legendary-game-winner',
    title: 'Game Winner',
    description: 'Hit a buzzer beater to win',
    category: 'legendary',
    rarity: 'legendary',
    icon: '🌟',
    type: 'Legendary',
    requirements: 'Make a buzzer-beating shot to win the game',
    badge: 'Legendary / Rare'
  },
  {
    id: 'legendary-carry-job',
    title: 'Carry Job',
    description: '50+ points, more than half of team\'s total',
    category: 'legendary',
    rarity: 'legendary',
    icon: '🌟',
    type: 'Legendary',
    requirements: '50+ points representing more than half of team\'s total',
    badge: 'Legendary / Rare'
  },
  {
    id: 'legendary-underdog-upset',
    title: 'Underdog Upset',
    description: 'Beat a higher-seeded team with 30+ points',
    category: 'legendary',
    rarity: 'legendary',
    icon: '🌟',
    type: 'Legendary',
    requirements: 'Score 30+ points while beating a higher-seeded team',
    badge: 'Legendary / Rare'
  }
];

