import React from 'react';
import { PokemonType } from '../types';
import { ENERGY_IMAGE_URLS } from '../constants/energyImages';

interface EnergyIconProps {
  type: PokemonType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customSize?: number;
  className?: string;
  showShadow?: boolean;
  withWhiteBorder?: boolean;
  whiteBorderWidth?: number;
  style?: React.CSSProperties;
}

export const EnergyIcon: React.FC<EnergyIconProps> = React.memo(({
  type,
  size = 'md',
  customSize,
  className = '',
  showShadow = true,
  withWhiteBorder = false,
  whiteBorderWidth = 2.5,
  style,
}) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 min-w-[14px] min-h-[14px]',
    sm: 'w-4.5 h-4.5 min-w-[18px] min-h-[18px]',
    md: 'w-5.5 h-5.5 min-w-[22px] min-h-[22px]',
    lg: 'w-6.5 h-6.5 min-w-[26px] min-h-[26px]',
    xl: 'w-8 h-8 min-w-[32px] min-h-[32px]',
  };

  const imageUrl = ENERGY_IMAGE_URLS[type];

  if (!imageUrl) return null;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 relative overflow-hidden select-none transition-transform ${customSize ? '' : sizeMap[size]} ${className}`}
      style={{
        ...(customSize ? {
          width: `${customSize}px`,
          height: `${customSize}px`,
          minWidth: `${customSize}px`,
          minHeight: `${customSize}px`,
        } : {}),
        border: withWhiteBorder ? `${whiteBorderWidth}px solid #ffffff` : 'none',
        boxSizing: 'border-box',
        boxShadow: showShadow
          ? '0 1.5px 3.5px rgba(0,0,0,0.4)'
          : undefined,
        ...style,
      }}
      title={type}
    >
      <img
        src={imageUrl}
        alt={type}
        className="w-full h-full object-contain pointer-events-none rounded-full"
        loading="eager"
        decoding="sync"
        referrerPolicy="no-referrer"
      />
    </div>
  );
});
