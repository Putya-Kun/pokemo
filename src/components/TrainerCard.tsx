import React from 'react';
import { TrainerCardData } from '../types';
import { TRAINER_CATEGORY_CONFIG } from '../constants/cardData';
import { TRAINER_BACKGROUND_TEXTURES, getFrameUrl } from '../constants/energyImages';

interface TrainerCardProps {
  card: TrainerCardData;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({ card }) => {
  const catConfig = TRAINER_CATEGORY_CONFIG[card.category] || TRAINER_CATEGORY_CONFIG.item;
  const isAceSpec = card.category === 'ace_spec';
  const frameUrl = getFrameUrl(card.selectedFrame);
  const trainerBgUrl = TRAINER_BACKGROUND_TEXTURES[card.category] || '/assets/back/basic-normal.png';

  return (
    <div
      id="pokemon-card-canvas"
      className="relative w-[420px] h-[586px] rounded-[22px] shadow-2xl overflow-hidden select-none font-mplus text-slate-900 transition-transform duration-200 shrink-0"
      style={{
        background: isAceSpec
          ? 'linear-gradient(135deg, #ec4899 0%, #db2777 40%, #be185d 70%, #9d174d 100%)'
          : card.foilEffect === 'gold'
          ? 'linear-gradient(135deg, #fef08a 0%, #ca8a04 40%, #eab308 70%, #fef9c3 100%)'
          : `linear-gradient(160deg, ${catConfig.color} 0%, #cbd5e1 35%, #94a3b8 70%, ${catConfig.bannerColor} 100%)`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
      }}
    >
      {/* Background Texture from assets/back/ (basic-normal.png) */}
      {trainerBgUrl && (
        <img
          src={trainerBgUrl}
          alt="Trainer Card Background"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 select-none"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}

      {/* Frame Texture Layer from assets/frame/ (exact card size overlay) */}
      {frameUrl && (
        <img
          src={frameUrl}
          alt="Card Frame Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30 select-none"
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Main Card Content Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-10 select-none">
        
        {/* TOP CATEGORY BAR (トレーナーズ / サポート / グッズ / スタジアム / どうぐ / ACE SPEC) */}
        <div 
          className="absolute flex items-center justify-between"
          style={{
            top: '4.8%',
            left: '6.44%',
            width: '87.12%',
            height: '4.8%',
          }}
        >
          {/* Category Banner Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-dela font-bold text-white shadow-sm flex items-center gap-1 tracking-wider leading-none"
              style={{ backgroundColor: catConfig.bannerColor }}
            >
              <span>TRAINER'S</span>
              <span className="opacity-75 text-[8px] font-normal">|</span>
              <span>{catConfig.jpName}</span>
            </span>
          </div>

          {/* Category Rule Subtext */}
          <div className="text-right max-w-[55%]">
            <span className="text-[8.5px] text-slate-800 font-semibold leading-tight line-clamp-1 block">
              {card.ruleText || catConfig.defaultRule}
            </span>
          </div>
        </div>

        {/* TRAINER CARD NAME HEADER */}
        <div 
          className="absolute flex items-center justify-between border-b border-slate-400/80 pb-0.5 transition-transform"
          style={{
            top: '9.8%',
            left: '6.44%',
            width: '87.12%',
            height: '6.0%',
            transform: `translateX(${card.titleOffsetX ?? 0}px)`,
          }}
        >
          <h1 className="font-zen font-black text-xl tracking-tight text-slate-950 truncate">
            {card.name || 'カード名'}
          </h1>

          {card.customCardTag && (
            <span className="bg-slate-900 text-amber-300 text-[9.5px] font-bold px-2 py-0.5 rounded shadow shrink-0">
              {card.customCardTag}
            </span>
          )}
        </div>

        {/* ILLUSTRATION AREA */}
        <div
          className={`absolute rounded-[8px] overflow-hidden border-[2.5px] border-slate-300/90 bg-slate-900 shadow-md ${
            card.isFullArt ? 'z-0' : 'z-10'
          }`}
          style={
            card.isFullArt
              ? {
                  top: '16.5%',
                  left: '6.44%',
                  width: '87.12%',
                  height: '73.0%',
                }
              : {
                  top: '16.5%',
                  left: '6.44%',
                  width: '87.12%',
                  height: '42.0%',
                }
          }
        >
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover transition-transform"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${card.imageScale}) translate(${card.imagePositionX}%, ${card.imagePositionY}%)`,
                objectFit: card.imageFit,
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs">
              <span>画像が設定されていません</span>
            </div>
          )}

          {/* Full-art badge if applicable */}
          {card.isFullArt && (
            <div className="absolute top-2 right-2 bg-slate-900/85 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/30 backdrop-blur-xs">
              FULL ART
            </div>
          )}

          {/* Artwork shine bevel */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),_inset_0_-1px_2px_rgba(255,255,255,0.4)]" />
        </div>

        {/* EFFECT TEXT BOX (トレーナーズカードの効果説明) */}
        <div
          className={`absolute rounded-[9px] border border-slate-300/90 shadow-sm p-3 flex flex-col justify-between overflow-hidden z-20 ${
            card.isFullArt
              ? 'bg-white/90 backdrop-blur-sm'
              : 'bg-white/95'
          }`}
          style={{
            top: card.isFullArt ? '60.0%' : '59.5%',
            left: '6.44%',
            width: '87.12%',
            height: card.isFullArt ? '28.0%' : '28.5%',
          }}
        >
          {/* Main Effect Text */}
          <div className="flex-1 overflow-y-auto pr-0.5">
            <p className="text-[12.5px] leading-[1.55] text-slate-950 font-medium whitespace-pre-line">
              {card.effectText || 'トレーナーズカードの効果テキストを入力してください。'}
            </p>

            {/* Sub Effect Text if specified */}
            {card.subEffectText && (
              <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10.5px] leading-[1.4] text-slate-700 font-normal">
                {card.subEffectText}
              </div>
            )}
          </div>

          {/* Bottom Category Rule Box */}
          <div className="mt-1 pt-1 border-t border-slate-200/80 text-[8.5px] text-slate-600 font-semibold text-center leading-tight">
            {card.ruleText || catConfig.defaultRule}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER METADATA (コレクター情報・レギュレーション・イラストレーター) */}
        {/* ============================================================ */}
        <div 
          className="absolute z-30"
          style={{
            bottom: '4.2%',
            left: '6.0%',
            width: '88.0%',
            height: '5.6%',
          }}
        >
          <div className="flex items-end justify-between gap-2 text-slate-800">
            {/* Left: Illustrator & Set info */}
            <div className="flex flex-col gap-0.5">
              <span className="font-bold italic text-[8.5px] text-slate-800 leading-tight">
                Illus.{card.illustrator || 'オリジナル'}
              </span>
              <div className="flex items-center gap-1 text-[8px]">
                {/* 左：レギュレーションマーク（白地＋黒枠の細長い縦長角丸四角形） */}
                <span
                  className="inline-flex items-center justify-center w-[10.8px] h-[15px] bg-white text-black text-[8.5px] font-black rounded-[2px] border border-black leading-none select-none shadow-[0_0.5px_1px_rgba(0,0,0,0.15)] shrink-0"
                >
                  {card.regulationMark || 'G'}
                </span>

                {/* 右：セットシンボル（黒地＋白縁取り＋黒外枠の角丸四角形） */}
                <span
                  className="inline-flex items-center justify-center px-1.5 py-[0.5px] h-[15px] bg-black text-white text-[8px] font-black rounded-[3px] border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.9)] leading-none tracking-tight select-none not-italic"
                >
                  {card.setSymbol || 'sv1S'}
                </span>

                {/* カード番号（斜体・イタリック体） */}
                <span className="font-black italic text-[9.5px] text-slate-800 tracking-tight ml-1">
                  {card.cardNumber || '001/100'}
                </span>

                {/* レアリティ記号 */}
                <span className="font-black italic text-[9px] text-slate-900 ml-0.5">
                  {card.rarity || 'U'}
                </span>
              </div>
            </div>

            {/* Right: Copyright notice */}
            <div className="text-[7.5px] font-medium text-slate-600 tracking-tighter text-right">
              <div>©2026 Pokémon/Nintendo/Creatures</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
