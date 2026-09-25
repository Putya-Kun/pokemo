import React from 'react';
import { TrainerCardData } from '../types';
import { TRAINER_CATEGORY_CONFIG } from '../constants/cardData';
import { TRAINER_BACKGROUND_TEXTURES, getFrameUrl } from '../constants/energyImages';

// =========================================================================
// 【トレーナーズカード描画カスタム調整定数 (コードから直接調整可能)】
// =========================================================================
export const TRAINER_CARD_LAYOUT_CONFIG = {
  // -------------------------------------------------------------------------
  // 【1. 通常仕様（ノーマル）のイラスト表示枠設定】
  // -------------------------------------------------------------------------
  IMAGE_TOP: '14.2%',    // 画像の上の位置 (初期値: 14.2%)
  IMAGE_LEFT: '8.5%',   // 画像の左の位置 (初期値: 8.5%)
  IMAGE_WIDTH: '84.7%',  // 画像の横幅 (初期値: 84.7%)
  IMAGE_HEIGHT: '38.3%', // 画像の高さ (初期値: 38.3%)

  // -------------------------------------------------------------------------
  // 【2. フルアート仕様のイラスト表示領域設定 (745x1040 / 最大全体表示)】
  // ※ フルアート時の画像の表示範囲や余白を微調整したい場合はここを変更してください
  // -------------------------------------------------------------------------
  FULLART_IMAGE_TOP: '0%',      // 上の位置 (0% でカード最上部まで最大化)
  FULLART_IMAGE_LEFT: '0%',     // 左の位置 (0% でカード最左部まで最大化)
  FULLART_IMAGE_WIDTH: '115%',  // 横幅 (100% でカード横幅最大まで)
  FULLART_IMAGE_HEIGHT: '120%', // 高さ (100% でカード下部最大まで)
  FULLART_OBJECT_FIT: 'cover' as const, // 画像のフィット方法 ('cover' | 'contain')

  // 効果テキストエリア設定 (背景画像にテキスト枠があるためデフォルトで余分な図形枠を非表示)
  TEXT_BOX_SHOW_BORDER: false, // trueにすると白い四角形枠を描画、falseで背景画像枠の上に直書き
  TEXT_BOX_TOP: '58.5%',       // 効果テキストエリアの上の位置
  TEXT_BOX_HEIGHT: '29.5%',    // 効果テキストエリアの高さ

  // イラストレーター名の上下位置オフセット (px, プラスで下移動)
  ILLUSTRATOR_OFFSET_Y: 10,

  // セット情報行（レギュレーション・シンボル・番号・レアリティ）の上下位置オフセット (px, プラスで下移動)
  SET_INFO_OFFSET_Y: 10,

  // プロダクト表示（コピーライト著作権表示）の上下オフセット (px, キャラクターカード COPYRIGHT_OFFSET_Y と完全一致)
  COPYRIGHT_OFFSET_Y: 3,

  // -------------------------------------------------------------------------
  // 【カード名（タイトル）位置・スタイル設定】
  // -------------------------------------------------------------------------
  TITLE_OFFSET_Y: -15,           // タイトルの上下位置 (px, マイナスで上移動、プラスで下移動)
  TITLE_OFFSET_X: -2.0,             // タイトルの左右位置 (px, プラスで右移動、マイナスで左移動)
  TITLE_FONT_SIZE: 28,           // タイトルの文字サイズ (px)
  TITLE_LETTER_SPACING: '-0.22em', // タイトルの文字間隔 (キャラクターカードと同じ -0.22em)
  TITLE_SHOW_BORDER: false,      // タイトル下の下線ボーダーを描画するか (true / false)

  // -------------------------------------------------------------------------
  // 【効果テキスト（本文）位置・スタイル設定】
  // -------------------------------------------------------------------------
  EFFECT_TEXT_OFFSET_Y: 11,       // 効果テキストの上下位置 (px, プラスで下移動、マイナスで上移動)
  EFFECT_TEXT_OFFSET_X: -5,       // 効果テキストの左右位置 (px, プラスで右移動、マイナスで左移動)
  EFFECT_TEXT_FONT_SIZE: 12.5,   // 効果テキストの文字サイズ (px)
  EFFECT_TEXT_LINE_HEIGHT: 1.55, // 効果テキストの行間 (倍率)

  // -------------------------------------------------------------------------
  // 【ルール説明テキスト設定】
  // -------------------------------------------------------------------------
  RULE_TEXT_FONT_SIZE: 8.5,      // ルール説明の文字サイズ (px)
  RULE_TEXT_LINE_GAP_PX: 5,      // ルール説明の行と行の間の隙間 (px) ※初期値 2px
  RULE_TEXT_ALIGN: 'left' as const, // 配置 ('left' | 'center' | 'right')

  // カテゴリ別の上下位置 (px, プラスで下移動、マイナスで上移動)
  RULE_TEXT_OFFSET_Y_BY_CATEGORY: {
    supporter: 41,               // サポート (1行)
    item: 41,                    // グッズ (1行)
    stadium: 54,                 // スタジアム (3行) ※下に下げて配置
    tool: 54,                    // ポケモンのどうぐ (3行) ※下に下げて配置
  },

  // カテゴリ別の左右位置 (px, プラスで右移動、マイナスで左移動)
  RULE_TEXT_OFFSET_X_BY_CATEGORY: {
    supporter: 130,              // サポート
    item: 130,                   // グッズ
    stadium: 130,                // スタジアム
    tool: 130,                   // ポケモンのどうぐ
  },
};

