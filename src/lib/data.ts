import petsData from '@/data/pets.json';
import codesData from '@/data/codes.json';
import dumbbellsData from '@/data/dumbbells.json';
import worldsData from '@/data/worlds.json';
import configData from '@/data/game.config.json';

export interface Pet {
  id: string; slug: string; name: string;
  rarity: string; tier: string; eggSource: string;
  hatchChance: number; muscleBonus: number; winBonus: number;
  description: string; tags: string[];
}
export interface Code {
  code: string; reward: string; source: string;
  addedDate: string; status: 'active' | 'expired'; isNew?: boolean;
}
export interface Dumbbell {
  id: string; name: string; tier: number; musclePerStep: number;
  cost: number; currency: string; description: string; tags: string[];
}
export interface Opponent {
  id: string; name: string; slug: string; muscleRequired: number;
  winsReward: number; difficulty: string; description: string;
}
export interface World {
  id: string; name: string; slug: string; order: number;
  unlockRequirement: string; description: string; opponents: Opponent[];
}
export interface GameConfig {
  game: { name: string; robloxId: string; developer: string; genre: string; currentVersion: string; lastUpdated: string; updateSchedule: string; platforms: string[]; };
  stats: { visits: string; favorites: string; likes: string; onlineNow: string; serverSize: number; active: boolean; };
  seo: { siteTitle: string; siteDescription: string; baseUrl: string; primaryKeywords: string[]; secondaryKeywords: string[]; defaultOgImage: string; };
  routes: { path: string; title: string; priority: string }[];
  calculator: { type: string; dataFile: string; };
}

const pets: Pet[] = (petsData as { pets: Pet[] }).pets;
const codes: Code[] = (codesData as { codes: Code[] }).codes;
const dumbbells: Dumbbell[] = (dumbbellsData as { dumbbells: Dumbbell[] }).dumbbells;
const worlds: World[] = (worldsData as { worlds: World[] }).worlds;
const config: GameConfig = configData as GameConfig;

export const getGameConfig = () => config;
export const getPets = () => pets;
export const getPetBySlug = (slug: string) => pets.find(p => p.slug === slug);
export const getCodes = (status?: string) => status ? codes.filter(c => c.status === status) : codes;
export const getActiveCodes = () => codes.filter(c => c.status === 'active');
export const getExpiredCodes = () => codes.filter(c => c.status === 'expired');
export const getDumbbells = () => dumbbells;
export const getWorlds = () => worlds.sort((a, b) => a.order - b.order);
export const getWorldBySlug = (slug: string) => worlds.find(w => w.slug === slug);
export const getRebirthTiers = () => [
  { level: 0, muscleMultiplier: 1, winMultiplier: 1, muscleCost: '0' },
  { level: 1, muscleMultiplier: 1.5, winMultiplier: 1.2, muscleCost: '10K' },
  { level: 2, muscleMultiplier: 2, winMultiplier: 1.5, muscleCost: '500K' },
  { level: 3, muscleMultiplier: 3, winMultiplier: 1.8, muscleCost: '5M' },
  { level: 5, muscleMultiplier: 5, winMultiplier: 2, muscleCost: '50M' },
  { level: 7, muscleMultiplier: 10, winMultiplier: 3, muscleCost: '500M' },
  { level: 10, muscleMultiplier: 15, winMultiplier: 4, muscleCost: '5B' },
  { level: 15, muscleMultiplier: 100, winMultiplier: 10, muscleCost: '500B' },
  { level: 17, muscleMultiplier: 200, winMultiplier: 20, muscleCost: '5T' },
];

export function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Q';
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = config.seo.baseUrl;
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${baseUrl}${item.url}` })) };
}

export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })) };
}

export function generateVideoGameSchema() {
  return { '@context': 'https://schema.org', '@type': 'VideoGame', name: config.game.name, description: config.seo.siteDescription, genre: config.game.genre, url: `https://www.roblox.com/games/${config.game.robloxId}`, operatingSystem: config.game.platforms.join(', '), author: { '@type': 'Organization', name: config.game.developer } };
}

export function getCurrentDateString() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
