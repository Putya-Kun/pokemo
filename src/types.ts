export type CardKind = 'pokemon' | 'trainer';

export type PokemonType =
  | 'grass'
  | 'fire'
  | 'water'
  | 'lightning'
  | 'psychic'
  | 'fighting'
  | 'darkness'
  | 'metal'
  | 'dragon'
  | 'fairy'
  | 'colorless';

export type PokemonStage = 'たね' | '1進化' | '2進化';

export type PokemonCardStyle = 'normal' | 'normal_ex' | 'fullart' | 'fullart_ex';

export type TrainerCategory =
  | 'item' // グッズ
  | 'supporter' // サポート
  | 'stadium' // スタジアム
  | 'tool' // ポケモンのどうぐ
  | 'ace_spec'; // ACE SPEC

export type CardRarity = 'C' | 'U' | 'R' | 'RR' | 'AR' | 'SR' | 'SAR' | 'UR' | 'PROMO';

export type FoilEffect = 'none' | 'holo' | 'rainbow' | 'gold' | 'sparkle' | 'tera' | 'dark';

export type MoveTheme = 'standard' | 'elemental' | 'burst' | 'aura' | 'cosmic' | 'gilded';

export interface Move {
  id: string;
  name: string;
  energyCost: PokemonType[];
  damage: string; // e.g. "30", "120+", "50×", "250"
  description: string;
  theme: MoveTheme;
  isSpecialMove?: boolean; // ex / GX / 特大わざ
  specialTag?: string; // e.g. "テラスわざ", "VSTARパワー", "GXわざ", "必殺わざ"
}

export interface Ability {
  enabled: boolean;
  name: string;
  type: 'ability' | 'ancient_trait' | 'vstar_power'; // 特性 / 古代能力 / VSTARパワー
  description: string;
  titleOffsetY?: number; // 特性タイトルの上下位置オフセット (px, マイナスで上移動)
  descOffsetY?: number;  // 特性詳細テキストの上下位置オフセット (px, マイナスで上移動)
  titleOffsetX?: number; // 特性タイトルの左右位置オフセット (px)
}

export interface PokemonCardData {
  kind: 'pokemon';
  id: string;
  name: string;
  suffix: string; // e.g., "ex", "V", "VMAX", "かがやく"
  hp: string;
  primaryType: PokemonType;
  secondaryType?: PokemonType;
  stage: PokemonStage;
  cardStyle?: PokemonCardStyle;
  evolvesFrom?: string; // e.g. "ピカチュウから進化"
  nameIcon?: string; // e.g. "assets/exicon/icon-ex-sv.webp"
  dexSpecies: string; // e.g. "ねずみポケモン"
  dexHeight: string; // e.g. "0.4m"
  dexWeight: string; // e.g. "6.0kg"
  dexNumber: string; // e.g. "NO. 0025"
  
  imageUrl: string;
  imageScale: number; // 1 to 2
  imagePositionX: number; // -50 to 50
  imagePositionY: number; // -50 to 50
  imageFit: 'cover' | 'contain';
  
  ability: Ability;
  moves: Move[];
  
  weaknessType: PokemonType | 'none';
  weaknessValue: string; // "×2"
  resistanceType: PokemonType | 'none';
  resistanceValue: string; // "-30"
  retreatCost: number; // 0 to 4
  
  flavorText: string;
  illustrator: string;
  cardNumber: string; // e.g. "025/190"
  setSymbol: string; // e.g. "SV4a"
  regulationMark: string; // e.g. "H"
  rarity: CardRarity;
  
  foilEffect?: FoilEffect;
  selectedFrame?: string; // id from FRAME_OPTIONS e.g. 'normal', 'rare', 'gold', etc.
  frameAccentColor?: string;
  customCardTag?: string;

  // Custom positioning & scale adjustments
  titleOffsetX?: number; // Title starting position X offset
  moveNameSize?: number; // Scale for move name font size
  energyIconScale?: number; // Scale for energy icons in moves
  move1OffsetY?: number; // Y offset when 1 move is present
  move2OffsetY?: number; // Y offset when 2 moves are present
}

export interface TrainerCardData {
  kind: 'trainer';
  id: string;
  name: string;
  category: TrainerCategory;
  categorySubtext?: string;
  
  imageUrl: string;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  imageFit: 'cover' | 'contain';
  isFullArt: boolean;
  
  ruleText: string; // e.g. "サポートは、自分の番に1枚しか使えない。"
  effectText: string;
  subEffectText?: string;
  
  illustrator: string;
  cardNumber: string;
  setSymbol: string;
  regulationMark: string;
  rarity: CardRarity;
  
  foilEffect?: FoilEffect;
  selectedFrame?: string;
  customCardTag?: string;

  // Custom positioning & scale adjustments
  titleOffsetX?: number;
}

export type CardData = PokemonCardData | TrainerCardData;
