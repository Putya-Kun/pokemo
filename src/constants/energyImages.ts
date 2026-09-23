import { PokemonType } from '../types';

// Energy icon image paths located in assets/eneicon/
export const ENERGY_IMAGE_URLS: Record<PokemonType, string> = {
  fairy: '/assets/eneicon/fairy.png',
  fire: '/assets/eneicon/fire.png',
  grass: '/assets/eneicon/grass.png',
  fighting: '/assets/eneicon/fighting.png',
  metal: '/assets/eneicon/steel.png',
  darkness: '/assets/eneicon/dark.png',
  dragon: '/assets/eneicon/dragon.png',
  psychic: '/assets/eneicon/psychic.png',
  colorless: '/assets/eneicon/normal.png',
  lightning: '/assets/eneicon/electric.png',
  water: '/assets/eneicon/water.png',
};

// Type background textures from assets/back/
export const TYPE_BACKGROUND_TEXTURES: Partial<Record<PokemonType, string>> = {
  grass: '/assets/back/basic-grass.png',
  fire: '/assets/back/basic-fire.png',
  water: '/assets/back/basic-water.png',
  lightning: '/assets/back/basic-electric.png',
  psychic: '/assets/back/basic-psychic.png',
  fighting: '/assets/back/basic-fighting.png',
  darkness: '/assets/back/basic-dark.png',
  metal: '/assets/back/basic-steel.png',
  dragon: '/assets/back/basic-dragon.png',
  colorless: '/assets/back/basic-normal.png',
};

// Trainer card background textures from assets/back/
export const TRAINER_BACKGROUND_TEXTURES: Record<string, string> = {
  item: '/assets/back/trainer-supporter.png',
  supporter: '/assets/back/trainer-supporter.png',
  stadium: '/assets/back/trainer-supporter.png',
  tool: '/assets/back/trainer-supporter.png',
  ace_spec: '/assets/back/trainer-supporter.png',
  trainer: '/assets/back/trainer-supporter.png',
};

// Frame borders from assets/frame/
export const FRAME_TEXTURES: Record<string, string> = {
  normal: '/assets/frame/ノーマル.png',
  rare: '/assets/frame/レア.png',
  pearl: '/assets/frame/パール.png',
  gold: '/assets/frame/金.png',
  red: '/assets/frame/赤.png',
  blue: '/assets/frame/青.png',
  green: '/assets/frame/緑.png',
  yellow: '/assets/frame/黄色.png',
  purple: '/assets/frame/紫.png',
};

export interface FrameOption {
  id: string;
  name: string;
  url: string;
  colorPreview: string;
  description: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'none',
    name: 'なし (標準枠)',
    url: '',
    colorPreview: '#475569',
    description: 'テクスチャフレームなし',
  },
  {
    id: 'normal',
    name: 'ノーマル',
    url: '/assets/frame/ノーマル.png',
    colorPreview: '#94a3b8',
    description: '標準的なシルバー枠',
  },
  {
    id: 'rare',
    name: 'レア',
    url: '/assets/frame/レア.png',
    colorPreview: '#38bdf8',
    description: '鮮やかなレア装飾フレーム',
  },
  {
    id: 'gold',
    name: '金 (ゴールド)',
    url: '/assets/frame/金.png',
    colorPreview: '#eab308',
    description: '豪華なゴールド金箔フレーム',
  },
  {
    id: 'pearl',
    name: 'パール',
    url: '/assets/frame/パール.png',
    colorPreview: '#f472b6',
    description: '真珠光沢の上品なフレーム',
  },
  {
    id: 'red',
    name: '赤 (レッド)',
    url: '/assets/frame/赤.png',
    colorPreview: '#ef4444',
    description: '炎・情熱の赤フレーム',
  },
  {
    id: 'blue',
    name: '青 (ブルー)',
    url: '/assets/frame/青.png',
    colorPreview: '#3b82f6',
    description: '水・深海の青フレーム',
  },
  {
    id: 'green',
    name: '緑 (グリーン)',
    url: '/assets/frame/緑.png',
    colorPreview: '#22c55e',
    description: '草・自然の緑フレーム',
  },
  {
    id: 'yellow',
    name: '黄色 (イエロー)',
    url: '/assets/frame/黄色.png',
    colorPreview: '#facc15',
    description: '雷・輝きの黄色フレーム',
  },
  {
    id: 'purple',
    name: '紫 (パープル)',
    url: '/assets/frame/紫.png',
    colorPreview: '#a855f7',
    description: '超・神秘の紫フレーム',
  },
];

export const getFrameUrl = (frameId?: string, defaultType?: PokemonType): string => {
  if (!frameId || frameId === 'none') {
    return '';
  }
  if (FRAME_TEXTURES[frameId]) {
    return FRAME_TEXTURES[frameId];
  }
  return '';
};
