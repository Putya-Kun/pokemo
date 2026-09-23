import React, { useRef, useState, useEffect } from 'react';
import { CardData } from '../types';
import { PokemonCard } from './PokemonCard';
import { TrainerCard } from './TrainerCard';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Printer, RefreshCw, Layers, Share2 } from 'lucide-react';

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

  // Direct drag/swipe image position adjustment state
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);

  const isMobile = typeof window !== 'undefined' && (
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
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

  // 枠の中（イラスト枠）のタッチ・クリック判定
  const isInsideImageFrame = (clientX: number, clientY: number, target: EventTarget | null): boolean => {
    // 1. data-image-drag-handle 属性の要素またはその子孫であるかを判定
    if (target instanceof Element && target.closest('[data-image-drag-handle="true"]')) {
      return true;
    }

    // 2. 座標による判定（カード要素の枠内にあるか検証）
    const canvas = document.getElementById('pokemon-card-canvas');
    if (!canvas) return false;

    const rect = canvas.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    if (card.kind === 'trainer') {
      if (card.isFullArt) {
        return relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1;
      }
      // トレーナーズ枠: top 16.5%〜52.5%, left 6.4%〜93.5%
      return relX >= 0.05 && relX <= 0.95 && relY >= 0.15 && relY <= 0.54;
    } else {
      // ポケモンカード枠: top 10.0%〜48.0%, left 8.6%〜92.3%
      return relX >= 0.07 && relX <= 0.93 && relY >= 0.09 && relY <= 0.49;
    }
  };

  // Drag start (Mouse down / Touch start) - 枠の中が選択された場合のみ開始
  const handlePointerDown = (clientX: number, clientY: number, target: EventTarget | null) => {
    if (is3DMode || !card.imageUrl || !onUpdateCard) return;

    if (!isInsideImageFrame(clientX, clientY, target)) {
      return;
    }

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

  // ドラッグ操作中のウィンドウ全域トラッキング（ドラッグ中にマウスや指がカード外に出ても滑らかに追従）
  useEffect(() => {
    if (!isDraggingImage) return;

    const onGlobalMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if ('clientX' in e) {
        handlePointerMove((e as MouseEvent).clientX, (e as MouseEvent).clientY);
      }
    };

    const onGlobalUp = () => {
      handlePointerUp();
    };

    window.addEventListener('mousemove', onGlobalMove, { passive: true });
    window.addEventListener('mouseup', onGlobalUp);
    window.addEventListener('touchmove', onGlobalMove, { passive: true });
    window.addEventListener('touchend', onGlobalUp);
    window.addEventListener('touchcancel', onGlobalUp);

    return () => {
      window.removeEventListener('mousemove', onGlobalMove);
      window.removeEventListener('mouseup', onGlobalUp);
      window.removeEventListener('touchmove', onGlobalMove);
      window.removeEventListener('touchend', onGlobalUp);
      window.removeEventListener('touchcancel', onGlobalUp);
    };
  }, [isDraggingImage]);

  // Dedicated Print / Save Preview (window.print())
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
    // 1. Wait for web fonts if available
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 2. Wait for all <img> tags inside cardElement to finish loading/decoding
    const images = Array.from(cardElement.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 400);
        });
      })
    );

    // 3. Primary capture: toPng (html-to-image) with mobile-safe, robust options
    // Notice: cacheBust must be FALSE so base64 data URLs & blob URLs are not corrupted on mobile
    try {
      return await toPng(cardElement, {
        pixelRatio: 2, // 2x retina (840x1172), fits mobile Safari memory limits safely
        quality: 0.98,
        cacheBust: false,
        skipFonts: true,
        fontEmbedCSS: '',
        width: 420,
        height: 586,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          margin: '0',
        },
        filter: (node: HTMLElement) => {
          // Skip external stylesheet links to avoid SecurityError on iOS Safari
          if (node.tagName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet') {
            return false;
          }
          return true;
        },
      });
    } catch (toPngErr) {
      console.warn('toPng failed, falling back to html2canvas:', toPngErr);
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 420,
        height: 586,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('pokemon-card-canvas');
          if (el) {
            el.style.transform = 'none';
          }
        },
      });
      return canvas.toDataURL('image/png', 1.0);
    }
  };

  const handleExport = async () => {
    const cardElement = document.getElementById('pokemon-card-canvas');
    if (!cardElement) return;

    let dataUrl = '';
    try {
      setIsExporting(true);
      const prevRotation = { ...rotation };
      setRotation({ x: 0, y: 0 });

      // Small delay to ensure rotation reset has rendered
      await new Promise((resolve) => setTimeout(resolve, 120));

      dataUrl = await captureCardImage(cardElement);

      if (isMobile) {
        // iOS / Android: Open native share sheet with the captured PNG
        const filename = `${card.name || 'pokemon_card'}_${Date.now()}.png`;
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });

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
          handlePCPrintView(dataUrl);
        }
      } else {
        // PC: Open print/save preview
        handlePCPrintView(dataUrl);
      }

      setRotation(prevRotation);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        // User cancelled native share sheet
      } else {
        console.warn('Share failed, opening fallback preview:', err);
        if (dataUrl) {
          handlePCPrintView(dataUrl);
        } else {
          alert('画像の処理中にエラーが発生しました。別のブラウザでお試しください。');
        }
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

        {/* ボタン (iOS/Android: 共有 | PC: 保存) - 青色 */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
          title={isMobile ? '共有メニューを開きます' : 'カードの保存・印刷プレビュー画面を開きます'}
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : isMobile ? (
            <Share2 className="w-3.5 h-3.5" />
          ) : (
            <Printer className="w-3.5 h-3.5" />
          )}
          <span>{isMobile ? '共有' : '保存'}</span>
        </button>
      </div>

      {/* Card Rendering Box */}
      <div
        ref={cardRef}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY, e.target)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
        className={`card-perspective w-full flex items-center justify-center py-2 min-h-[480px] sm:min-h-[600px] overflow-hidden select-none ${
          is3DMode ? 'touch-none cursor-grab active:cursor-grabbing' : ''
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
          <>💡 「共有」をタップすると共有メニューが開き、端末の写真への追加や共有ができます。</>
        ) : (
          <>💡 「保存」をクリックするとプレビュー画面が開き、実寸(63mm×88mm)での印刷や画像保存が可能です。</>
        )}
      </div>
    </div>
  );
});
