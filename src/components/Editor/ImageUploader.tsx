import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, ZoomIn, Move } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  imageFit: 'cover' | 'contain';
  onUpdate: (data: {
    imageUrl?: string;
    imageScale?: number;
    imagePositionX?: number;
    imagePositionY?: number;
    imageFit?: 'cover' | 'contain';
  }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  imageScale,
  imagePositionX,
  imagePositionY,
  imageFit,
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
            imageScale: 1.0,
            imagePositionX: 0,
            imagePositionY: 0,
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
            imageScale: 1.0,
            imagePositionX: 0,
            imagePositionY: 0,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 hover:border-amber-400 bg-slate-800/60 hover:bg-slate-800/90 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
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



      {/* Image Position & Scale Controls */}
      {imageUrl && (
        <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              イラストの拡大・縮小
            </span>
            <span className="text-xs font-mono text-amber-400">
              {Math.round(imageScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={imageScale}
            onChange={(e) => onUpdate({ imageScale: parseFloat(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer"
          />

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Move className="w-3 h-3" /> 左右位置 (X)
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={imagePositionX}
                onChange={(e) => onUpdate({ imagePositionX: parseInt(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Move className="w-3 h-3" /> 上下位置 (Y)
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={imagePositionY}
                onChange={(e) => onUpdate({ imagePositionY: parseInt(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-700/60">
            <span className="text-[11px] text-slate-400">フィット形式</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ imageFit: 'cover' })}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  imageFit === 'cover'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                全体カバー
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ imageFit: 'contain' })}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  imageFit === 'contain'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                枠内に収める
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    imageScale: 1.0,
                    imagePositionX: 0,
                    imagePositionY: 0,
                  })
                }
                className="px-2 py-0.5 rounded text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
