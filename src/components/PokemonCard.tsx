import React from 'react';
import { PokemonCardData } from '../types';
import { TYPE_CONFIG } from '../constants/cardData';
import { TYPE_BACKGROUND_TEXTURES, getFrameUrl } from '../constants/energyImages';
import { EnergyIcon } from './EnergyIcon';

// =========================================================================
// 【カード描画カスタム調整定数 (コードから調整可能)】
// コードからフォントサイズや位置を自由に調整できます
// =========================================================================
export const POKEMON_CARD_LAYOUT_CONFIG = {
  TITLE_OFFSET_X: 0,        // タイトル（名前）開始位置の左右オフセット (px)
  SUB_NAME_MARGIN_RIGHT: -14,  // サブキャラクター名とメイン名の間の間隔 (px, 小さく・マイナスにするとより狭くなります)
  SUB_NAME_FONT_SIZE: 18,    // サブキャラクター名のフォントサイズ (px)
  SUB_NAME_SCALE_X: 0.74,    // サブキャラクター名の横幅縮小倍率 (0.76 = 横幅を狭くしてスタイリッシュな細長字に設定)
  MOVE_NAME_OFFSET_X: 43,    // ワザ名の左右位置オフセット (px, プラスで右移動、マイナスで左移動)
  MOVE_ENERGY_OFFSET_X: -5,  // ワザのエネルギーアイコンの左右位置オフセット (px, マイナスで左移動、プラスで右移動)
  MOVE_ENERGY_GAP: 1.5,      // ワザの必要エネルギーアイコン同士の間隔 (px, 小さくすると狭くなります。例: 0〜4)
  RETREAT_ENERGY_GAP: 1.0,   // にげる必要エネルギーアイコン同士の間隔 (px, 小さくすると狭くなります。例: 0〜3)
  MOVE_DESC_OFFSET_X: -4,     // ワザ詳細（効果説明文）の左右位置オフセット (px, プラスで右移動、マイナスで左移動)
  MOVE_DESC_OFFSET_Y: 0,     // ワザ詳細（効果説明文）の上下位置オフセット (px, マイナスで上移動、プラスで下移動)
  MOVE_NAME_SCALE: 1.0,     // ワザ名のフォントサイズ倍率 (1.0 = 100%)
  ENERGY_ICON_SCALE: 1.15,  // ワザのエネルギーアイコン拡大倍率 (1.15 = 115%)
  MOVE_1_OFFSET_Y: -32,     // ワザが1つの時の上下位置オフセット (px, マイナスで上寄り)
  MOVE_2_OFFSET_Y: -28,     // ワザが2つの時の上下位置オフセット (px)
  MOVE_ABILITY_ON_OFFSET_Y: -10, // 特性がONの時のワザ1の上下位置オフセット (px, マイナスで上移動し特性との間隔を詰める)

  // -------------------------------------------------------------------------
  // 【特性（Ability）の位置・上下調整コード設定】
  // -------------------------------------------------------------------------
  ABILITY_TITLE_OFFSET_Y: -18.5,  // 特性タイトルの上下位置 (px, マイナスで上移動)
  ABILITY_TITLE_OFFSET_X: 102, // 特性タイトルの左右位置 (px, 左端からの距離)
  ABILITY_DESC_OFFSET_Y: -14,    // 特性詳細（効果説明文）の上下位置 (px, マイナスで上移動)
  ABILITY_DESC_OFFSET_X: -4,     // 特性詳細（効果説明文）の左右位置 (px, ワザ詳細 MOVE_DESC_OFFSET_X と完全に一致)

  // -------------------------------------------------------------------------
  // 【右上エネルギーアイコン調整コード設定】
  // -------------------------------------------------------------------------
  HEADER_ENERGY_BORDER_WIDTH: 3.1, // 右上エネルギーアイコンの白い縁取りの太さ (px, デフォルト2.8px)
  HEADER_ENERGY_SIZE: 31,          // 右上エネルギーアイコンのサイズ (px)

  // -------------------------------------------------------------------------
  // 【フッター・コピーライト位置調整コード設定】
  // -------------------------------------------------------------------------
  COPYRIGHT_OFFSET_Y: 3,           // コピーライト（著作権表示）の上下オフセット (px, プラスで下移動、マイナスで上移動)
  FOOTER_OFFSET_Y: 0,              // フッター全体（イラストレーター・図鑑説明文・コピーライト）の上下オフセット (px)

  // -------------------------------------------------------------------------
  // 【進化前テキスト設定 ("〇〇から進化")】
  // -------------------------------------------------------------------------
  EVOLVES_FROM_TOP: '8.4%',        // 上からの位置
  EVOLVES_FROM_LEFT: '14.8%',      // 左からの位置
  EVOLVES_FROM_FONT_SIZE: 8.5,     // 文字サイズ (px)
  EVOLVES_FROM_OFFSET_X: 21.5,        // 左右位置微調整 (px, プラスで右移動、マイナスで左移動)
  EVOLVES_FROM_OFFSET_Y: 8,        // 上下位置微調整 (px, プラスで下移動、マイナスで上移動)
  EVOLVES_FROM_LETTER_SPACING: '-0.05em', // 文字間隔

  // -------------------------------------------------------------------------
  // 【キャラクター名右横アイコン設定 (ex, GX, V等)】
  // -------------------------------------------------------------------------
  NAME_ICON_HEIGHT: 21,            // アイコンの高さ (px)
  NAME_ICON_OFFSET_X: -3,          // キャラクター名との左右間隔 (px, プラスで右、マイナスで左)
  NAME_ICON_OFFSET_Y: 2,        // 上下位置微調整 (px, プラスで下、マイナスで上)
};

