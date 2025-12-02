export enum ChallengeCategory {
  POSITIVITY = 'POSITIVITY',
  LEARNING = 'LEARNING',
  CONNECTION = 'CONNECTION',
}

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  xpReward: number;
  completed: boolean;
  completedAt?: number; // timestamp
  reflection?: string;
}

export interface User {
  isOnboarded: boolean;
  xp: number;
  level: number;
  isRestMode: boolean;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface FeedItem {
  id: string;
  challengeTitle: string;
  category: ChallengeCategory;
  timestamp: number;
  cheers: number;
  isMine: boolean;
}

export const LEVELS = [
  { level: 1, minXp: 0, title: "새싹" },
  { level: 2, minXp: 100, title: "떡잎" },
  { level: 3, minXp: 300, title: "묘목" },
  { level: 4, minXp: 600, title: "작은 나무" },
  { level: 5, minXp: 1000, title: "큰 나무" },
];

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  [ChallengeCategory.POSITIVITY]: '적극성',
  [ChallengeCategory.LEARNING]: '배움',
  [ChallengeCategory.CONNECTION]: '교류',
};

export const CATEGORY_COLORS: Record<ChallengeCategory, string> = {
  [ChallengeCategory.POSITIVITY]: 'bg-rose-100 text-rose-700 border-rose-200',
  [ChallengeCategory.LEARNING]: 'bg-sky-100 text-sky-700 border-sky-200',
  [ChallengeCategory.CONNECTION]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};