export interface VisualEffectOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const VISUAL_EFFECT_CATEGORIES = [
  'ALL',
  'SPARKLE',
  'FLAME',
  'THUNDER',
  'WATER',
  'LEAF',
  'ICE',
  'ROCK',
  'DARK',
  'RAINBOW',
  'TERA',
  'ABSTRACT',
] as const;

export const VISUAL_EFFECT_OPTIONS: VisualEffectOption[] = [
  // SPARKLE
  { id: 'fx-sparkle-1', name: 'SPARKLE 1', url: 'assets/visualeffect/fx-sparkle-1.webp', category: 'SPARKLE' },
  { id: 'fx-sparkle-2', name: 'SPARKLE 2', url: 'assets/visualeffect/fx-sparkle-2.webp', category: 'SPARKLE' },
  { id: 'fx-sparkle-3', name: 'SPARKLE 3', url: 'assets/visualeffect/fx-sparkle-3.webp', category: 'SPARKLE' },
  { id: 'fx-sparkle-4', name: 'SPARKLE 4', url: 'assets/visualeffect/fx-sparkle-4.webp', category: 'SPARKLE' },
  { id: 'fx-sparkle-5', name: 'SPARKLE 5', url: 'assets/visualeffect/fx-sparkle-5.webp', category: 'SPARKLE' },

  // FLAME
  { id: 'fx-flame-1', name: 'FLAME 1', url: 'assets/visualeffect/fx-flame-1.webp', category: 'FLAME' },
  { id: 'fx-flame-2', name: 'FLAME 2', url: 'assets/visualeffect/fx-flame-2.webp', category: 'FLAME' },
  { id: 'fx-flame-3', name: 'FLAME 3', url: 'assets/visualeffect/fx-flame-3.webp', category: 'FLAME' },
  { id: 'fx-flame-4', name: 'FLAME 4', url: 'assets/visualeffect/fx-flame-4.webp', category: 'FLAME' },

  // THUNDER
  { id: 'fx-thunder-1', name: 'THUNDER 1', url: 'assets/visualeffect/fx-thunder-1.webp', category: 'THUNDER' },
  { id: 'fx-thunder-2', name: 'THUNDER 2', url: 'assets/visualeffect/fx-thunder-2.webp', category: 'THUNDER' },
  { id: 'fx-thunder-3', name: 'THUNDER 3', url: 'assets/visualeffect/fx-thunder-3.webp', category: 'THUNDER' },
  { id: 'fx-thunder-4', name: 'THUNDER 4', url: 'assets/visualeffect/fx-thunder-4.webp', category: 'THUNDER' },
  { id: 'fx-thunder-5', name: 'THUNDER 5', url: 'assets/visualeffect/fx-thunder-5.webp', category: 'THUNDER' },

  // WATER
  { id: 'fx-water-1', name: 'WATER 1', url: 'assets/visualeffect/fx-water-1.webp', category: 'WATER' },

  // LEAF
  { id: 'fx-leaf-1', name: 'LEAF 1', url: 'assets/visualeffect/fx-leaf-1.webp', category: 'LEAF' },
  { id: 'fx-leaf-2', name: 'LEAF 2', url: 'assets/visualeffect/fx-leaf-2.webp', category: 'LEAF' },
  { id: 'fx-leaf-3', name: 'LEAF 3', url: 'assets/visualeffect/fx-leaf-3.webp', category: 'LEAF' },
  { id: 'fx-leaf-4', name: 'LEAF 4', url: 'assets/visualeffect/fx-leaf-4.webp', category: 'LEAF' },
  { id: 'fx-leaf-5', name: 'LEAF 5', url: 'assets/visualeffect/fx-leaf-5.webp', category: 'LEAF' },
  { id: 'fx-leaf-6', name: 'LEAF 6', url: 'assets/visualeffect/fx-leaf-6.webp', category: 'LEAF' },

  // ICE
  { id: 'fx-ice-1', name: 'ICE 1', url: 'assets/visualeffect/fx-ice-1.webp', category: 'ICE' },
  { id: 'fx-ice-2', name: 'ICE 2', url: 'assets/visualeffect/fx-ice-2.webp', category: 'ICE' },

  // ROCK
  { id: 'fx-rock-1', name: 'ROCK 1', url: 'assets/visualeffect/fx-rock-1.webp', category: 'ROCK' },
  { id: 'fx-rock-2', name: 'ROCK 2', url: 'assets/visualeffect/fx-rock-2.webp', category: 'ROCK' },
  { id: 'fx-rock-3', name: 'ROCK 3', url: 'assets/visualeffect/fx-rock-3.webp', category: 'ROCK' },
  { id: 'fx-rock-4', name: 'ROCK 4', url: 'assets/visualeffect/fx-rock-4.webp', category: 'ROCK' },
  { id: 'fx-rock-5', name: 'ROCK 5', url: 'assets/visualeffect/fx-rock-5.webp', category: 'ROCK' },

  // DARK
  { id: 'fx-dark-1', name: 'DARK 1', url: 'assets/visualeffect/fx-dark-1.webp', category: 'DARK' },

  // RAINBOW
  { id: 'fx-rainbow-1', name: 'RAINBOW 1', url: 'assets/visualeffect/fx-rainbow-1.webp', category: 'RAINBOW' },
  { id: 'fx-rainbow-2', name: 'RAINBOW 2', url: 'assets/visualeffect/fx-rainbow-2.webp', category: 'RAINBOW' },
  { id: 'fx-rainbow-3', name: 'RAINBOW 3', url: 'assets/visualeffect/fx-rainbow-3.webp', category: 'RAINBOW' },
  { id: 'fx-rainbow-4', name: 'RAINBOW 4', url: 'assets/visualeffect/fx-rainbow-4.webp', category: 'RAINBOW' },

  // TERA
  { id: 'fx-tera', name: 'TERA', url: 'assets/visualeffect/fx-tera.webp', category: 'TERA' },

  // ABSTRACT
  { id: 'fx-abstract-1', name: 'ABSTRACT 1', url: 'assets/visualeffect/fx-abstract-1.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-2', name: 'ABSTRACT 2', url: 'assets/visualeffect/fx-abstract-2.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-3', name: 'ABSTRACT 3', url: 'assets/visualeffect/fx-abstract-3.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-4', name: 'ABSTRACT 4', url: 'assets/visualeffect/fx-abstract-4.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-5', name: 'ABSTRACT 5', url: 'assets/visualeffect/fx-abstract-5.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-6', name: 'ABSTRACT 6', url: 'assets/visualeffect/fx-abstract-6.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-7', name: 'ABSTRACT 7', url: 'assets/visualeffect/fx-abstract-7.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-8', name: 'ABSTRACT 8', url: 'assets/visualeffect/fx-abstract-8.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-9', name: 'ABSTRACT 9', url: 'assets/visualeffect/fx-abstract-9.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-10', name: 'ABSTRACT 10', url: 'assets/visualeffect/fx-abstract-10.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-11', name: 'ABSTRACT 11', url: 'assets/visualeffect/fx-abstract-11.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-12', name: 'ABSTRACT 12', url: 'assets/visualeffect/fx-abstract-12.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-13', name: 'ABSTRACT 13', url: 'assets/visualeffect/fx-abstract-13.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-14', name: 'ABSTRACT 14', url: 'assets/visualeffect/fx-abstract-14.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-15', name: 'ABSTRACT 15', url: 'assets/visualeffect/fx-abstract-15.webp', category: 'ABSTRACT' },
  { id: 'fx-abstract-16', name: 'ABSTRACT 16', url: 'assets/visualeffect/fx-abstract-16.webp', category: 'ABSTRACT' },
];
