export type ThemeMode = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';

export interface ThemeConfig {
  themeId: 'enterprise-studio';
  mode: ThemeMode;
  direction: Direction;
}

export const THEME_ID = 'enterprise-studio';
