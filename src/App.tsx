/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CardData, PokemonCardData, TrainerCardData } from './types';
import { PRESET_CARDS } from './constants/cardData';
import { CardPreview } from './components/CardPreview';
import { BasicInfoEditor } from './components/Editor/BasicInfoEditor';
import { ImageUploader } from './components/Editor/ImageUploader';
import { MovesAndAbilityEditor } from './components/Editor/MovesAndAbilityEditor';
import { StatsAndFooterEditor } from './components/Editor/StatsAndFooterEditor';
import { CardStyleEditor } from './components/Editor/CardStyleEditor';
import { PresetSelector } from './components/Editor/PresetSelector';
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

type TabType = 'basic' | 'image' | 'moves' | 'stats' | 'style' | 'presets' | 'saved';

export default function App() {
  // Initial default card (Pikachu ex)
  const [currentCard, setCurrentCard] = useState<CardData>(
    JSON.parse(JSON.stringify(PRESET_CARDS[0].data))
  );

  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateCard = (updated: Partial<CardData>) => {
    setCurrentCard((prev) => ({
      ...prev,
      ...updated,
    } as CardData));
  };

  const handleSwitchKind = (kind: 'pokemon' | 'trainer') => {
    if (kind === currentCard.kind) return;
    if (kind === 'pokemon') {
      const pokemonPreset = PRESET_CARDS.find((p) => p.data.kind === 'pokemon')?.data;
      if (pokemonPreset) {
        setCurrentCard({
          ...JSON.parse(JSON.stringify(pokemonPreset)),
          name: currentCard.name && currentCard.name !== 'ナンジャモ' && currentCard.name !== '博士の研究' ? currentCard.name : 'ピカチュウ',
          imageUrl: currentCard.imageUrl || pokemonPreset.imageUrl,
          illustrator: currentCard.illustrator || pokemonPreset.illustrator,
          cardNumber: currentCard.cardNumber || pokemonPreset.cardNumber,
          setSymbol: currentCard.setSymbol || pokemonPreset.setSymbol,
          regulationMark: currentCard.regulationMark || pokemonPreset.regulationMark,
          rarity: currentCard.rarity || pokemonPreset.rarity,
          selectedFrame: currentCard.selectedFrame || 'normal',
        });
      }
      showToast('ポケモンカードレイアウトに切り替えました');
    } else {
      const trainerPreset = PRESET_CARDS.find((p) => p.data.kind === 'trainer')?.data;
      if (trainerPreset) {
        setCurrentCard({
          ...JSON.parse(JSON.stringify(trainerPreset)),
          name: currentCard.name && currentCard.name !== 'ピカチュウ' && currentCard.name !== 'リザードン' ? currentCard.name : 'ナンジャモ',
          imageUrl: currentCard.imageUrl || trainerPreset.imageUrl,
          illustrator: currentCard.illustrator || trainerPreset.illustrator,
          cardNumber: currentCard.cardNumber || trainerPreset.cardNumber,
          setSymbol: currentCard.setSymbol || trainerPreset.setSymbol,
          regulationMark: currentCard.regulationMark || trainerPreset.regulationMark,
          rarity: currentCard.rarity || trainerPreset.rarity,
          selectedFrame: currentCard.selectedFrame || 'normal',
        });
      }
      showToast('トレーナーズカードレイアウトに切り替えました');
    }
  };

  const handleSelectPreset = (preset: CardData) => {
    setCurrentCard(preset);
    showToast(`プリセット「${preset.name}」を読み込みました`);
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
    { id: 'presets', label: 'プリセット', icon: <Sparkles className="w-3.5 h-3.5" /> },
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
                ポケモンカードジェネレーター
              </h1>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                オリジナルカード作成・わざデザイン演出・画像保存
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
            card={currentCard}
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
                imageScale={currentCard.imageScale}
                imagePositionX={currentCard.imagePositionX}
                imagePositionY={currentCard.imagePositionY}
                imageFit={currentCard.imageFit}
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

            {activeTab === 'presets' && (
              <PresetSelector onSelectPreset={handleSelectPreset} />
            )}

            {activeTab === 'saved' && (
              <SavedCardsManager
                currentCard={currentCard}
                onLoadCard={(c) => {
                  setCurrentCard(c);
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
        ポケモンカードジェネレーター (Pokemon Card Generator) — ファンアート・オリジナルカード作成用ツール
      </footer>
    </div>
  );
}
