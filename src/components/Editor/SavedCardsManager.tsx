import React, { useState, useEffect } from 'react';
import { CardData } from '../../types';
import { Save, FolderOpen, Trash2, Plus, Download, Upload } from 'lucide-react';

interface SavedCardsManagerProps {
  currentCard: CardData;
  onLoadCard: (card: CardData) => void;
  onSaveNotification?: (msg: string) => void;
}

const STORAGE_KEY = 'poke_custom_cards_v1';

export const SavedCardsManager: React.FC<SavedCardsManagerProps> = ({
  currentCard,
  onLoadCard,
  onSaveNotification,
}) => {
  const [savedCards, setSavedCards] = useState<CardData[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCards(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cards from storage', e);
    }
  }, []);

  const saveCurrentCard = () => {
    try {
      const newCard = { ...currentCard, id: `card_${Date.now()}` };
      const updated = [newCard, ...savedCards];
      setSavedCards(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      onSaveNotification?.(`「${currentCard.name || 'カード'}」をマイコレクションに保存しました！`);
    } catch (e) {
      console.error('Failed to save card', e);
    }
  };

  const deleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = savedCards.filter((c) => c.id !== id);
      setSavedCards(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      onSaveNotification?.('カードを削除しました');
    } catch (e) {
      console.error('Failed to delete card', e);
    }
  };

  const exportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedCards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pokemon_cards_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setSavedCards(imported);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
          onSaveNotification?.(`${imported.length}件のカードデータを読み込みました`);
        }
      } catch (err) {
        alert('JSONファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={saveCurrentCard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          <span>現在のカードを保存</span>
        </button>

        <div className="flex items-center gap-1.5">
          <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>インポート</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportJson}
            />
          </label>
          {savedCards.length > 0 && (
            <button
              type="button"
              onClick={exportAllJson}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="JSONでエクスポート"
            >
              <Download className="w-3.5 h-3.5" />
              <span>エクスポート</span>
            </button>
          )}
        </div>
      </div>

      {/* Saved list */}
      <div>
        <span className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
          <FolderOpen className="w-4 h-4 text-amber-400" />
          保存されたカード一覧 ({savedCards.length}枚)
        </span>

        {savedCards.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-700/60 text-slate-400 text-xs">
            まだ保存されたカードはありません。「現在のカードを保存」ボタンを押すとここにコレクションされます。
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
            {savedCards.map((cardItem) => (
              <div
                key={cardItem.id}
                onClick={() => onLoadCard(cardItem)}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:border-amber-400 cursor-pointer transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-12 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-600">
                  <img
                    src={cardItem.imageUrl}
                    alt={cardItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-zen font-bold text-xs text-slate-100 truncate group-hover:text-amber-300">
                      {cardItem.name || '名称未設定'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => deleteCard(cardItem.id, e)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {cardItem.kind === 'pokemon'
                      ? `${(cardItem as any).stage} / ${(cardItem as any).primaryType}`
                      : `${(cardItem as any).category}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
