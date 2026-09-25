/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardData, PokemonCardData, TrainerCardData } from './types';
import { PRESET_CARDS } from './constants/cardData';
import { CardPreview } from './components/CardPreview';
import { BasicInfoEditor } from './components/Editor/BasicInfoEditor';
import { ImageUploader } from './components/Editor/ImageUploader';
import { MovesAndAbilityEditor } from './components/Editor/MovesAndAbilityEditor';
import { StatsAndFooterEditor } from './components/Editor/StatsAndFooterEditor';
import { CardStyleEditor } from './components/Editor/CardStyleEditor';
import { SavedCardsManager } from './components/Editor/SavedCardsManager';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Zap,
  Sliders,
  Palette,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

type TabType = 'basic' | 'image' | 'moves' | 'stats' | 'style' | 'saved';

export default function App() {
  // Saved state for pokemon card and trainer card so switching keeps all properties
  const [pokemonHistory, setPokemonHistory] = useState<PokemonCardData>(() => {
    const cardData = JSON.parse(JSON.stringify(PRESET_CARDS[0].data)) as PokemonCardData;
    cardData.imageUrl = '';
    return cardData;
  });

  const [trainerHistory, setTrainerHistory] = useState<TrainerCardData>(() => {
    const trainerPreset = PRESET_CARDS.find((p) => p.data.kind === 'trainer')?.data as TrainerCardData;
    if (trainerPreset) {
      const cardData = JSON.parse(JSON.stringify(trainerPreset)) as TrainerCardData;
      cardData.imageUrl = '';
      cardData.name = 'ブロロン';
      return cardData;
    }
    return {
      kind: 'trainer',
      id: 't_default',
      name: 'ブロロン',
      category: 'supporter',
      ruleText: 'サポートは、自分の番に1枚しか使えない。',
      effectText: 'お互いのプレイヤーは、それぞれ自分の手札をすべてウラにして切り、山札の下にもどす。\nその後、それぞれ自分のサイドの残り枚数ぶん、山札を引く。',
      isFullArt: false,
      illustrator: 'kirisAki',
      cardNumber: '091/071',
      setSymbol: 'SV2D',
      regulationMark: 'G',
      rarity: 'SR',
      foilEffect: 'none',
      selectedFrame: 'normal',
      imageUrl: '',
      imageScale: 1.0,
      imagePositionX: 0,
      imagePositionY: 0,
      imageFit: 'cover',
    };
  });

  const [currentCard, setCurrentCard] = useState<CardData>(() => {
    const cardData = JSON.parse(JSON.stringify(PRESET_CARDS[0].data));
    cardData.imageUrl = '';
    return cardData;
  });

  // Debounced card state for preview rendering to optimize input performance
  const [previewCard, setPreviewCard] = useState<CardData>(currentCard);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewCard(currentCard);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentCard]);

  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateCard = (updated: Partial<CardData>) => {
    setCurrentCard((prev) => {
      const next = {
        ...prev,
        ...updated,
      } as CardData;

      // Update the respective history
      if (next.kind === 'pokemon') {
        setPokemonHistory(next as PokemonCardData);
      } else {
        setTrainerHistory(next as TrainerCardData);
      }

      // カード名・キャラクター名はポケモンとトレーナーズで常に共通保持
      if (updated.name !== undefined) {
        setPokemonHistory((prevP) => ({ ...prevP, name: updated.name! }));
        setTrainerHistory((prevT) => ({ ...prevT, name: updated.name! }));
      }

      // 画像の移動・拡大縮小などスライド操作時は遅延なくリアルタイム同期
      if (
        updated.imagePositionX !== undefined ||
        updated.imagePositionY !== undefined ||
        updated.imageScale !== undefined
      ) {
        setPreviewCard(next);
      }

      return next;
    });
  };

  const handleSwitchKind = (kind: 'pokemon' | 'trainer') => {
    if (kind === currentCard.kind) return;
    if (kind === 'pokemon') {
      // Restore Pokemon card state completely, retaining user's selected type, stats, moves, dex, etc.
      const restoredPokemon: PokemonCardData = {
        ...pokemonHistory,
        // キャラクター名を共通保持
        name: currentCard.name || pokemonHistory.name,
        // Share image and illustration details if user changed them
        imageUrl: currentCard.imageUrl || pokemonHistory.imageUrl || '',
        imageScale: currentCard.imageScale ?? pokemonHistory.imageScale,
        imagePositionX: currentCard.imagePositionX ?? pokemonHistory.imagePositionX,
        imagePositionY: currentCard.imagePositionY ?? pokemonHistory.imagePositionY,
        imageFit: currentCard.imageFit ?? pokemonHistory.imageFit,
        illustrator: currentCard.illustrator || pokemonHistory.illustrator,
        cardNumber: currentCard.cardNumber || pokemonHistory.cardNumber,
        setSymbol: currentCard.setSymbol || pokemonHistory.setSymbol,
        regulationMark: currentCard.regulationMark || pokemonHistory.regulationMark,
        rarity: currentCard.rarity || pokemonHistory.rarity,
      };

      setCurrentCard(restoredPokemon);
      setPreviewCard(restoredPokemon);
      showToast('ポケモンカードレイアウトに切り替えました');
    } else {
      // Restore Trainer card state completely
      const restoredTrainer: TrainerCardData = {
        ...trainerHistory,
        // キャラクター名を共通保持
        name: currentCard.name || trainerHistory.name,
        // Share image and illustration details
        imageUrl: currentCard.imageUrl || trainerHistory.imageUrl || '',
        imageScale: currentCard.imageScale ?? trainerHistory.imageScale,
        imagePositionX: currentCard.imagePositionX ?? trainerHistory.imagePositionX,
        imagePositionY: currentCard.imagePositionY ?? trainerHistory.imagePositionY,
        imageFit: currentCard.imageFit ?? trainerHistory.imageFit,
        illustrator: currentCard.illustrator || trainerHistory.illustrator,
        cardNumber: currentCard.cardNumber || trainerHistory.cardNumber,
        setSymbol: currentCard.setSymbol || trainerHistory.setSymbol,
        regulationMark: currentCard.regulationMark || trainerHistory.regulationMark,
        rarity: currentCard.rarity || trainerHistory.rarity,
        selectedFrame: trainerHistory.selectedFrame || 'normal',
      };

      setCurrentCard(restoredTrainer);
      setPreviewCard(restoredTrainer);
      showToast('トレーナーズカードレイアウトに切り替えました');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '基本情報', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'image', label: 'イラスト', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    {
      id: 'moves',
      label: currentCard.kind === 'pokemon' ? 'わざ・特性' : '効果テキスト',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: 'stats',
      label: currentCard.kind === 'pokemon' ? 'ステータス' : '表記・詳細',
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
    { id: 'style', label: 'フレーム・装飾', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'saved', label: '保存一覧', icon: <Bookmark className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-zen font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
                PokeMO
              </h1>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                手軽にオリジナルカード作成
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-amber-300 px-4 py-2.5 rounded-xl border border-amber-400/40 shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / TOP: LIVE CARD PREVIEW (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky lg:top-20 z-10">
          <CardPreview
            card={previewCard}
            onUpdateCard={handleUpdateCard}
            onSaveToGallery={() => {
              showToast(`「${currentCard.name}」を保存しました`);
            }}
          />
        </div>

        {/* RIGHT / BOTTOM: TABBED EDITOR (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col">
          
          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-2.5 mb-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/60'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS */}
          <div className="space-y-4">
            {activeTab === 'basic' && (
              <BasicInfoEditor
                card={currentCard}
                onUpdate={handleUpdateCard}
                onSwitchKind={handleSwitchKind}
              />
            )}

            {activeTab === 'image' && (
              <ImageUploader
                imageUrl={currentCard.imageUrl}
                onUpdate={handleUpdateCard}
              />
            )}

            {activeTab === 'moves' && (
              <MovesAndAbilityEditor
                card={currentCard}
                onUpdate={handleUpdateCard}
              />
            )}

            {activeTab === 'stats' && (
              <StatsAndFooterEditor
                card={currentCard}
                onUpdate={handleUpdateCard}
              />
            )}

            {activeTab === 'style' && (
              <CardStyleEditor
                card={currentCard}
                onUpdate={handleUpdateCard}
              />
            )}

            {activeTab === 'saved' && (
              <SavedCardsManager
                currentCard={currentCard}
                onLoadCard={(c) => {
                  setCurrentCard(c);
                  if (c.kind === 'pokemon') {
                    setPokemonHistory(c as PokemonCardData);
                  } else {
                    setTrainerHistory(c as TrainerCardData);
                  }
                  showToast(`「${c.name}」を読み込みました`);
                }}
                onSaveNotification={showToast}
              />
            )}
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        ポケモンカードジェネレーター (Pokemon Card Generator) — オリジナルカード作成用ツール
      </footer>
    </div>
  );
}
