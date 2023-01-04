import { HistoryItem } from '@src/model/historyItem';
import { colorShade } from '@src/utils/colors';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export const getFaviconUrl = (url, size = 64) => {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${size}`;
};

interface PageVisit {
  tab: number;
  url?: string;
  icon?: string;
  title?: string;
  preview?: string;
  in: number;
  out?: number;
  ref?: number;
}

export const getHistoryData = async (): Promise<PageVisit[]> => {
  // const data = await chrome.storage.local.get(["history"]);
  const data = await chrome.storage.local.get(['test']);
  return data?.test ?? [];
};

export const fetchAndMapHistory = async (): Promise<HistoryItem[]> => {
  const data = await getHistoryData();

  const mappedItems = await Promise.all(
    data.map(async (visit: PageVisit): Promise<HistoryItem | PageVisit> => {
      if (Object.hasOwn(visit, 'ref')) {
        return visit;
      } else {
        const iconUrl = getFaviconUrl(visit.url);
        const colors = await fac.getColorAsync(iconUrl, { ignoredColor: [255, 255, 255, 255] });
        const brightIconColor = colors.hex === '#ffffff';
        return {
          ...visit,
          icon: iconUrl,
          colors: {
            isDark: colors.isDark,
            hex: brightIconColor ? colorShade('#ffffff', -50) : colors.hex,
            isLight: brightIconColor,
          },
          duration: visit.out ? (visit.out - visit.in) / 1000 : -1,
        } as HistoryItem;
      }
    })
  );

  return mappedItems.map((visit: HistoryItem) => {
    if (!Object.hasOwn(visit, 'ref')) return visit;

    const reference = mappedItems[visit.ref] as HistoryItem;
    return {
      ...reference,
      in: visit.in,
      out: visit.out,
      duration: visit.out ? (visit.out - visit.in) / 1000 : -1,
    };
  });
};
