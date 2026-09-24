import React from 'react';
import { CardData, PokemonCardData, PokemonType, CardRarity } from '../../types';
import { RARITY_OPTIONS, TYPE_CONFIG } from '../../constants/cardData';
import { EnergyIcon } from '../EnergyIcon';
import { Heart, ShieldAlert, Footprints, BookOpen, User } from 'lucide-react';

interface StatsAndFooterEditorProps {
  card: CardData;
  onUpdate: (updated: Partial<CardData>) => void;
}

export const StatsAndFooterEditor: React.FC<StatsAndFooterEditorProps> = ({
  card,
  onUpdate,
}) => {
  const isPokemon = card.kind === 'pokemon';
  const pokemonCard = card as PokemonCardData;

  const energyTypes: PokemonType[] = [
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

  const hpPresets = ['60', '100', '130', '180', '220', '280', '330'];

  return (
    <div className="space-y-4">
      {/* POKEMON BATTLE STATS */}
      {isPokemon && (
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-slate-200">
              HP・対戦ステータス
            </span>
          </div>

          {/* HP Input & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-400">最大HP</label>
              <div className="flex gap-1">
                {hpPresets.map((hp) => (
                  <button
                    key={hp}
                    type="button"
                    onClick={() => onUpdate({ hp })}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      pokemonCard.hp === hp
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {hp}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={pokemonCard.hp}
              onChange={(e) => onUpdate({ hp: e.target.value })}
              placeholder="例: 200, 330"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Weakness & Resistance */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-700/50">
            {/* Weakness */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                弱点タイプ / 倍率
              </label>
              <div className="flex gap-1.5">
                <select
                  value={pokemonCard.weaknessType}
                  onChange={(e) =>
                    onUpdate({
                      weaknessType: e.target.value as PokemonType | 'none',
                    })
                  }
                  className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="none">なし</option>
                  {energyTypes.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_CONFIG[t].jpName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={pokemonCard.weaknessValue}
                  onChange={(e) => onUpdate({ weaknessValue: e.target.value })}
                  placeholder="×2"
                  className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-center text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Resistance */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                抵抗力タイプ / 補正値
              </label>
              <div className="flex gap-1.5">
                <select
                  value={pokemonCard.resistanceType}
                  onChange={(e) =>
                    onUpdate({
                      resistanceType: e.target.value as PokemonType | 'none',
                    })
                  }
                  className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="none">なし</option>
                  {energyTypes.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_CONFIG[t].jpName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={pokemonCard.resistanceValue}
                  onChange={(e) =>
                    onUpdate({ resistanceValue: e.target.value })
                  }
                  placeholder="-30"
                  className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-center text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Retreat Cost */}
          <div className="pt-1 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" /> にげるエネルギー
              </label>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((cost) => (
                  <button
                    key={cost}
                    type="button"
                    onClick={() => onUpdate({ retreatCost: cost })}
                    className={`px-2 py-0.5 rounded text-xs font-mono ${
                      pokemonCard.retreatCost === cost
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {cost === 0 ? 'なし' : cost}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flavor text */}
          {(() => {
            const isEx = pokemonCard.suffix?.toLowerCase() === 'ex' || pokemonCard.cardStyle === 'normal_ex' || pokemonCard.cardStyle === 'fullart_ex';
            return (
              <div className={`pt-1 border-t border-slate-700/50 transition-all ${isEx ? 'opacity-40 cursor-not-allowed select-none' : ''}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> 図鑑説明 (フレーバーテキスト)
                  </label>
                </div>
                <textarea
                  rows={2}
                  disabled={isEx}
                  value={pokemonCard.flavorText}
                  onChange={(e) => onUpdate({ flavorText: e.target.value })}
                  placeholder="ポケモン図鑑の説明文を入力してください"
                  className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-serif ${
                    isEx ? 'bg-slate-900/40 text-slate-500 cursor-not-allowed pointer-events-none border-slate-800' : ''
                  }`}
                />
              </div>
            );
          })()}
        </div>
      )}

      {/* FOOTER & COLLECTOR METADATA */}
      <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-3">
        <span className="text-xs font-bold text-slate-200 block">
          カードコレクター情報・フッター表記
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              イラストレーター名 (illus.)
            </label>
            <input
              type="text"
              value={card.illustrator}
              onChange={(e) => onUpdate({ illustrator: e.target.value })}
              placeholder="例: Hiro Iwai, あなたの名前"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              レアリティ
            </label>
            <select
              value={card.rarity}
              onChange={(e) =>
                onUpdate({ rarity: e.target.value as CardRarity })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            >
              {RARITY_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/50">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              カード番号
            </label>
            <input
              type="text"
              value={card.cardNumber}
              onChange={(e) => onUpdate({ cardNumber: e.target.value })}
              placeholder="025/190"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              エキスパンション記号
            </label>
            <input
              type="text"
              value={card.setSymbol}
              onChange={(e) => onUpdate({ setSymbol: e.target.value })}
              placeholder="SV8"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              レギュレーション
            </label>
            <select
              value={card.regulationMark}
              onChange={(e) => onUpdate({ regulationMark: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="I">I (最新)</option>
              <option value="H">H (現行)</option>
              <option value="G">G (現行)</option>
              <option value="F">F</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
