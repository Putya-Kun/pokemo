import { PokemonType } from '../types';

// Energy icon image paths located in assets/eneicon/
export const ENERGY_IMAGE_URLS: Record<PokemonType, string> = {
  fairy: 'assets/eneicon/fairy.png',
  fire: 'assets/eneicon/fire.png',
  grass: 'assets/eneicon/grass.png',
  fighting: 'assets/eneicon/fighting.png',
  metal: 'assets/eneicon/steel.png',
  darkness: 'assets/eneicon/dark.png',
  dragon: 'assets/eneicon/dragon.png',
  psychic: 'assets/eneicon/psychic.png',
  colorless: 'assets/eneicon/normal.png',
  lightning: 'assets/eneicon/electric.png',
  water: 'assets/eneicon/water.png',
};

// Type background textures from assets/back/
export const TYPE_BACKGROUND_TEXTURES: Partial<Record<PokemonType, string>> = {
  grass: 'assets/back/basic-grass.png',
  fire: 'assets/back/basic-fire.png',
  water: 'assets/back/basic-water.png',
  lightning: 'assets/back/basic-electric.png',
  psychic: 'assets/back/basic-psychic.png',
  fighting: 'assets/back/basic-fighting.png',
  darkness: 'assets/back/basic-dark.png',
  metal: 'assets/back/basic-steel.png',
  dragon: 'assets/back/basic-dragon.png',
  colorless: 'assets/back/basic-normal.png',
};

// Normal EX background textures from assets/back/exback/
export interface ExBackgroundTextures {
  transparent: string;
  empty: string;
}

export const TYPE_EX_BACKGROUND_TEXTURES: Partial<Record<PokemonType, ExBackgroundTextures>> = {
  grass: {
    transparent: 'assets/back/exback/transparent-grass.webp',
    empty: 'assets/back/exback/basic-ex-grass-empty.webp',
  },
  fire: {
    transparent: 'assets/back/exback/transparent-fire.webp',
    empty: 'assets/back/exback/basic-ex-fire-empty.webp',
  },
  water: {
    transparent: 'assets/back/exback/transparent-water.webp',
    empty: 'assets/back/exback/basic-ex-water-empty.webp',
  },
  lightning: {
    transparent: 'assets/back/exback/transparent-electric.webp',
    empty: 'assets/back/exback/basic-ex-electric-empty.webp',
  },
  psychic: {
    transparent: 'assets/back/exback/transparent-psychic.webp',
    empty: 'assets/back/exback/basic-ex-psychic-empty.webp',
  },
  fighting: {
    transparent: 'assets/back/exback/transparent-fighting.webp',
    empty: 'assets/back/exback/basic-ex-fighting-empty.webp',
  },
  darkness: {
    transparent: 'assets/back/exback/transparent-dark.webp',
    empty: 'assets/back/exback/basic-ex-dark-empty.webp',
  },
  metal: {
    transparent: 'assets/back/exback/transparent-steel.webp',
    empty: 'assets/back/exback/basic-ex-steel-empty.webp',
  },
  dragon: {
    transparent: 'assets/back/exback/transparent-dragon.webp',
    empty: 'assets/back/exback/basic-ex-dragon-empty.webp',
  },
  colorless: {
    transparent: 'assets/back/exback/transparent-normal.webp',
    empty: 'assets/back/exback/basic-ex-normal-empty.webp',
  },
  fairy: {
    transparent: 'assets/back/exback/transparent-psychic.webp',
    empty: 'assets/back/exback/basic-ex-psychic-empty.webp',
  },
};

// Trainer card background textures from assets/back/
export const TRAINER_BACKGROUND_TEXTURES: Record<string, string> = {
  item: 'assets/back/trainer-item.png',
  supporter: 'assets/back/trainer-supporter.png',
  stadium: 'assets/back/trainer-stadium.png',
  tool: 'assets/back/trainer-pokedougu.png',
  trainer: 'assets/back/trainer-supporter.png',
};

// Trainer card category badge icons from assets/other/
export const TRAINER_CATEGORY_ICONS: Record<string, string> = {
  supporter: 'assets/other/support.png',
  item: 'assets/other/goods.png',
  stadium: 'assets/other/studium.png',
  tool: 'assets/other/pokedougu.png',
};

