import { useTheme } from '@/context/ThemeContext';
import { LightColors, DarkColors } from '@/utils/theme';

export function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? DarkColors : LightColors;
}
