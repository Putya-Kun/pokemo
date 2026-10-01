import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, ZoomIn, Move, RotateCcw, Sliders, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string;
  imageScale?: number;
  imagePositionX?: number;
  imagePositionY?: number;
  onUpdate: (data: {
    imageUrl?: string;
    imageScale?: number;
    imagePositionX?: number;
    imagePositionY?: number;
  }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  imageScale = 1.0,
  imagePositionX = 0,
  imagePositionY = 0,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if image is an uploaded file (Base64 data URL or blob)
  const isUploadedFile = imageUrl.startsWith('data:') || imageUrl.startsWith('blob:');
  // Display URL in text field only if it's a typed web link (http/https)
  const displayUrl = isUploadedFile ? '' : imageUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdate({
            imageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdate({
            imageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPosition = () => {
    onUpdate({
      imageScale: 1.0,
      imagePositionX: 0,
      imagePositionY: 0,
    });
  };

  return (
    <div className="space-y-5">
      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 hover:border-amber-400 bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group shadow-sm"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="p-2.5 rounded-full bg-slate-700 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-400 transition-colors">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-200 block">
            イラスト画像をアップロード
          </span>
          <span className="text-[11px] text-slate-400">
            ドラッグ＆ドロップ または クリックして選択 (PNG/JPG/WebP)
          </span>
        </div>
      </div>

      {/* Uploaded File Status Badge */}
      {isUploadedFile && (
        <div className="flex items-center justify-between bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 shadow-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            アップロード済みの画像を使用中
          </span>
          <button
            type="button"
            onClick={() => onUpdate({ imageUrl: '' })}
            className="text-slate-400 hover:text-rose-400 text-[11px] font-semibold underline cursor-pointer"
          >
            画像を削除
          </button>
        </div>
      )}

      {/* Direct Web URL Input */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          または Web上の画像URLを入力
        </label>
        <input
          type="text"
          value={displayUrl}
          onChange={(e) => onUpdate({ imageUrl: e.target.value })}
          placeholder="https://example.com/character.png"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Position & Scale Adjustments (Visible when an image is set) */}
      {imageUrl && (
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sliders className="w-4 h-4" />
              <span>画像の位置・拡大率の調整</span>
            </div>
            <button
              type="button"
              onClick={handleResetPosition}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              title="拡大率と位置を初期状態に戻します"
            >
              <RotateCcw className="w-3 h-3" />
              <span>初期値にリセット</span>
            </button>
          </div>

          {/* 1. Scale / Zoom slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>拡大率 (ズーム)</span>
              </label>
              <span className="font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded text-[11px] border border-cyan-800/40">
                {Math.round(imageScale * 100)}% ({imageScale.toFixed(2)}x)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-mono">0.3x</span>
              <input
                type="range"
                min="0.3"
                max="3.0"
                step="0.05"
                value={imageScale}
                onChange={(e) => onUpdate({ imageScale: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">3.0x</span>
            </div>
            {/* Quick scale presets */}
            <div className="flex items-center justify-between pt-1 gap-1.5">
              {[0.8, 1.0, 1.2, 1.5, 2.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onUpdate({ imageScale: preset })}
                  className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                    Math.abs(imageScale - preset) < 0.03
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {preset.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>

          {/* 2. X Position slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>X座標 (左右位置)</span>
              </label>
              <span className="font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] border border-emerald-800/40">
                {imagePositionX > 0 ? `+${imagePositionX}% (右)` : imagePositionX < 0 ? `${imagePositionX}% (左)` : '0% (中央)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-mono">-100%</span>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={imagePositionX}
                onChange={(e) => onUpdate({ imagePositionX: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">+100%</span>
            </div>
            <div className="flex items-center justify-between pt-1 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionX: Math.max(-100, imagePositionX - 5) })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                ◀ 左 (-5)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionX: 0 })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                中央 (0)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionX: Math.min(100, imagePositionX + 5) })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                右 (+5) ▶
              </button>
            </div>
          </div>

          {/* 3. Y Position slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Y座標 (上下位置)</span>
              </label>
              <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded text-[11px] border border-amber-800/40">
                {imagePositionY > 0 ? `+${imagePositionY}% (下)` : imagePositionY < 0 ? `${imagePositionY}% (上)` : '0% (中央)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-mono">-100%</span>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={imagePositionY}
                onChange={(e) => onUpdate({ imagePositionY: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">+100%</span>
            </div>
            <div className="flex items-center justify-between pt-1 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionY: Math.max(-100, imagePositionY - 5) })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                ▲ 上 (-5)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionY: 0 })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                中央 (0)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imagePositionY: Math.min(100, imagePositionY + 5) })}
                className="flex-1 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                下 (+5) ▼
              </button>
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
            <span className="text-amber-400 text-sm leading-none shrink-0 mt-0.5">💡</span>
            <div>
              カードプレビューのイラストを直接<strong>ドラッグ</strong>して位置を動かせます。
              スマホ・タブレットでは<strong>二本指でピンチ（広げる/縮める）</strong>して直感的に拡大・縮小も可能です。
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
