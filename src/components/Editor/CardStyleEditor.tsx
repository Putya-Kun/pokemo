import React, { useState } from 'react';
import { CardData } from '../../types';
import { FRAME_OPTIONS } from '../../constants/energyImages';
import { VISUAL_EFFECT_OPTIONS, VISUAL_EFFECT_CATEGORIES } from '../../constants/visualEffects';
import { Frame, Check, Sparkles, X, Layers, AlertCircle } from 'lucide-react';

interface CardStyleEditorProps {
  card: CardData;
  onUpdate: (updated: Partial<CardData>) => void;
}

export const CardStyleEditor: React.FC<CardStyleEditorProps> = ({
  card,
  onUpdate,
}) => {
  const isTrainer = card.kind === 'trainer';
  const currentFrameId = isTrainer ? 'none' : (card.selectedFrame || 'normal');
  const selectedEffects = card.visualEffects || [];
  const isMaxReached = selectedEffects.length >= 5;
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredEffects = activeCategory === 'ALL'
    ? VISUAL_EFFECT_OPTIONS
    : VISUAL_EFFECT_OPTIONS.filter((fx) => fx.category === activeCategory);

  const handleToggleEffect = (url: string) => {
    const isSelected = selectedEffects.includes(url);
    if (isSelected) {
      onUpdate({ visualEffects: selectedEffects.filter((u) => u !== url) });
    } else {
      if (selectedEffects.length < 5) {
        onUpdate({ visualEffects: [...selectedEffects, url] });
      }
    }
  };

  const handleClearEffects = () => {
    onUpdate({ visualEffects: [] });
  };

  return (
    <div className="space-y-7">
      {/* 1. FRAME SELECTOR (assets/frame/) */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Frame className="w-4 h-4 text-amber-400" />
            カードフレーム選択 (Frame Overlay)
          </label>
          <span className="text-[11px] text-slate-400">
            全{FRAME_OPTIONS.length}種
          </span>
        </div>

        {isTrainer ? (
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-3 mb-3 text-xs text-amber-300/90 flex items-center gap-2 shadow-sm">
            <span className="font-bold text-amber-400 shrink-0">※</span>
            <span>トレーナーズカードは専用デザイン枠のため、フレーム選択は無効（選択なし固定）になります。</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 mb-3">
            カードのフレームの色を変更します。
          </p>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {FRAME_OPTIONS.map((opt) => {
            const isSelected = currentFrameId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isTrainer}
                onClick={() => {
                  if (!isTrainer) {
                    onUpdate({ selectedFrame: opt.id });
                  }
                }}
                className={`group relative p-2 rounded-xl border text-center transition-all overflow-hidden flex flex-col items-center justify-between ${
                  isTrainer
                    ? 'opacity-35 grayscale cursor-not-allowed border-slate-800 bg-slate-900/40 pointer-events-none'
                    : isSelected
                    ? 'border-amber-400 bg-slate-800 text-white shadow-lg ring-2 ring-amber-400/40'
                    : 'border-slate-700/80 bg-slate-800/70 text-slate-300 hover:bg-slate-700/60 hover:border-slate-600'
                }`}
              >
                {/* Frame Preview Thumbnail */}
                <div className="relative w-full aspect-[420/586] rounded-lg bg-slate-950/70 overflow-hidden mb-2 flex items-center justify-center border border-slate-800">
                  {opt.url ? (
                    <img
                      src={encodeURI(opt.url)}
                      alt={opt.name}
                      className="w-full h-full object-fill pointer-events-none group-hover:scale-105 transition-transform relative z-10"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '0';
                      }}
                    />
                  ) : (
                    <div className="text-center p-1.5 flex flex-col items-center justify-center h-full">
                      <span className="text-[10px] text-slate-500 font-medium">
                        枠なし
                      </span>
                    </div>
                  )}

                  {/* Selection Badge */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md z-20">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="w-full text-center">
                  <span className="text-[11px] font-bold text-slate-100 block truncate">
                    {opt.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. VISUAL EFFECTS SELECTOR (assets/visualeffect/) */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              ビジュアル・エフェクト (Visual Effects)
            </label>
            <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
              isMaxReached 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : selectedEffects.length > 0 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              <Layers className="w-3 h-3" />
              <span>選択中: {selectedEffects.length} / 5</span>
            </div>
          </div>

          {selectedEffects.length > 0 && (
            <button
              type="button"
              onClick={handleClearEffects}
              className="text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              全解除
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          カードの上に重ねるエフェクトレイヤーです（最大5つまで選択可能）。選択中のエフェクトを再度タップすると解除されます。
        </p>

        {/* Max Limit Warning Banner */}
        {isMaxReached && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200/90 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>最大5つのエフェクトが選択されています。他のエフェクトを選ぶには、選択中のエフェクトを解除してください。</span>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {VISUAL_EFFECT_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat;
            const count = cat === 'ALL'
              ? VISUAL_EFFECT_OPTIONS.length
              : VISUAL_EFFECT_OPTIONS.filter((fx) => fx.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                  isCatActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {cat} <span className="opacity-75 font-normal text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Visual Effects Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
          {filteredEffects.map((fx) => {
            const isSelected = selectedEffects.includes(fx.url);
            const isDisabled = isMaxReached && !isSelected;

            return (
              <button
                key={fx.id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleToggleEffect(fx.url)}
                title={isDisabled ? '最大5個まで選択可能です。選択中のエフェクトを解除してください。' : fx.name}
                className={`group relative p-2 rounded-xl border text-center transition-all overflow-hidden flex flex-col items-center justify-between ${
                  isDisabled
                    ? 'opacity-35 grayscale cursor-not-allowed border-slate-800 bg-slate-900/30'
                    : isSelected
                    ? 'border-cyan-400 bg-slate-800/95 text-white shadow-lg ring-2 ring-cyan-400/50 shadow-cyan-950/40'
                    : 'border-slate-700/80 bg-slate-800/70 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500 cursor-pointer'
                }`}
              >
                {/* Visual Effect Preview Thumbnail */}
                <div className="relative w-full aspect-[420/586] rounded-lg bg-slate-950/90 overflow-hidden mb-2 flex items-center justify-center border border-slate-800">
                  {/* Subtle checkered backdrop pattern for visibility of transparent FX */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />

                  <img
                    src={fx.url}
                    alt={fx.name}
                    className="w-full h-full object-fill pointer-events-none group-hover:scale-105 transition-transform relative z-10"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0';
                    }}
                  />

                  {/* Selection Check Badge */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md z-20">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="w-full text-center">
                  <span className={`text-[11px] font-bold block truncate ${
                    isSelected ? 'text-cyan-200' : 'text-slate-200'
                  }`}>
                    {fx.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
