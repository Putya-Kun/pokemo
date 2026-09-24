import React from 'react';
import { CardData, PokemonCardData, PokemonStage, PokemonType, TrainerCardData, TrainerCategory, PokemonCardStyle } from '../../types';
import { STAGE_OPTIONS, CARD_STYLE_OPTIONS, TRAINER_CATEGORY_CONFIG, TYPE_CONFIG } from '../../constants/cardData';
import { TRAINER_CATEGORY_ICONS, EX_ICON_OPTIONS } from '../../constants/energyImages';
import { EnergyIcon } from '../EnergyIcon';
import { User, Sparkles, Wand2, ShieldCheck, X } from 'lucide-react';

// =========================================================================
// 【カテゴリ選択ボタンの画像・サイズ設定 (コードから微調整可能)】
// =========================================================================
export const CATEGORY_BUTTON_CONFIG = {
  IMAGE_MAX_HEIGHT: 34,       // ボタン内アイコン画像の最大の高さ (px)
  IMAGE_MAX_WIDTH: 76,        // ボタン内アイコン画像の最大の横幅 (px)
  IMAGE_SCALE: 1.0,           // ボタン内アイコン画像の拡大倍率 (例: 0.95 や 1.1)
  SHOW_CATEGORY_SUBTEXT: true, // 画像の下に英語名（Item, Supporter等）を表示するか (true / false)
};

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
  ];

  return (
    <div className="space-y-4">
      {/* CARD KIND SELECTOR (キャラクター / トレーナー) */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1.5">
          カードの種類 (レイアウト切替)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSwitchKind('pokemon')}
            className={`min-h-[46px] py-2 px-2.5 flex items-center justify-center gap-2 rounded-xl border-2 transition-all text-center ${
              isPokemon
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="flex flex-col items-center justify-center leading-tight">
              <span className="font-bold text-xs">ポケモン</span>
              <span className="text-[9.5px] font-normal opacity-80">キャラクター</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSwitchKind('trainer')}
            className={`min-h-[46px] py-2 px-2.5 flex items-center justify-center gap-2 rounded-xl border-2 transition-all text-center ${
              !isPokemon
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md ring-1 ring-sky-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <div className="flex flex-col items-center justify-center leading-tight">
              <span className="font-bold text-xs">トレーナーズ</span>
              <span className="text-[9.5px] font-normal opacity-80">グッズ・サポート等</span>
            </div>
          </button>
        </div>
      </div>

      {/* POKEMON SPECIFIC FIELDS */}
      {isPokemon ? (
        <>
          {/* Card Name & Suffix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2">
            <div className="sm:col-span-2">
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
              <label className="text-xs font-bold text-slate-300 block mb-1 truncate" title="サブキャラクター名">
                サブキャラクター名
              </label>
              <input
                type="text"
                value={pokemonCard.suffix}
                onChange={(e) => onUpdate({ suffix: e.target.value })}
                placeholder="例: アローラ, かがやく"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Primary Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              タイプ (属性)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2">
              {pokemonTypes.map((pType) => {
                const meta = TYPE_CONFIG[pType];
                const isSelected = pokemonCard.primaryType === pType;
                return (
                  <button
                    key={pType}
                    type="button"
                    onClick={() => onUpdate({ primaryType: pType })}
                    className={`h-9 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 rounded-xl border text-[11.5px] sm:text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-slate-700/90 text-white shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                        : 'border-slate-700/80 bg-slate-800/70 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                    }`}
                  >
                    <EnergyIcon type={pType} size="sm" />
                    <span className="whitespace-nowrap tracking-tight">{meta.jpName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Right Icon Selector (assets/exicon/) */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 block">
                アイコン (キャラ名の右側に配置)
              </label>
              {pokemonCard.nameIcon && (
                <button
                  type="button"
                  onClick={() => onUpdate({ nameIcon: '' })}
                  className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700"
                >
                  <X className="w-2.5 h-2.5" />
                  選択解除
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {/* なしボタン */}
              <button
                type="button"
                onClick={() => onUpdate({ nameIcon: '' })}
                className={`p-1.5 rounded-lg border text-center transition-all flex items-center justify-center min-h-[38px] ${
                  !pokemonCard.nameIcon
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40'
                    : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold">なし</span>
              </button>

              {/* 20種のアイコンボタン */}
              {EX_ICON_OPTIONS.map((opt) => {
                const isSelected = pokemonCard.nameIcon === opt.url;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdate({ nameIcon: isSelected ? '' : opt.url })}
                    className={`p-1.5 rounded-lg border transition-all flex items-center justify-center min-h-[38px] relative group ${
                      isSelected
                        ? 'border-amber-400 bg-slate-800 text-amber-300 ring-2 ring-amber-400/40 shadow-sm'
                        : 'border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                    title={opt.name}
                  >
                    <div className="h-5 flex items-center justify-center w-full px-1">
                      <img
                        src={encodeURI(opt.url)}
                        alt={opt.name}
                        className="max-h-5 max-w-full object-contain pointer-events-none group-hover:scale-110 transition-transform"
                        loading="lazy"
                      />
                    </div>
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

            {/* 進化前ポケモン名の入力欄（1進化・2進化のみ表示） */}
            {pokemonCard.stage !== 'たね' && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300">
                    進化前のポケモン名
                  </label>
                  <span className="text-[10px] text-slate-400">
                    ※カード上には「〇〇から進化」と表示されます
                  </span>
                </div>
                <input
                  type="text"
                  value={pokemonCard.evolvesFrom ? pokemonCard.evolvesFrom.replace(/から進化$/, '') : ''}
                  onChange={(e) => onUpdate({ evolvesFrom: e.target.value })}
                  placeholder="例: ブロロン"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Card Style (ノーマル / ノーマルEX / フルアート / フルアートEX) */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              スタイル
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CARD_STYLE_OPTIONS.map((styleOpt) => {
                const currentStyle = pokemonCard.cardStyle || 'normal';
                const isSelected = currentStyle === styleOpt.value;
                return (
                  <button
                    key={styleOpt.value}
                    type="button"
                    onClick={() => {
                      onUpdate({ cardStyle: styleOpt.value });
                    }}
                    className={`h-10 flex flex-col items-center justify-center px-2 py-1 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{styleOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pokedex Sub-Info */}
          {(() => {
            const isFullArtPokemon = pokemonCard.cardStyle === 'fullart' || pokemonCard.cardStyle === 'fullart_ex';
            const isExPokemon = (pokemonCard.suffix && pokemonCard.suffix.toLowerCase() === 'ex') || pokemonCard.cardStyle === 'normal_ex' || pokemonCard.cardStyle === 'fullart_ex';
            const isDexDisabled = isFullArtPokemon || isExPokemon;
            return (
              <div
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  isDexDisabled
                    ? 'bg-slate-800/20 border-slate-700/30 opacity-40 cursor-not-allowed select-none'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 block">
                    図鑑・ステータス詳細
                  </span>
                </div>
                <div className={`grid grid-cols-3 gap-2 ${isDexDisabled ? 'pointer-events-none' : ''}`}>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      図鑑番号
                    </label>
                    <input
                      type="text"
                      disabled={isDexDisabled}
                      value={pokemonCard.dexNumber}
                      onChange={(e) => onUpdate({ dexNumber: e.target.value })}
                      placeholder="NO. 0025"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      分類
                    </label>
                    <input
                      type="text"
                      disabled={isDexDisabled}
                      value={pokemonCard.dexSpecies}
                      onChange={(e) => onUpdate({ dexSpecies: e.target.value })}
                      placeholder="ねずみポケモン"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        高さ
                      </label>
                      <input
                        type="text"
                        disabled={isDexDisabled}
                        value={pokemonCard.dexHeight}
                        onChange={(e) => onUpdate({ dexHeight: e.target.value })}
                        placeholder="0.4m"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        重さ
                      </label>
                      <input
                        type="text"
                        disabled={isDexDisabled}
                        value={pokemonCard.dexWeight}
                        onChange={(e) => onUpdate({ dexWeight: e.target.value })}
                        placeholder="6.0kg"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        /* TRAINER SPECIFIC FIELDS */
        <>
          {/* Trainer Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              トレーナーズ カテゴリ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className={`h-16 p-2 rounded-xl border flex flex-col items-center justify-center transition-all text-center relative overflow-hidden ${
                      isSelected
                        ? 'border-sky-400 bg-slate-700/90 shadow-md ring-2 ring-sky-400/50'
                        : 'border-slate-700 bg-slate-800/80 hover:bg-slate-750'
                    }`}
                  >
                    {TRAINER_CATEGORY_ICONS[cat] ? (
                      <div className="flex-1 w-full flex items-center justify-center px-1">
                        <img
                          src={TRAINER_CATEGORY_ICONS[cat]}
                          alt={conf.jpName}
                          className="object-contain pointer-events-none select-none transition-transform"
                          style={{
                            maxHeight: `${CATEGORY_BUTTON_CONFIG.IMAGE_MAX_HEIGHT}px`,
                            maxWidth: `${CATEGORY_BUTTON_CONFIG.IMAGE_MAX_WIDTH}px`,
                            transform: `scale(${CATEGORY_BUTTON_CONFIG.IMAGE_SCALE})`,
                          }}
                        />
                      </div>
                    ) : (
                      <span
                        className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white leading-none shadow-xs"
                        style={{ backgroundColor: conf.bannerColor }}
                      >
                        {conf.jpName}
                      </span>
                    )}

                    {CATEGORY_BUTTON_CONFIG.SHOW_CATEGORY_SUBTEXT && (
                      <span className="text-[9px] text-slate-400 font-mono leading-none mt-1">
                        {conf.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trainer Name */}
          <div>
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
