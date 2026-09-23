import React from 'react';
import { CardData, Move, MoveTheme, PokemonCardData, PokemonType, TrainerCardData } from '../../types';
import { MOVE_THEME_OPTIONS, TRAINER_CATEGORY_CONFIG, TYPE_CONFIG } from '../../constants/cardData';
import { EnergyIcon } from '../EnergyIcon';
import { Plus, Trash2, Zap, Shield, Sparkles, Wand2 } from 'lucide-react';

interface MovesAndAbilityEditorProps {
  card: CardData;
  onUpdate: (updated: Partial<CardData>) => void;
}

export const MovesAndAbilityEditor: React.FC<MovesAndAbilityEditorProps> = ({
  card,
  onUpdate,
}) => {
  const isPokemon = card.kind === 'pokemon';
  const pokemonCard = card as PokemonCardData;
  const trainerCard = card as TrainerCardData;

  const energyOptions: PokemonType[] = [
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

  // Move management helpers
  const handleAddMove = () => {
    if (pokemonCard.moves.length >= 2) return;
    const newMove: Move = {
      id: `m_${Date.now()}`,
      name: '新しいワザ',
      energyCost: [pokemonCard.primaryType, 'colorless'],
      damage: '50',
      description: '',
      theme: 'standard',
    };
    onUpdate({ moves: [...pokemonCard.moves, newMove] });
  };

  const handleUpdateMove = (index: number, updated: Partial<Move>) => {
    const updatedMoves = pokemonCard.moves.map((m, i) =>
      i === index ? { ...m, ...updated } : m
    );
    onUpdate({ moves: updatedMoves });
  };

  const handleDeleteMove = (index: number) => {
    const updatedMoves = pokemonCard.moves.filter((_, i) => i !== index);
    onUpdate({ moves: updatedMoves });
  };

  const handleAddEnergyToMove = (moveIndex: number, energyType: PokemonType) => {
    const move = pokemonCard.moves[moveIndex];
    if (move.energyCost.length >= 6) return;
    handleUpdateMove(moveIndex, {
      energyCost: [...move.energyCost, energyType],
    });
  };

  const handleRemoveEnergyFromMove = (moveIndex: number, energyIndex: number) => {
    const move = pokemonCard.moves[moveIndex];
    handleUpdateMove(moveIndex, {
      energyCost: move.energyCost.filter((_, i) => i !== energyIndex),
    });
  };

  if (!isPokemon) {
    // TRAINER EFFECT EDITOR
    return (
      <div className="space-y-4">
        {/* Rule Text */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-300">
              ルール説明テキスト
            </label>
            <button
              type="button"
              onClick={() => {
                const def = TRAINER_CATEGORY_CONFIG[trainerCard.category]?.defaultRule;
                if (def) onUpdate({ ruleText: def });
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300 underline"
            >
              カテゴリの標準ルールを適用
            </button>
          </div>
          <input
            type="text"
            value={trainerCard.ruleText}
            onChange={(e) => onUpdate({ ruleText: e.target.value })}
            placeholder="サポートは、自分の番に1枚しか使えない。"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        {/* Effect Text */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            カードの効果テキスト (改行可)
          </label>
          <textarea
            rows={5}
            value={trainerCard.effectText}
            onChange={(e) => onUpdate({ effectText: e.target.value })}
            placeholder="自分の山札から好きなカードを3枚まで選び、手札に加える。そして山札を切る。"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 leading-relaxed font-mplus"
          />
        </div>

        {/* Sub Effect / Description */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            補足・フレーバー説明 (任意)
          </label>
          <input
            type="text"
            value={trainerCard.subEffectText || ''}
            onChange={(e) => onUpdate({ subEffectText: e.target.value })}
            placeholder="例: （最初の自分の番には使えない。）"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>
    );
  }

  // POKEMON ABILITY & MOVES EDITOR
  return (
    <div className="space-y-4">
      {/* ABILITY (特性) SECTION */}
      <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-slate-200">特性 (とくせい)</span>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdate({
                ability: {
                  ...pokemonCard.ability,
                  enabled: !pokemonCard.ability.enabled,
                },
              })
            }
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              pokemonCard.ability.enabled
                ? 'bg-red-500 text-white shadow'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {pokemonCard.ability.enabled ? '有効' : '無効'}
          </button>
        </div>

        {pokemonCard.ability.enabled && (
          <div className="space-y-2 pt-1 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[11px] text-slate-400 block mb-0.5">
                  特性の名前
                </label>
                <input
                  type="text"
                  value={pokemonCard.ability.name}
                  onChange={(e) =>
                    onUpdate({
                      ability: { ...pokemonCard.ability, name: e.target.value },
                    })
                  }
                  placeholder="例: れんごくしはい, がんばりハート"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">
                  タイプ
                </label>
                <select
                  value={pokemonCard.ability.type}
                  onChange={(e) =>
                    onUpdate({
                      ability: {
                        ...pokemonCard.ability,
                        type: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-red-400"
                >
                  <option value="ability">通常特性</option>
                  <option value="vstar_power">VSTARパワー</option>
                  <option value="ancient_trait">古代能力</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">
                効果説明
              </label>
              <textarea
                rows={2}
                value={pokemonCard.ability.description}
                onChange={(e) =>
                  onUpdate({
                    ability: {
                      ...pokemonCard.ability,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="特性の効果説明を入力してください"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* MOVES (ワザ) SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              ワザ設定 (最大2つ)
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddMove}
            disabled={pokemonCard.moves.length >= 2}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              pokemonCard.moves.length >= 2
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-40 border border-slate-700/60'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ワザを追加</span>
          </button>
        </div>

        {/* Move Cards List */}
        {pokemonCard.moves.map((move, moveIdx) => (
          <div
            key={move.id || moveIdx}
            className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2.5 relative"
          >
            {/* Header: Move Index & Delete */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-700">
              <span className="text-[11px] font-bold text-amber-400">
                ワザ {moveIdx + 1}
              </span>
              {pokemonCard.moves.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteMove(moveIdx)}
                  className="text-slate-400 hover:text-red-400 p-1"
                  title="ワザを削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Move Name & Damage */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  ワザ名
                </label>
                <input
                  type="text"
                  value={move.name}
                  onChange={(e) =>
                    handleUpdateMove(moveIdx, { name: e.target.value })
                  }
                  placeholder="例: バーニングダーク, 10まんボルト"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  ダメージ
                </label>
                <input
                  type="text"
                  value={move.damage}
                  onChange={(e) =>
                    handleUpdateMove(moveIdx, { damage: e.target.value })
                  }
                  placeholder="例: 180+, 300, 50×"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Energy Cost Builder */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 block">
                  必要エネルギー (クリックで追加 / 右側をクリックで削除)
                </label>
                <span className="text-[10px] text-slate-400">
                  {move.energyCost.length === 0
                    ? 'なし'
                    : `${move.energyCost.length}個`}
                </span>
              </div>

              {/* Current energy list */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 min-h-[36px] mb-2 flex-wrap">
                {move.energyCost.length === 0 ? (
                  <span className="text-[10px] text-slate-500 pl-1">
                    下のエネルギーアイコンをクリックして追加してください
                  </span>
                ) : (
                  move.energyCost.map((eType, eIdx) => (
                    <button
                      key={eIdx}
                      type="button"
                      onClick={() => handleRemoveEnergyFromMove(moveIdx, eIdx)}
                      className="group relative cursor-pointer"
                      title="クリックして削除"
                    >
                      <EnergyIcon type={eType} size="sm" />
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-3 h-3 text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Quick Energy Add Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap py-1">
                {energyOptions.map((eType) => (
                  <button
                    key={eType}
                    type="button"
                    onClick={() => handleAddEnergyToMove(moveIdx, eType)}
                    className="p-0.5 rounded-full hover:scale-125 active:scale-90 hover:brightness-125 transition-all duration-150 cursor-pointer focus:outline-none"
                    title={`${TYPE_CONFIG[eType].jpName}エネルギーを追加`}
                  >
                    <EnergyIcon type={eType} size="sm" showShadow={true} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateMove(moveIdx, { energyCost: [] })
                  }
                  className="px-2 py-0.5 text-[9px] bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-slate-200 transition-colors ml-1"
                >
                  クリア
                </button>
              </div>
            </div>

            {/* Move Description */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                効果説明 (任意)
              </label>
              <textarea
                rows={2}
                value={move.description}
                onChange={(e) =>
                  handleUpdateMove(moveIdx, { description: e.target.value })
                }
                placeholder="例: 相手がすでにとったサイドの枚数×30ダメージ追加。"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* MOVE DESIGN & THEME (Satisfies requirement: カードのデザインはわざごとに変化する) */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60">
              <div>
                <label className="text-[10px] text-amber-300 font-bold block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  わざのデザイン演出
                </label>
                <select
                  value={move.theme}
                  onChange={(e) =>
                    handleUpdateMove(moveIdx, {
                      theme: e.target.value as MoveTheme,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  {MOVE_THEME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  特殊タグ (任意)
                </label>
                <input
                  type="text"
                  value={move.specialTag || ''}
                  onChange={(e) =>
                    handleUpdateMove(moveIdx, { specialTag: e.target.value })
                  }
                  placeholder="テラスわざ, GX, 必殺技"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
