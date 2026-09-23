import React from 'react';
import { CardData } from '../../types';
import { PRESET_CARDS } from '../../constants/cardData';
import { Sparkles, BookmarkCheck } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (card: CardData) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          公式風プリセットカード (1クリック適用)
        </span>
        <span className="text-[11px] text-slate-400">
          全6種類のテンプレート
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PRESET_CARDS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(JSON.parse(JSON.stringify(preset.data)))}
            className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-amber-400/80 transition-all text-left flex items-start gap-3 group shadow-sm"
          >
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-600">
              <img
                src={preset.data.imageUrl}
                alt={preset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-zen font-bold text-xs text-slate-100 truncate group-hover:text-amber-300">
                  {preset.name}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-mono">
                  {preset.data.kind === 'pokemon' ? 'ポケモン' : 'トレーナー'}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/90 font-medium block mt-0.5">
                {preset.tag}
              </span>
              <span className="text-[9px] text-slate-400 block mt-1 truncate">
                {preset.data.kind === 'pokemon'
                  ? `HP ${preset.data.hp} / ${preset.data.moves[0]?.name || ''}`
                  : `${preset.data.category} / ${preset.data.rarity}`}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
