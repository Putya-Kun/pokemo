import React from 'react';
import { CardData } from '../../types';
import { FRAME_OPTIONS } from '../../constants/energyImages';
import { Frame, Tag, Check, Sparkles } from 'lucide-react';

interface CardStyleEditorProps {
  card: CardData;
  onUpdate: (updated: Partial<CardData>) => void;
}

export const CardStyleEditor: React.FC<CardStyleEditorProps> = ({
  card,
  onUpdate,
}) => {
  const isTrainer = card.kind === 'trainer';
  const currentFrameId = isTrainer ? 'none' : (card.selectedFrame || 'none');

  return (
    <div className="space-y-5">
      {/* FRAME SELECTOR (assets/frame/) */}
      <div>
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
                {/* Visual Vertical Frame Preview Thumbnail (縦長カード比率) */}
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

                {/* Name & Desc */}
                <div className="w-full text-center">
                  <span className="text-[11px] font-bold text-slate-100 block truncate">
                    {opt.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate leading-tight mt-0.5">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SPECIAL CARD TAG BADGE */}
      <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-3">
        <label className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          カード右上の特別ラベル (カスタムタグ)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={card.customCardTag || ''}
            onChange={(e) => onUpdate({ customCardTag: e.target.value })}
            placeholder="例: テラスタル, 古代, 未来, ACE SPEC, PROMO"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          />
          {card.customCardTag && (
            <button
              type="button"
              onClick={() => onUpdate({ customCardTag: '' })}
              className="px-2.5 py-1 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
            >
              削除
            </button>
          )}
        </div>

        {/* Quick Tag Suggestions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['テラスタル', '古代', '未来', 'かがやく', 'ACE SPEC', 'フルアート', 'PROMO'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onUpdate({ customCardTag: tag })}
                className="px-2 py-0.5 rounded-full bg-slate-700/80 hover:bg-amber-500/20 hover:text-amber-300 text-[10px] font-semibold text-slate-300 transition-colors"
              >
                +{tag}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
