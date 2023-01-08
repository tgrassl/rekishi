import { colorShade } from '@shared/utils/colors';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export interface ColorInfo {
  isDark: boolean;
  hex: string;
  isLight: boolean;
}

export const getColorsFromUrl = async (url: string): Promise<ColorInfo> => {
  const colors = await fac.getColorAsync(url);
  const brightIconColor = colors.hex === '#ffffff';
  return {
    isDark: colors.isDark,
    hex: brightIconColor ? colorShade('#ffffff', -50) : colors.hex,
    isLight: brightIconColor,
  };
};