// Stage image layer mapping (full-card scale overlay for existing assets)
const STAGE_OVERLAY_IMAGES: Record<string, string> = {
  'たね': 'assets/level/seed.png',
  '1進化': 'assets/level/stage1-grey.png',
  '2進化': 'assets/level/stage2-grey.png',
};

interface PokemonCardProps {
  card: PokemonCardData;
  tiltAngle?: { x: number; y: number };
  isInteractive?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({ card }) => {
  const typeMeta = TYPE_CONFIG[card.primaryType] || TYPE_CONFIG.colorless;
  const secondaryMeta = card.secondaryType ? TYPE_CONFIG[card.secondaryType] : null;
  const frameUrl = getFrameUrl(card.selectedFrame);

  const isTera = Boolean(card.customCardTag?.includes('テラスタル'));
  const isEx = card.suffix.toLowerCase() === 'ex';

  // 【全体の文字用：白縁取り（全タイプ共通）】
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
        background: isTera
          ? 'linear-gradient(145deg, #e0f2fe 0%, #bae6fd 25%, #fed7aa 50%, #fbcfe8 75%, #c7d2fe 100%)'
          : card.foilEffect === 'gold'
          ? 'linear-gradient(135deg, #fef08a 0%, #ca8a04 40%, #eab308 70%, #fef9c3 100%)'
          : `linear-gradient(160deg, ${typeMeta.accentColor} 0%, #cbd5e1 35%, #94a3b8 70%, ${typeMeta.primaryColor} 100%)`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
      }}
    >
      {/* 1. ARTWORK LAYER (Lowest priority z-1: Spans full canvas without tight box clipping, sitting strictly BEHIND background, frames & text) */}
      <div className="absolute inset-0 w-full h-full z-1 pointer-events-none flex items-center justify-center">
        {/* Card Image */}
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${card.imageScale}) translate(${card.imagePositionX}%, ${card.imagePositionY}%)`,
              objectFit: card.imageFit,
            }}
          />
        ) : (
          <div 
            className="absolute flex flex-col items-center justify-center bg-slate-800/80 text-slate-300 text-xs rounded-lg border border-dashed border-slate-600 pointer-events-auto"
            style={{
              top: '10.0%',
              left: '8.65%',
              width: '83.65%',
              height: '37.5%',
            }}
          >
            <span>画像が設定されていません</span>
          </div>
        )}
      </div>

      {/* 2. Background Texture Layer from assets/back/ (z-10) */}
      {TYPE_BACKGROUND_TEXTURES[card.primaryType] && (
        <img
          src={TYPE_BACKGROUND_TEXTURES[card.primaryType]}
          alt="Card Background"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 select-none"
          loading="eager"
          decoding="sync"
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

      {/* Ability Badge Overlay Layer (exact card size overlay from assets/other/349d5092_1.png when Ability is ON) */}
      {card.ability?.enabled && (
        <img
          src="assets/other/349d5092_1.png"
          alt="Ability Badge Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30 select-none"
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Stage Badge Overlay Layer (exact card size overlay at z-35 so it sits on top of artwork & frame) */}
      {STAGE_OVERLAY_IMAGES[card.stage] && (
        <img
          src={STAGE_OVERLAY_IMAGES[card.stage]}
          alt={`${card.stage} Overlay`}
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-35 select-none"
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Interactive Image Drag Handle (枠の中だけを選択してスライド・移動できるようにする) */}
      {card.imageUrl && (
        <div
          data-image-drag-handle="true"
          className="absolute z-45 cursor-move touch-none"
          title="ドラッグまたはスワイプで画像位置を調整できます"
          style={{
            top: '10.0%',
            left: '8.65%',
            width: '83.65%',
            height: '38.0%',
          }}
        />
      )}

      {/* Main Card Content Container with absolute coordinate alignment (z-40 so texts sit on top of frame overlays) */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-40 select-none">

        {/* TOP HEADER (Stage & Name) */}
        <div 
          className="absolute flex items-center justify-start px-1"
          style={{ top: '2.5%', left: '5.8%', right: '28.0%', height: '7.5%' }}
        >
          {/* Stage badge (たね / 1進化 / 2進化) */}
          <div className={`flex items-center gap-1 shrink-0 ${STAGE_OVERLAY_IMAGES[card.stage] ? 'invisible' : ''}`}>
            <div
              className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-black text-white shadow-xs flex items-center gap-1 tracking-wider"
              style={{
                backgroundColor: isTera ? '#0284c7' : typeMeta.badgeBg,
              }}
            >
              <span>{card.stage}</span>
            </div>
          </div>

          {/* Name & Sub-character Name */}
          <div 
            className="flex-1 px-2 flex items-baseline justify-start gap-1 overflow-visible transition-transform"
            style={{
              transform: `translateX(${card.titleOffsetX ?? POKEMON_CARD_LAYOUT_CONFIG.TITLE_OFFSET_X}px)`,
              marginLeft: '8px',
            }}
          >
            {/* Sub-character Name (Positioned on the LEFT of main name, condensed) */}
            {card.suffix && (
              <span
                data-text-stroke="true"
                className="font-matter font-black leading-none shrink-0 inline-block text-slate-950 card-text-stroke"
                style={{
                  fontSize: `${POKEMON_CARD_LAYOUT_CONFIG.SUB_NAME_FONT_SIZE}px`,
                  marginRight: `${POKEMON_CARD_LAYOUT_CONFIG.SUB_NAME_MARGIN_RIGHT}px`,
                  fontWeight: 900,
                  letterSpacing: '-0.15em',
                  transform: `scaleX(${POKEMON_CARD_LAYOUT_CONFIG.SUB_NAME_SCALE_X})`,
                  transformOrigin: 'left center',
                  ...textOutlineStyle,
                }}
              >
                {card.suffix}
              </span>
            )}

            {/* Main Character Name */}
            <h1 
              data-text-stroke="thick"
              className="font-matter font-black text-[28px] leading-none shrink-0 inline-block pr-2 text-slate-950 card-text-stroke-thick"
              style={{ 
                fontWeight: 900,
                letterSpacing: '-0.22em', // 文字間隔（小さく詰める）
                paddingRight: '0.24em',   // 最後の文字の右端が切れるのを防止
                ...textOutlineStyle,
              }}
            >
              {card.name}
            </h1>

            {/* Name Right Icon (ex, GX, V, etc.) */}
            {card.nameIcon && (
              <img
                src={encodeURI(card.nameIcon)}
                alt="Card Name Icon"
                className="shrink-0 object-contain pointer-events-none select-none inline-block self-center"
                style={{
                  height: `${POKEMON_CARD_LAYOUT_CONFIG.NAME_ICON_HEIGHT}px`,
                  marginLeft: `${POKEMON_CARD_LAYOUT_CONFIG.NAME_ICON_OFFSET_X}px`,
                  transform: `translateY(${POKEMON_CARD_LAYOUT_CONFIG.NAME_ICON_OFFSET_Y}px)`,
                }}
              />
            )}
          </div>
        </div>

        {/* EVOLVES FROM TEXT ("〇〇から進化" - 斜体・リボン領域) */}
        {card.stage !== 'たね' && card.evolvesFrom && (
          <div
            className="absolute z-40 pointer-events-none flex items-center overflow-visible select-none"
            style={{
              top: POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_TOP,
              left: POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_LEFT,
              transform: `translate(${POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_OFFSET_X}px, ${POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_OFFSET_Y}px)`,
            }}
          >
            <span
              className="font-zen italic font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap"
              style={{
                fontSize: `${POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_FONT_SIZE}px`,
                letterSpacing: POKEMON_CARD_LAYOUT_CONFIG.EVOLVES_FROM_LETTER_SPACING,
              }}
            >
              {card.evolvesFrom.endsWith('から進化')
                ? card.evolvesFrom
                : `${card.evolvesFrom}から進化`}
            </span>
          </div>
        )}

        {/* 【HP表示エリア（完全独立・絶対配置エリア）】 */}
        {/* HPの位置を調整する際はここの top / right を変更してください */}
        <div
          className="absolute flex items-baseline leading-none z-20 pointer-events-none"
          style={{
            top: 'calc(3.6% + 5px)',  // 上下の位置（+5px 下）
            right: '12.4%',  // 右端からの距離
          }}
        >
          <span 
            data-text-stroke="true"
            className="text-[10.5px] font-black mr-0.5 tracking-tighter text-slate-800 card-text-stroke" 
            style={textOutlineStyle}
          >
            HP
          </span>
          <span 
            data-text-stroke="thick"
            className="font-hp text-[27px] tracking-tight font-black inline-block leading-none origin-bottom text-slate-950 card-text-stroke-thick" 
            style={{
              transform: 'scale(0.92, 1.12)',
              ...textOutlineStyle,
            }}
          >
            {card.hp || '60'}
          </span>
        </div>

        {/* 【右上エネルギーアイコン（完全独立・絶対配置エリア）】 */}
        <div
          className="absolute flex items-center justify-center pointer-events-none z-20"
          style={{
            top: '3.4%',     // 上下の位置
            right: '4.6%',   // 右端からの位置
          }}
        >
          <EnergyIcon
            type={card.primaryType}
            customSize={POKEMON_CARD_LAYOUT_CONFIG.HEADER_ENERGY_SIZE}
            showShadow={false}
            withWhiteBorder={true}
            whiteBorderWidth={POKEMON_CARD_LAYOUT_CONFIG.HEADER_ENERGY_BORDER_WIDTH}
          />
          {secondaryMeta && (
            <EnergyIcon
              type={secondaryMeta.id}
              customSize={POKEMON_CARD_LAYOUT_CONFIG.HEADER_ENERGY_SIZE - 2}
              className="-ml-2"
              showShadow={false}
              withWhiteBorder={true}
              whiteBorderWidth={POKEMON_CARD_LAYOUT_CONFIG.HEADER_ENERGY_BORDER_WIDTH}
            />
          )}
        </div>



        {/* POKEDEX SUB-BAR (Absolute positioned right on top of the silver ribbon) */}
        <div 
          className="absolute flex items-center justify-center text-[8.5px] text-slate-800 font-semibold tracking-tight bg-transparent text-center leading-none"
          style={{
            top: '47.5%',
            left: '6.44%',
            width: '87.12%',
            height: '2.8%',
          }}
        >
          <span>
            {card.dexNumber ? `全国図鑑${card.dexNumber} ` : ''}
            {card.dexSpecies ? `${card.dexSpecies} ` : ''}
            {card.dexHeight ? `高さ：${card.dexHeight} ` : ''}
            {card.dexWeight ? `重さ：${card.dexWeight}` : ''}
          </span>
        </div>

        {/* ABILITY & MOVES CONTENT AREA */}
        <div 
          className={`absolute flex flex-col px-1.5 overflow-visible transition-all ${
            card.ability?.enabled ? 'justify-start pt-0.5 gap-2' : 'justify-center gap-1'
          }`}
          style={{
            top: '55.2%',
            left: '6.0%',
            width: '88.0%',
            bottom: '12.2%',
          }}
        >
          {/* ABILITY (特性) - Title & Description matching reference layout */}
          {card.ability?.enabled && (
            <div className="py-0.5 px-1 flex flex-col mb-0.5 overflow-visible">
              {/* Ability Name (Positioned right beside the image overlay badge) */}
              <div 
                className="flex items-center min-h-[24px] py-0.5 overflow-visible transition-all"
                style={{
                  paddingLeft: `${POKEMON_CARD_LAYOUT_CONFIG.ABILITY_TITLE_OFFSET_X}px`,
                  transform: `translateY(${POKEMON_CARD_LAYOUT_CONFIG.ABILITY_TITLE_OFFSET_Y}px)`,
                }}
              >
                <span 
                  data-text-stroke="thick"
                  className="font-zen font-black text-[19px] leading-snug tracking-tight text-red-600 card-text-stroke-thick"
                  style={textOutlineStyle}
                >
                  {card.ability.name || '特性名'}
                </span>
              </div>
              {/* Ability Description */}
              <p 
                data-text-stroke="true"
                className="text-[10.5px] leading-[1.35] font-normal text-left px-0.5 transition-all relative text-slate-900 card-text-stroke"
                style={{
                  left: `${POKEMON_CARD_LAYOUT_CONFIG.ABILITY_DESC_OFFSET_X}px`,
                  transform: `translateY(${POKEMON_CARD_LAYOUT_CONFIG.ABILITY_DESC_OFFSET_Y}px)`,
                  ...textOutlineStyle,
                }}
              >
                {card.ability.description || '特性の効果テキストが入ります。'}
              </p>
            </div>
          )}

          {/* MOVES (ワザ) - Dynamic positioning when Ability is ON vs OFF */}
          <div
            className="flex flex-col gap-1.5 transition-all"
            style={{
              transform: card.ability?.enabled
                ? `translateY(${POKEMON_CARD_LAYOUT_CONFIG.MOVE_ABILITY_ON_OFFSET_Y}px)`
                : `translateY(${
                    (card.moves?.length === 1
                      ? (card.move1OffsetY ?? POKEMON_CARD_LAYOUT_CONFIG.MOVE_1_OFFSET_Y)
                      : (card.move2OffsetY ?? POKEMON_CARD_LAYOUT_CONFIG.MOVE_2_OFFSET_Y))
                  }px)`,
            }}
          >
            {card.moves && card.moves.map((move, idx) => {
              return (
                <div
                  key={move.id || idx}
                  className="py-1.5 px-1 relative transition-all flex flex-col"
                >
                  {/* Header Row: Energy (Left) + Move Name (Center) + Damage (Right) */}
                  <div className="relative flex items-center justify-between min-h-[32px] w-full">
                    {/* Energy Cost (Far Left) */}
                    <div 
                      className="flex items-center shrink-0 z-10 min-w-[36px] relative"
                      style={{
                        gap: `${POKEMON_CARD_LAYOUT_CONFIG.MOVE_ENERGY_GAP}px`,
                        left: `${POKEMON_CARD_LAYOUT_CONFIG.MOVE_ENERGY_OFFSET_X}px`,
                        transform: `scale(${card.energyIconScale ?? POKEMON_CARD_LAYOUT_CONFIG.ENERGY_ICON_SCALE})`,
                        transformOrigin: 'left center',
                      }}
                    >
                      {move.energyCost.length === 0 ? (
                        <span className="text-[10px] font-medium text-slate-500">なし</span>
                      ) : (
                        move.energyCost.map((eType, eIdx) => (
                          <EnergyIcon key={eIdx} type={eType} size="sm" withWhiteBorder={true} showShadow={false} />
                        ))
                      )}
                    </div>

                    {/* Move Name (Aligned to match Top Title starting X coordinate) */}
                    <div 
                      className="absolute flex items-center justify-start gap-1 max-w-[58%] text-left z-10 pointer-events-none -top-0.5 overflow-visible"
                      style={{
                        left: `calc(60px + ${(card.titleOffsetX ?? POKEMON_CARD_LAYOUT_CONFIG.TITLE_OFFSET_X) + POKEMON_CARD_LAYOUT_CONFIG.MOVE_NAME_OFFSET_X}px)`,
                      }}
                    >
                      <span 
                        data-text-stroke="thick"
                        className="font-hp font-black text-lg leading-normal pointer-events-auto whitespace-nowrap overflow-visible pt-1 pb-0.5 inline-block text-slate-950 card-text-stroke-thick"
                        style={{
                          transform: `scale(${card.moveNameSize ?? POKEMON_CARD_LAYOUT_CONFIG.MOVE_NAME_SCALE})`,
                          transformOrigin: 'left center',
                          overflow: 'visible',
                          ...textOutlineStyle,
                        }}
                      >
                        {move.name || 'ワザ名'}
                      </span>
                    </div>

                    {/* Damage (Far Right) */}
                    <div className="shrink-0 z-10 ml-auto pl-2">
                      {move.damage ? (
                        <span 
                          data-text-stroke="thick"
                          className="font-damage font-bold text-2xl tracking-tight leading-none text-slate-950 card-text-stroke-thick"
                          style={textOutlineStyle}
                        >
                          {move.damage}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Move Description (New Line starting from below energy icons) */}
                  {move.description && (
                    <p 
                      data-text-stroke="true"
                      className="text-[10.5px] leading-[1.35] mt-1 px-0.5 font-normal text-left relative text-slate-900 card-text-stroke"
                      style={{
                        left: `${POKEMON_CARD_LAYOUT_CONFIG.MOVE_DESC_OFFSET_X}px`,
                        top: `${POKEMON_CARD_LAYOUT_CONFIG.MOVE_DESC_OFFSET_Y}px`,
                        ...textOutlineStyle,
                      }}
                    >
                      {move.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 【BOTTOM STATS AREA: 弱点 / 抵抗力 / にげる 調整エリア】 */}
        {/* ============================================================ */}
        <div 
          className="absolute bg-transparent select-none pointer-events-none"
          style={{
            bottom: '10.68%', // 全体の上下位置（数値を増やすと上へ、減らすと下へ）
            left: '6.44%',
            width: '87.12%',
            height: '3.6%',
          }}
        >
          {/* 1. 弱点 (Weakness) */}
          <div 
            className="absolute flex items-center gap-1 shrink-0"
            style={{
              left: '3%',         // 弱点の横位置
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {/* 役割ラベル（弱点） */}
            <span 
              data-text-stroke="true"
              className="inline-flex justify-between font-medium leading-none text-slate-900 card-text-stroke"
              style={{
                width: '24px',      // 文字幅（均等割り付け幅）
                fontSize: '8px',    // 役割ラベルの文字サイズ
                fontWeight: 500,    // ラベルの太さ
                ...textOutlineStyle,
              }}
            >
              <span>弱</span>
              <span>点</span>
            </span>

            {/* 弱点の値（タイプアイコン & 倍率） */}
            {card.weaknessType !== 'none' && (
              <div className="flex items-center gap-0.5 ml-1">
                <EnergyIcon type={card.weaknessType} size="xs" showShadow={false} />
                <span 
                  data-text-stroke="thick"
                  className="font-hp font-black ml-0.5 leading-none text-slate-950 card-text-stroke-thick"
                  style={{
                    fontSize: '15px',   // 【値の文字サイズ】
                    fontWeight: 900,    // 【値の太さ】
                    ...textOutlineStyle,
                  }}
                >
                  {(card.weaknessValue || '× 2').replace(/^([×xX\*])\s*/, '$1 ')}
                </span>
              </div>
            )}
          </div>

          {/* 2. 抵抗力 (Resistance) */}
          <div 
            className="absolute flex items-center gap-1 shrink-0"
            style={{
              left: '30.5%',       // 抵抗力の横位置（自由に変更可能）
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {/* 役割ラベル（抵抗力） */}
            <span 
              data-text-stroke="true"
              className="inline-flex justify-between font-medium leading-none text-slate-900 card-text-stroke"
              style={{
                width: '32px',      // 文字幅（均等割り付け幅）
                fontSize: '8px',    // 役割ラベルの文字サイズ
                fontWeight: 500,    // ラベルの太さ
                ...textOutlineStyle,
              }}
            >
              <span>抵</span>
              <span>抗</span>
              <span>力</span>
            </span>

            {/* 抵抗力の値（タイプアイコン & 軽減値） */}
            {card.resistanceType !== 'none' && (
              <div className="flex items-center gap-0.5 ml-1">
                <EnergyIcon type={card.resistanceType} size="xs" showShadow={false} />
                <span 
                  data-text-stroke="thick"
                  className="font-hp font-black ml-0.5 leading-none text-slate-950 card-text-stroke-thick"
                  style={{
                    fontSize: '15px',   // 【値の文字サイズ】
                    fontWeight: 900,    // 【値の太さ】
                    ...textOutlineStyle,
                  }}
                >
                  {(card.resistanceValue || '- 30').replace(/^([-−–])\s*/, '$1 ')}
                </span>
              </div>
            )}
          </div>

          {/* 3. にげる (Retreat) */}
          <div 
            className="absolute flex items-center gap-1.5 shrink-0"
            style={{
              left: '65.0%',       // にげるの横位置（自由に変更可能）
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {/* 役割ラベル（にげる） */}
            <span 
              data-text-stroke="true"
              className="inline-flex justify-between font-medium leading-none text-slate-900 card-text-stroke"
              style={{
                width: '32px',      // 文字幅（均等割り付け幅）
                fontSize: '8px',    // 役割ラベルの文字サイズ
                fontWeight: 500,    // ラベルの太さ
                ...textOutlineStyle,
              }}
            >
              <span>に</span>
              <span>げ</span>
              <span>る</span>
            </span>

            {/* にげるエネルギーアイコン */}
            <div 
              className="flex items-center ml-0.5"
              style={{
                gap: `${POKEMON_CARD_LAYOUT_CONFIG.RETREAT_ENERGY_GAP}px`,
              }}
            >
              {card.retreatCost > 0 && (
                Array.from({ length: Math.min(card.retreatCost, 4) }).map((_, i) => (
                  <EnergyIcon key={i} type="colorless" size="xs" showShadow={false} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER METADATA & FLAVOR TEXT */}
        <div 
          className="absolute flex flex-col justify-end"
          style={{
            bottom: '1.2%',
            left: '6.0%',
            width: '88.0%',
            height: '5.6%',
            transform: `translateY(${POKEMON_CARD_LAYOUT_CONFIG.FOOTER_OFFSET_Y}px)`,
          }}
        >
          <div className="flex items-end justify-between gap-2">
            {/* Left: Illustrator & Set info */}
            <div className="flex flex-col gap-0.5">
              <span 
                data-text-stroke="true"
                className="font-bold italic text-[8.5px] leading-tight text-slate-800 card-text-stroke"
                style={textOutlineStyle}
              >
                Illus.{card.illustrator || 'Hiro Iwai'}
              </span>
              <div className="flex items-center gap-1 text-[8px]">
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
                  data-text-stroke="true"
                  className="font-black italic text-[9px] tracking-tight ml-1 text-slate-950 card-text-stroke"
                  style={textOutlineStyle}
                >
                  {card.cardNumber || '059/078'}
                </span>
                <span 
                  data-text-stroke="true"
                  className="font-black italic text-[8.5px] ml-0.5 text-slate-950 card-text-stroke"
                  style={textOutlineStyle}
                >
                  {card.rarity || 'C'}
                </span>
              </div>
            </div>

            {/* Right: Flavor Text */}
            {card.flavorText && (
              <div 
                data-text-stroke="true"
                className="text-[8px] leading-[1.3] text-right max-w-[220px] line-clamp-2 text-slate-800 card-text-stroke"
                style={textOutlineStyle}
              >
                {card.flavorText}
              </div>
            )}
          </div>

          {/* Bottom Center Copyright */}
          <div 
            data-text-stroke="true"
            className="text-center text-[7px] mt-0.5 tracking-tight font-medium text-slate-600 card-text-stroke"
            style={{
              transform: `translateY(${POKEMON_CARD_LAYOUT_CONFIG.COPYRIGHT_OFFSET_Y}px)`,
              ...textOutlineStyle,
            }}
          >
            ©2026 Pokémon/Nintendo/Creatures/GAME FREAK.
          </div>
        </div>

      </div>
    </div>
  );
});

