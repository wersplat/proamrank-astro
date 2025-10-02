export type AchievementCategory = 
  | 'scoring' 
  | 'assists' 
  | 'defense' 
  | 'rebounding' 
  | 'mixed' 
  | 'streak' 
  | 'legendary';

export type AchievementRarity = 
  | 'common' 
  | 'rare' 
  | 'epic' 
  | 'legendary';

export type AchievementType = 
  | 'Career Milestone' 
  | 'Single Game' 
  | 'Efficiency' 
  | 'Season' 
  | 'Streak' 
  | 'Longevity' 
  | 'Mixed Stats' 
  | 'Legendary'
  | 'Steals'
  | 'Blocks'
  | 'Lockdown';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  type: AchievementType;
  requirements: string;
  badge: string;
}

export interface AchievementFilters {
  search?: string;
  category?: string;
  rarity?: string;
  view?: 'grid' | 'list';
}

