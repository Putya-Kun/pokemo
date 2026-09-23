import React from 'react';
import { CardData, PokemonCardData, PokemonStage, PokemonType, TrainerCardData, TrainerCategory } from '../../types';
import { STAGE_OPTIONS, TRAINER_CATEGORY_CONFIG, TYPE_CONFIG } from '../../constants/cardData';
import { EnergyIcon } from '../EnergyIcon';
import { User, Sparkles, Wand2 } from 'lucide-react';

interface BasicInfoEditorProps {
  card: CardData;
  onUpdate: (updated: Partial<CardData>) => void;
  onSwitchKind: (kind: 'pokemon' | 'trainer') => void;
}

export const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({
  card,
  onUpdate,
  onSwitchKind,
}) => {
  const isPokemon = card.kind === 'pokemon';
  const pokemonCard = card as PokemonCardData;
  const trainerCard = card as TrainerCardData;

  const pokemonTypes: PokemonType[] = [
    'grass',
    'fire',
    'water',
    'lightning',
    'psychic',
    'fighting',
    'darkness',
    'metal',
    'dragon',
    'fairy',
    'colorless',
  ];

  const trainerCategories: TrainerCategory[] = [
    'supporter',
    'item',
    'stadium',
    'tool',
    'ace_spec',
  ];

  return (
    <div className="space-y-4">
      {/* CARD KIND SELECTOR (キャラクター / トレーナー) */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1.5">
          カードの種類 (レイアウト切替)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSwitchKind('pokemon')}
            className={`h-11 flex items-center justify-center gap-2 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
              isPokemon
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>キャラクター (ポケモン)</span>
          </button>
          <button
            type="button"
            onClick={() => onSwitchKind('trainer')}
            className={`h-11 flex items-center justify-center gap-2 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
              !isPokemon
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md ring-1 ring-sky-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>トレーナーズ (グッズ/サポート等)</span>
          </button>
        </div>
      </div>

      {/* POKEMON SPECIFIC FIELDS */}
      {isPokemon ? (
        <>
          {/* Card Name & Suffix */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                キャラクター名
              </label>
              <input
                type="text"
                value={pokemonCard.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="例: ピカチュウ, リザードン"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                サブキャラクター名
              </label>
              <input
                type="text"
                value={pokemonCard.suffix}
                onChange={(e) => onUpdate({ suffix: e.target.value })}
                placeholder="例: アローラ, パルデア, かがやく"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Primary Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              タイプ (属性)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {pokemonTypes.map((pType) => {
                const meta = TYPE_CONFIG[pType];
                const isSelected = pokemonCard.primaryType === pType;
                return (
                  <button
                    key={pType}
                    type="button"
                    onClick={() => onUpdate({ primaryType: pType })}
                    className={`h-9 flex items-center justify-center gap-1.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-slate-700/90 text-white shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                        : 'border-slate-700/80 bg-slate-800/70 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                    }`}
                  >
                    <EnergyIcon type={pType} size="sm" />
                    <span>{meta.jpName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evolution Stage (たね / 1進化 / 2進化) */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              進化段階 (ステージ)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STAGE_OPTIONS.map((stg) => {
                const isSelected = pokemonCard.stage === stg;
                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => onUpdate({ stage: stg })}
                    className={`h-10 flex items-center justify-center px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pokedex Sub-Info */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              図鑑・ステータス詳細
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  図鑑番号
                </label>
                <input
                  type="text"
                  value={pokemonCard.dexNumber}
                  onChange={(e) => onUpdate({ dexNumber: e.target.value })}
                  placeholder="NO. 0025"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  分類
                </label>
                <input
                  type="text"
                  value={pokemonCard.dexSpecies}
                  onChange={(e) => onUpdate({ dexSpecies: e.target.value })}
                  placeholder="ねずみポケモン"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    高さ
                  </label>
                  <input
                    type="text"
                    value={pokemonCard.dexHeight}
                    onChange={(e) => onUpdate({ dexHeight: e.target.value })}
                    placeholder="0.4m"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    重さ
                  </label>
                  <input
                    type="text"
                    value={pokemonCard.dexWeight}
                    onChange={(e) => onUpdate({ dexWeight: e.target.value })}
                    placeholder="6.0kg"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* TRAINER SPECIFIC FIELDS */
        <>
          {/* Trainer Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              トレーナーズ カテゴリ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {trainerCategories.map((cat) => {
                const conf = TRAINER_CATEGORY_CONFIG[cat];
                const isSelected = trainerCard.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onUpdate({
                        category: cat,
                        ruleText: conf.defaultRule,
                      });
                    }}
                    className={`h-16 p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-sky-400 bg-slate-700 text-white shadow-md ring-2 ring-sky-400/50'
                        : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white leading-none shadow-xs"
                      style={{ backgroundColor: conf.bannerColor }}
                    >
                      {conf.jpName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono leading-none">
                      {conf.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trainer Name & Custom Tag */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                カード名
              </label>
              <input
                type="text"
                value={trainerCard.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="例: ナンジャモ, ふしぎなアメ"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                特別タグ (任意)
              </label>
              <input
                type="text"
                value={trainerCard.customCardTag || ''}
                onChange={(e) => onUpdate({ customCardTag: e.target.value })}
                placeholder="ACE SPEC, 古代"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Full Art Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                フルアート仕様 (イラスト大画面)
              </span>
              <span className="text-[11px] text-slate-400">
                SR/SARカードのようにイラストエリアを縦長に拡大します
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdate({ isFullArt: !trainerCard.isFullArt })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                trainerCard.isFullArt ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  trainerCard.isFullArt ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
