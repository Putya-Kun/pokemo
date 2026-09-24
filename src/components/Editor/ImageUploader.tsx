import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, ZoomIn, Move } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string;
  onUpdate: (data: {
    imageUrl?: string;
  }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
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
    </div>
  );
};
