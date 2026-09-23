import React, { useRef, useState } from 'react';
import { CardData } from '../types';
import { PokemonCard } from './PokemonCard';
import { TrainerCard } from './TrainerCard';
import { toPng } from 'html-to-image';
import { Share2, RefreshCw, Layers } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  onSaveToGallery?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DMode || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const shareCardImage = async () => {
    const cardElement = document.getElementById('pokemon-card-canvas');
    if (!cardElement) return;

    try {
      setIsExporting(true);
      // Reset rotation before capturing image
      const prevRotation = { ...rotation };
      setRotation({ x: 0, y: 0 });

      // Small delay for clean render
      await new Promise((resolve) => setTimeout(resolve, 80));

      const options = {
        pixelRatio: 3, // Crisp high-res 3x output
        quality: 0.95,
        cacheBust: true,
      };

      const dataUrl = await toPng(cardElement, options);
      const filename = `${card.name || 'pokemon_card'}_${card.kind}_${Date.now()}.png`;

      // Convert dataURL to Blob / File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      // Web Share API support check
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: card.name || 'ポケモンカード',
          text: `「${card.name || 'オリジナルカード'}」を作成しました！`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: card.name || 'ポケモンカード',
          text: `「${card.name || 'オリジナルカード'}」を作成しました！`,
          url: window.location.href,
        });
      } else {
        // Fallback download if Web Share is not supported
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      }

      setRotation(prevRotation);
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Failed to share card image:', err);
        alert('共有処理中にエラーが発生しました。別のブラウザでお試しください。');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start gap-4 w-full">
      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 shadow-md backdrop-blur-sm w-full max-w-[420px]">
        <button
          type="button"
          onClick={() => setIs3DMode(!is3DMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            is3DMode
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
          }`}
          title="マウスホバーでカードを3Dに傾けます"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3Dビューアー: {is3DMode ? 'ON' : 'OFF'}</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        {/* Share Button */}
        <button
          type="button"
          disabled={isExporting}
          onClick={shareCardImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
          <span>共有</span>
        </button>
      </div>

      {/* Card Rendering Box */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-perspective w-full flex items-center justify-center py-2 min-h-[480px] sm:min-h-[600px] overflow-hidden"
        style={{
          perspective: 1200,
        }}
      >
        <div
          className="scale-[0.80] min-[400px]:scale-[0.88] sm:scale-100 origin-center transition-transform shrink-0"
          style={{
            transform: is3DMode
              ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
              : undefined,
            transformStyle: 'preserve-3d',
            transition: is3DMode ? 'transform 0.08s ease-out' : 'transform 0.3s ease',
          }}
        >
          {card.kind === 'pokemon' ? (
            <PokemonCard card={card} />
          ) : (
            <TrainerCard card={card} />
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center max-w-sm">
        💡 「共有」をクリックすると、作成したカード画像をSNSやメッセージアプリへ直接共有できます。
      </div>
    </div>
  );
};