interface TrainerCardProps {
  card: TrainerCardData;
}

const TRAINER_OVERLAY_IMAGES: Record<string, string> = {
  supporter: 'assets/trainer/support.png',
  item: 'assets/trainer/goods.png',
  stadium: 'assets/trainer/studium.png',
  tool: 'assets/trainer/pokedougu.png',
};

export const TrainerCard: React.FC<TrainerCardProps> = React.memo(({ card }) => {
  const catConfig = TRAINER_CATEGORY_CONFIG[card.category] || TRAINER_CATEGORY_CONFIG.item;
  const isAceSpec = card.category === 'ace_spec';
  const selectedFrame = card.selectedFrame || 'normal';
  const isGoldFrame = selectedFrame === 'gold';
  const frameUrl = getFrameUrl(selectedFrame);
  const trainerBgUrl = TRAINER_BACKGROUND_TEXTURES[card.category] || 'assets/back/basic-normal.png';
  const overlayImageUrl = TRAINER_OVERLAY_IMAGES[card.category];
  const trainerHeaderUrl = isGoldFrame
    ? 'assets/trainer/trainer-header-gold.webp'
    : card.isFullArt
    ? 'assets/trainer/trainer-header-full-art.webp'
    : 'assets/trainer/trainer-header.webp';

  // 【フルアート時の効果テキスト用：白縁取り（ポケモンカードと同等仕様）】
  const textOutlineStyle: React.CSSProperties = {
    WebkitTextStroke: '0.9px #ffffff',
    paintOrder: 'stroke fill',
    textShadow:
      '1px 1px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 0 0 1.5px #ffffff',
  };

  return (
    <div
      id="pokemon-card-canvas"
      className="relative w-[420px] h-[586px] rounded-[22px] shadow-2xl overflow-hidden select-none font-mplus text-slate-900 shrink-0"
      style={{
        background: isAceSpec
          ? 'linear-gradient(135deg, #ec4899 0%, #db2777 40%, #be185d 70%, #9d174d 100%)'
          : card.foilEffect === 'gold'
          ? 'linear-gradient(135deg, #fef08a 0%, #ca8a04 40%, #eab308 70%, #fef9c3 100%)'
          : `linear-gradient(160deg, ${catConfig.color} 0%, #cbd5e1 35%, #94a3b8 70%, ${catConfig.bannerColor} 100%)`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
      }}
    >
      {/* 1. ARTWORK LAYER (Lowest priority z-1: Spans full canvas without tight box clipping, sitting strictly BEHIND background, frames & text) */}
      <div 
        className="absolute z-1 pointer-events-none overflow-hidden"
        style={
          card.isFullArt
            ? {
                top: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_TOP,
                left: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_LEFT,
                width: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_WIDTH,
                height: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_HEIGHT,
              }
            : {
                inset: 0,
              }
        }
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full"
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${card.imageScale}) translate(${card.imagePositionX}%, ${card.imagePositionY}%)`,
              objectFit: card.isFullArt ? TRAINER_CARD_LAYOUT_CONFIG.FULLART_OBJECT_FIT : card.imageFit,
            }}
          />
        ) : (
          <div 
            className="absolute flex flex-col items-center justify-center bg-slate-800/80 text-slate-300 text-xs rounded-lg border border-dashed border-slate-600 pointer-events-auto"
            style={
              card.isFullArt
                ? {
                    top: '15%',
                    left: '10%',
                    width: '80%',
                    height: '70%',
                  }
                : {
                    top: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_TOP,
                    left: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_LEFT,
                    width: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_WIDTH,
                    height: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_HEIGHT,
                  }
            }
          >
            <span>画像が設定されていません</span>
          </div>
        )}
      </div>

      {/* 2. Background Texture Layer from assets/back/ (z-10: Hidden when Full Art is ON) */}
      {!card.isFullArt && trainerBgUrl && (
        <img
          src={trainerBgUrl}
          alt="Trainer Card Background"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 select-none"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}

      {/* 2b. Full Art Stripes Overlay Layer (z-10: assets/trainer/trainer-supporter-stripes.webp on top of full-bleed artwork) */}
      {card.isFullArt && (
        <img
          src="assets/trainer/trainer-supporter-stripes.webp"
          alt="Trainer Full Art Stripes Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 select-none"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}

      {/* 3. Frame Texture Layer from assets/frame/ (exact card size overlay) */}
      {frameUrl && (
        <img
          src={frameUrl}
          alt="Card Frame Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30 select-none"
          loading="eager"
          decoding="sync"
        />
      )}

      {/* 3.1 Trainer Header Overlay Layer (z-39: assets/trainer/trainer-header-gold.webp for gold frame, assets/trainer/trainer-header-full-art.webp for full art, assets/trainer/trainer-header.webp otherwise) */}
      <img
        src={trainerHeaderUrl}
        alt="Trainer Header Overlay"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-39 select-none"
        loading="eager"
        decoding="sync"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* 3.1b Full Art Supporter Rule Overlay (z-39: assets/trainer/trainer-supporter-rule.webp when Full Art is ON) */}
      {card.isFullArt && (
        <img
          src="assets/trainer/trainer-supporter-rule.webp"
          alt="Trainer Full Art Supporter Rule Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-39 select-none"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}

      {/* 3.2 Trainer Category Overlay Image Layer (z-41: Left top category overlay from assets/other/) */}
      {overlayImageUrl && (
        <img
          src={overlayImageUrl}
          alt="Trainer Category Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-41 select-none"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}

      {/* 3.3 Visual Effects Layer (z-43: Multi-layer effects from assets/visualeffect/ on top of category & header, below character name & text) */}
      {card.visualEffects && card.visualEffects.length > 0 && (
        <>
          {card.visualEffects.map((fxUrl, idx) => (
            <img
              key={`${fxUrl}-${idx}`}
              src={fxUrl}
              alt={`Visual Effect ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-43 select-none"
              loading="eager"
              decoding="sync"
            />
          ))}
        </>
      )}

      {/* 4. Interactive Image Drag Handle (枠の中だけを選択してスライド・移動できるようにする) */}
      {card.imageUrl && (
        <div
          data-image-drag-handle="true"
          className="absolute z-48 cursor-move touch-none"
          title="ドラッグまたはスワイプで画像位置を調整できます"
          style={
            card.isFullArt
              ? {
                  top: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_TOP,
                  left: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_LEFT,
                  width: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_WIDTH,
                  height: TRAINER_CARD_LAYOUT_CONFIG.FULLART_IMAGE_HEIGHT,
                }
              : {
                  top: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_TOP,
                  left: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_LEFT,
                  width: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_WIDTH,
                  height: TRAINER_CARD_LAYOUT_CONFIG.IMAGE_HEIGHT,
                }
          }
        />
      )}

      {/* 5. Main Card Content Layer (z-50: Character name, category bar, rule text, effect text, footer) */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-50 select-none">
        
        {/* TOP CATEGORY BAR (トレーナーズ / サポート / グッズ / スタジアム / どうぐ) - Hide when overlay image is present */}
        {!overlayImageUrl && (
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
          </div>
        )}

        {/* TRAINER CARD NAME HEADER */}
        <div 
          className={`absolute flex items-center justify-start pb-0.5 overflow-visible transition-transform ${
            TRAINER_CARD_LAYOUT_CONFIG.TITLE_SHOW_BORDER ? 'border-b border-slate-400/80' : ''
          }`}
          style={{
            top: '9.8%',
            left: '6.44%',
            width: '87.12%',
            height: '6.0%',
            transform: `translate(${(card.titleOffsetX ?? 0) + TRAINER_CARD_LAYOUT_CONFIG.TITLE_OFFSET_X}px, ${TRAINER_CARD_LAYOUT_CONFIG.TITLE_OFFSET_Y}px)`,
          }}
        >
          <h1 
            data-text-stroke={card.isFullArt ? 'true' : undefined}
            className={`font-matter font-black leading-none text-slate-950 inline-block pr-3 overflow-visible whitespace-nowrap ${
              card.isFullArt ? 'card-text-stroke' : ''
            }`}
            style={{
              fontSize: `${TRAINER_CARD_LAYOUT_CONFIG.TITLE_FONT_SIZE}px`,
              letterSpacing: TRAINER_CARD_LAYOUT_CONFIG.TITLE_LETTER_SPACING,
              fontWeight: 900,
              ...(card.isFullArt ? textOutlineStyle : {}),
            }}
          >
            {card.name || 'カード名'}
          </h1>
        </div>

        {/* EFFECT TEXT BOX (トレーナーズカードの効果説明 - 完全透明・スクロールなし) */}
        <div
          className={`absolute p-3 flex flex-col justify-between overflow-visible z-20 ${
            TRAINER_CARD_LAYOUT_CONFIG.TEXT_BOX_SHOW_BORDER
              ? 'bg-white/95 border border-slate-300/90 shadow-sm rounded-[9px]'
              : 'bg-transparent border-none shadow-none'
          }`}
          style={{
            top: card.isFullArt ? '60.0%' : TRAINER_CARD_LAYOUT_CONFIG.TEXT_BOX_TOP,
            left: '6.44%',
            width: '87.12%',
            height: card.isFullArt ? '28.0%' : TRAINER_CARD_LAYOUT_CONFIG.TEXT_BOX_HEIGHT,
          }}
        >
          {/* Main Effect Text (スクロールなし) */}
          <div className="flex-1 overflow-visible pr-0.5">
            <p 
              data-text-stroke={card.isFullArt ? 'true' : undefined}
              className={`font-medium whitespace-pre-line text-slate-950 ${
                card.isFullArt ? 'card-text-stroke' : ''
              }`}
              style={{
                fontSize: `${TRAINER_CARD_LAYOUT_CONFIG.EFFECT_TEXT_FONT_SIZE}px`,
                lineHeight: TRAINER_CARD_LAYOUT_CONFIG.EFFECT_TEXT_LINE_HEIGHT,
                transform: `translate(${TRAINER_CARD_LAYOUT_CONFIG.EFFECT_TEXT_OFFSET_X}px, ${TRAINER_CARD_LAYOUT_CONFIG.EFFECT_TEXT_OFFSET_Y}px)`,
                ...(card.isFullArt ? textOutlineStyle : {}),
              }}
            >
              {card.effectText || 'トレーナーズカードの効果テキストを入力してください。'}
            </p>
          </div>

          {/* Bottom Category Rule Box */}
          <div 
            data-text-stroke={card.isFullArt ? 'true' : undefined}
            className={`mt-1 pt-1 font-semibold text-slate-800 relative whitespace-pre-line ${
              card.isFullArt ? 'card-text-stroke' : ''
            }`}
            style={{
              fontSize: `${TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_FONT_SIZE}px`,
              lineHeight: `${TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_FONT_SIZE + TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_LINE_GAP_PX}px`,
              textAlign: TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_ALIGN,
              transform: `translate(${
                TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_OFFSET_X_BY_CATEGORY[card.category as keyof typeof TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_OFFSET_X_BY_CATEGORY] ?? 130
              }px, ${
                TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_OFFSET_Y_BY_CATEGORY[card.category as keyof typeof TRAINER_CARD_LAYOUT_CONFIG.RULE_TEXT_OFFSET_Y_BY_CATEGORY] ?? 41
              }px)`,
              ...(card.isFullArt ? textOutlineStyle : {}),
            }}
          >
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
              <span 
                data-text-stroke={card.isFullArt ? 'true' : undefined}
                className={`font-bold italic text-[8.5px] text-slate-800 leading-tight inline-block ${
                  card.isFullArt ? 'card-text-stroke' : ''
                }`}
                style={{
                  transform: `translateY(${TRAINER_CARD_LAYOUT_CONFIG.ILLUSTRATOR_OFFSET_Y}px)`,
                  ...(card.isFullArt ? textOutlineStyle : {}),
                }}
              >
                Illus.{card.illustrator || 'Hiro Iwai'}
              </span>
              <div 
                className="flex items-center gap-1 text-[8px]"
                style={{
                  transform: `translateY(${TRAINER_CARD_LAYOUT_CONFIG.SET_INFO_OFFSET_Y}px)`,
                }}
              >
                {/* 左：レギュレーションマーク（白地＋黒枠の細長い縦長角丸四角形） */}
                <span
                  className="inline-flex items-center justify-center w-[10.8px] h-[15px] bg-white text-black text-[8.5px] font-black rounded-[2px] border border-black leading-none select-none shrink-0"
                >
                  {card.regulationMark || 'G'}
                </span>

                {/* 右：セットシンボル（黒地＋白縁取り＋黒外枠の角丸四角形） */}
                <span
                  data-set-symbol="true"
                  className="inline-flex items-center justify-center px-1.5 py-[0.5px] h-[15px] bg-black text-white text-[8px] font-black rounded-[3px] border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.85)] leading-none tracking-tight select-none not-italic"
                >
                  {card.setSymbol || 'sv1S'}
                </span>

                {/* カード番号（斜体・イタリック体） */}
                <span 
                  data-text-stroke={card.isFullArt ? 'true' : undefined}
                  className={`font-black italic text-[9.5px] text-slate-800 tracking-tight ml-1 ${
                    card.isFullArt ? 'card-text-stroke' : ''
                  }`}
                  style={{
                    ...(card.isFullArt ? textOutlineStyle : {}),
                  }}
                >
                  {card.cardNumber || '001/100'}
                </span>

                {/* レアリティ記号 */}
                <span 
                  data-text-stroke={card.isFullArt ? 'true' : undefined}
                  className={`font-black italic text-[9px] text-slate-900 ml-0.5 ${
                    card.isFullArt ? 'card-text-stroke' : ''
                  }`}
                  style={{
                    ...(card.isFullArt ? textOutlineStyle : {}),
                  }}
                >
                  {card.rarity || 'U'}
                </span>
              </div>
            </div>

            {/* Right: Copyright notice (キャラクターのほうと同じ座標・中央下部に配置) */}
            <div 
              data-text-stroke="true"
              className="absolute left-0 right-0 text-center text-[7px] font-medium text-slate-600 tracking-tight pointer-events-none select-none card-text-stroke"
              style={{
                bottom: '-17.6px',
                transform: `translateY(${TRAINER_CARD_LAYOUT_CONFIG.COPYRIGHT_OFFSET_Y}px)`,
              }}
            >
              <div>©2026 Pokémon/Nintendo/Creatures/GAME FREAK.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});
