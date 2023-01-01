import { HistoryItem } from '@src/model/historyItem';
import { colorShade } from '@src/utils/colors';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export const getFaviconUrl = (url, size = 64) => {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${size}`;
};

export const getHistoryData = async (): Promise<HistoryItem[]> => {
  // const data = await chrome.storage.local.get(["history"]);
  const data = await chrome.storage.local.get(['test']);
  return data?.test ?? [];
};

export const fetchAndMapHistory = async () => {
  const data = await getHistoryData();
  return await Promise.all(
    data.map(async (item) => {
      const iconUrl = getFaviconUrl(item.url);
      const colors = await fac.getColorAsync(iconUrl, { ignoredColor: [255, 255, 255, 255] });
      const brightIconColor = colors.hex === '#ffffff';
      return {
        ...item,
        icon: iconUrl,
        colors: {
          isDark: colors.isDark,
          hex: brightIconColor ? colorShade('#ffffff', -50) : colors.hex,
          isLight: brightIconColor,
        },
        duration: item.out ? (item.out - item.in) / 1000 : -1,
      };
    })
  );
};
