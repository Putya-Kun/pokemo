import React, { useRef, useState } from 'react';
import { CardData } from '../types';
import { PokemonCard } from './PokemonCard';
import { TrainerCard } from './TrainerCard';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Share2, Printer, RefreshCw, Layers, Download, X } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  onSaveToGallery?: () => void;
  onUpdateCard?: (updated: Partial<CardData>) => void;
}

export const CardPreview: React.FC<CardPreviewProps> = React.memo(({ card, onUpdateCard }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mobileShareModalUrl, setMobileShareModalUrl] = useState<string | null>(null);

  // Direct drag/swipe image position adjustment state
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);

  const isMobile = typeof window !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
  );

  // 3D Tilt handler
  const handle3DTilt = (clientX: number, clientY: number) => {
    if (!is3DMode || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 18;
    const rotateX = -(y / (rect.height / 2)) * 18;
    setRotation({ x: rotateX, y: rotateY });
  };

  // Drag start (Mouse down / Touch start)
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (is3DMode || !card.imageUrl || !onUpdateCard) return;
    setIsDraggingImage(true);
    dragStartRef.current = {
      clientX,
      clientY,
      posX: card.imagePositionX || 0,
      posY: card.imagePositionY || 0,
    };
  };

  // Drag move (Mouse move / Touch move)
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (is3DMode) {
      handle3DTilt(clientX, clientY);
      return;
    }

    if (isDraggingImage && dragStartRef.current && onUpdateCard && card.imageUrl) {
      const deltaX = clientX - dragStartRef.current.clientX;
      const deltaY = clientY - dragStartRef.current.clientY;

      // Sensitivity factor: 1px movement ≈ 0.35 unit position change
      const sensitivity = 0.35;
      const nextX = Math.min(50, Math.max(-50, Math.round(dragStartRef.current.posX + deltaX * sensitivity)));
      const nextY = Math.min(50, Math.max(-50, Math.round(dragStartRef.current.posY + deltaY * sensitivity)));

      onUpdateCard({
        imagePositionX: nextX,
        imagePositionY: nextY,
      });
    }
  };

  // Drag end (Mouse up / Touch end / Leave)
  const handlePointerUp = () => {
    setIsDraggingImage(false);
    dragStartRef.current = null;
    if (is3DMode) {
      setRotation({ x: 0, y: 0 });
    }
  };

  // 1. Mobile Native Share Sheet (iOS / Android)
  const handleMobileShare = async (dataUrl: string, filename: string) => {
    let shareHandled = false;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: card.name || 'ポケモンカード',
          text: `「${card.name || 'オリジナルカード'}」を作成しました！`,
          files: [file],
        });
        shareHandled = true;
      } else if (navigator.share) {
        await navigator.share({
          title: card.name || 'ポケモンカード',
          text: `「${card.name || 'オリジナルカード'}」を作成しました！`,
          url: window.location.href,
        });
        shareHandled = true;
      }
    } catch (shareErr) {
      if ((shareErr as Error)?.name === 'AbortError') {
        // User closed the native share sheet
        shareHandled = true;
      } else {
        console.warn('Native share failed (e.g. iframe restriction), opening mobile preview overlay:', shareErr);
      }
    }

    // If native share was blocked by browser/iframe policy, open mobile modal with image
    if (!shareHandled) {
      setMobileShareModalUrl(dataUrl);
    }
  };

  // 2. PC Dedicated Print View (window.print())
  const handlePCPrintView = (dataUrl: string) => {
    const printWindow = window.open('', '_blank');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <title>${card.name || 'ポケモンカード'} - 印刷</title>
          <style>
            @media print {
              body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
              .no-print { display: none !important; }
              .card-box { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
              .print-card { box-shadow: none !important; margin: 0 !important; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 24px 16px;
              background: #ffffff;
              color: #0f172a;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .card-box {
              background: #ffffff;
              border: none;
              padding: 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
              max-width: 420px;
              width: 100%;
            }
            .print-card {
              width: 63mm;
              height: 88mm;
              object-fit: contain;
              border-radius: 3.5mm;
              box-shadow: 0 4px 12px rgba(0,0,0,0.12);
              background: white;
            }
            .btn-group {
              display: flex;
              gap: 12px;
              width: 100%;
              justify-content: center;
            }
            .btn {
              padding: 10px 20px;
              border-radius: 10px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              border: none;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              transition: all 0.2s;
            }
            .btn-print { background: #2563eb; color: white; }
            .btn-print:hover { background: #1d4ed8; }
            .btn-close { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
            .btn-close:hover { background: #e2e8f0; }
            .hint { font-size: 12px; color: #64748b; text-align: center; margin: 0; }
          </style>
        </head>
        <body>
          <div class="card-box">
            <h2 class="no-print" style="margin:0; font-size:18px; font-weight:800;">🎴 ポケモンカード 印刷</h2>
            <img src="${dataUrl}" class="print-card" alt="カード印刷プレビュー" />
            <div class="btn-group no-print">
              <button class="btn btn-print" onclick="window.print()">🖨️ 今すぐ印刷する</button>
              <button class="btn btn-close" onclick="window.close()">閉じる</button>
            </div>
            <p class="hint no-print">※ 実物規格サイズ (63mm × 88mm) に合わせて配置されています</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback if popup blocker enabled
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.write(htmlContent);
        doc.close();
      }
    }
  };

  const captureCardImage = async (cardElement: HTMLElement): Promise<string> => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Try toPng (html-to-image) first with skipFonts: true to prevent cross-origin stylesheet errors
    try {
      return await toPng(cardElement, {
        pixelRatio: 3,
        quality: 0.98,
        cacheBust: true,
        skipFonts: true,
      });
    } catch (toPngErr) {
      console.warn('toPng failed, falling back to html2canvas:', toPngErr);
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      return canvas.toDataURL('image/png', 1.0);
    }
  };

  const handleExport = async () => {
    const cardElement = document.getElementById('pokemon-card-canvas');
    if (!cardElement) return;

    try {
      setIsExporting(true);
      const prevRotation = { ...rotation };
      setRotation({ x: 0, y: 0 });

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await captureCardImage(cardElement);
      const filename = `${card.name || 'pokemon_card'}_${card.kind}_${Date.now()}.png`;

      if (isMobile) {
        await handleMobileShare(dataUrl, filename);
      } else {
        handlePCPrintView(dataUrl);
      }

      setRotation(prevRotation);
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('画像の処理中にエラーが発生しました。別のブラウザでお試しください。');
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

        {/* Action Button (Mobile: 共有 | PC: 印刷) */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : isMobile ? (
            <Share2 className="w-3.5 h-3.5" />
          ) : (
            <Printer className="w-3.5 h-3.5" />
          )}
          <span>{isMobile ? '共有' : '印刷'}</span>
        </button>
      </div>

      {/* Card Rendering Box */}
      <div
        ref={cardRef}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
        className={`card-perspective w-full flex items-center justify-center py-2 min-h-[480px] sm:min-h-[600px] overflow-hidden select-none ${
          is3DMode
            ? 'touch-none cursor-grab active:cursor-grabbing'
            : card.imageUrl
            ? 'touch-none cursor-move active:cursor-grabbing'
            : ''
        }`}
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
        {isMobile ? (
          <>💡 「共有」をタップすると、iOS/Androidの標準共有画面が開き画像やメッセージを共有できます。</>
        ) : (
          <>💡 「印刷」をクリックすると、実際のカードサイズ (63mm×88mm) で印刷画面が開きます。</>
        )}
      </div>

      {/* Mobile Share Fallback Modal (Used if iframe prevents native share sheet) */}
      {mobileShareModalUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full flex flex-col items-center gap-4 text-center shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-slate-100">カード画像プレビュー</span>
              <button
                type="button"
                onClick={() => setMobileShareModalUrl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={mobileShareModalUrl}
              alt="カード画像"
              className="w-full h-auto rounded-xl shadow-lg border border-slate-700/60"
            />
            <p className="text-xs text-amber-300 font-medium leading-relaxed">
              画像を長押しすると「写真に追加」や「共有」メニューが表示されます 📲
            </p>
            <div className="flex gap-2 w-full">
              <a
                href={mobileShareModalUrl}
                download={`${card.name || 'pokemon_card'}.png`}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                画像ダウンロード
              </a>
              <button
                type="button"
                onClick={() => setMobileShareModalUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