// Frame borders from assets/frame/
export const FRAME_TEXTURES: Record<string, string> = {
  normal: 'assets/frame/ノーマル.png',
  rare: 'assets/frame/レア.png',
  pearl: 'assets/frame/パール.png',
  gold: 'assets/frame/金.png',
  red: 'assets/frame/赤.png',
  blue: 'assets/frame/青.png',
  green: 'assets/frame/緑.png',
  yellow: 'assets/frame/黄色.png',
  purple: 'assets/frame/紫.png',
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
    id: 'normal',
    name: 'ノーマル',
    url: 'assets/frame/ノーマル.png',
    colorPreview: '#94a3b8',
    description: '標準的なシルバー枠',
  },
  {
    id: 'rare',
    name: 'レア',
    url: 'assets/frame/レア.png',
    colorPreview: '#38bdf8',
    description: '鮮やかなレア装飾フレーム',
  },
  {
    id: 'gold',
    name: '金 (ゴールド)',
    url: 'assets/frame/金.png',
    colorPreview: '#eab308',
    description: '豪華なゴールド金箔フレーム',
  },
  {
    id: 'pearl',
    name: 'パール',
    url: 'assets/frame/パール.png',
    colorPreview: '#f472b6',
    description: '真珠光沢の上品なフレーム',
  },
  {
    id: 'red',
    name: '赤 (レッド)',
    url: 'assets/frame/赤.png',
    colorPreview: '#ef4444',
    description: '炎・情熱の赤フレーム',
  },
  {
    id: 'blue',
    name: '青 (ブルー)',
    url: 'assets/frame/青.png',
    colorPreview: '#3b82f6',
    description: '水・深海の青フレーム',
  },
  {
    id: 'green',
    name: '緑 (グリーン)',
    url: 'assets/frame/緑.png',
    colorPreview: '#22c55e',
    description: '草・自然の緑フレーム',
  },
  {
    id: 'yellow',
    name: '黄色 (イエロー)',
    url: 'assets/frame/黄色.png',
    colorPreview: '#facc15',
    description: '雷・輝きの黄色フレーム',
  },
  {
    id: 'purple',
    name: '紫 (パープル)',
    url: 'assets/frame/紫.png',
    colorPreview: '#a855f7',
    description: '超・神秘の紫フレーム',
  },
];

export const getFrameUrl = (frameId?: string): string => {
  if (frameId === 'none') {
    return '';
  }
  const targetId = frameId || 'normal';
  if (FRAME_TEXTURES[targetId]) {
    return encodeURI(FRAME_TEXTURES[targetId]);
  }
  return encodeURI(FRAME_TEXTURES.normal || '');
};

// -------------------------------------------------------------------------
// 【キャラクター名右横のアイコン (ex / GX / V / VMAX / VSTAR / LV.X など)】
// assets/exicon/ 配下のアイコン一覧
// -------------------------------------------------------------------------
export interface ExIconOption {
  id: string;
  name: string;
  url: string;
}

export const EX_ICON_OPTIONS: ExIconOption[] = [
  { id: 'sv-ex', name: 'ex (SV)', url: 'assets/exicon/icon-ex-sv.webp' },
  { id: 'tera-ex', name: 'ex (テラスタル)', url: 'assets/exicon/icon-ex-tera.webp' },
  { id: 'black-yellow-ex', name: 'ex (黒/黄)', url: 'assets/exicon/icon-ex-black-yellow.webp' },
  { id: 'blue-ex', name: 'ex (青)', url: 'assets/exicon/icon-ex-blue.webp' },
  { id: 'green-ex', name: 'ex (緑)', url: 'assets/exicon/icon-ex-green.webp' },
  { id: 'pearl-ex', name: 'ex (パール)', url: 'assets/exicon/icon-ex-pearl.webp' },
  { id: 'red-ex', name: 'ex (赤)', url: 'assets/exicon/icon-ex-red.webp' },
  { id: 'yellow-ex', name: 'ex (黄)', url: 'assets/exicon/icon-ex-yellow.webp' },
  { id: 'mega-ex', name: 'M進化 (MEGA)', url: 'assets/exicon/icon-ex-mega.webp' },
  { id: 'tcg-ex', name: 'EX (TCG)', url: 'assets/exicon/icon-tcg-ex.webp' },
  { id: 'tcg-ex-white', name: 'EX (白)', url: 'assets/exicon/icon-tcg-ex-white.webp' },
  { id: 'ss-ex', name: 'EX (SS)', url: 'assets/exicon/icon-ss-ex.webp' },
  { id: 'gx', name: 'GX', url: 'assets/exicon/icon-gx.webp' },
  { id: 'gx-tag-team', name: 'GX TAG TEAM', url: 'assets/exicon/icon-gx-tag-team.webp' },
  { id: 'gx-ultra-beast', name: 'GX UB', url: 'assets/exicon/icon-gx-ultra-beast.webp' },
  { id: 'gx-ultra-beast-tag-team', name: 'GX UB TAG TEAM', url: 'assets/exicon/icon-gx-ultra-beast-tag-team.webp' },
  { id: 'v', name: 'V', url: 'assets/exicon/icon-v.webp' },
  { id: 'vmax', name: 'VMAX', url: 'assets/exicon/icon-vmax.webp' },
  { id: 'vstar', name: 'VSTAR', url: 'assets/exicon/icon-vstar.webp' },
  { id: 'lvx', name: 'LV.X', url: 'assets/exicon/icon-lvx.webp' },
  { id: 'gold-star', name: '☆ (ゴールドスター)', url: 'assets/exicon/icon-gold-star.webp' },
];

