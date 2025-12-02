import { Challenge, FeedItem, User, ChallengeCategory } from '../types';

const STORAGE_KEY_USER = 'todok_user';
const STORAGE_KEY_CHALLENGES = 'todok_challenges';
const STORAGE_KEY_FEED = 'todok_feed';

const DEFAULT_USER: User = {
  isOnboarded: false,
  xp: 0,
  level: 1,
  isRestMode: false,
  streak: 0,
  lastActiveDate: '',
};

export const db = {
  getUser: (): User => {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : DEFAULT_USER;
  },

  updateUser: (updates: Partial<User>) => {
    const current = db.getUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  },

  getChallenges: (): Challenge[] => {
    const data = localStorage.getItem(STORAGE_KEY_CHALLENGES);
    return data ? JSON.parse(data) : [];
  },

  addChallenge: (challenge: Challenge) => {
    const list = db.getChallenges();
    const updated = [challenge, ...list];
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(updated));
    return updated;
  },

  updateChallenge: (id: string, updates: Partial<Challenge>) => {
    const list = db.getChallenges();
    const updated = list.map(c => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(updated));
    return updated;
  },

  // Mock Feed - In a real app this would come from a backend
  getFeed: (): FeedItem[] => {
    const data = localStorage.getItem(STORAGE_KEY_FEED);
    const myFeed = data ? JSON.parse(data) : [];
    
    // Generate some fake "others" activity for the demo social feel
    const fakeFeed: FeedItem[] = [
        { id: 'f1', challengeTitle: '따뜻한 차 마시기', category: ChallengeCategory.POSITIVITY, timestamp: Date.now() - 100000, cheers: 3, isMine: false },
        { id: 'f2', challengeTitle: '책 2페이지 읽기', category: ChallengeCategory.LEARNING, timestamp: Date.now() - 500000, cheers: 12, isMine: false },
        { id: 'f3', challengeTitle: '창문 열고 환기', category: ChallengeCategory.POSITIVITY, timestamp: Date.now() - 1200000, cheers: 5, isMine: false },
    ];
    
    // Sort by time
    return [...myFeed, ...fakeFeed].sort((a, b) => b.timestamp - a.timestamp);
  },

  addToFeed: (item: FeedItem) => {
      const data = localStorage.getItem(STORAGE_KEY_FEED);
      const list = data ? JSON.parse(data) : [];
      const updated = [item, ...list];
      localStorage.setItem(STORAGE_KEY_FEED, JSON.stringify(updated));
  },
  
  cheerPost: (id: string) => {
     // Mocking cheering on a post (local only since no backend)
     console.log(`Cheered for ${id}`);
  },

  unCheerPost: (id: string) => {
    console.log(`Un-cheered for ${id}`);
  }
};