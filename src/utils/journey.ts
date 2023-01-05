import { JourneyItem } from '@src/model/journeyItem';
import { PageVisit } from '@src/model/pageVisit';
import { colorShade } from '@src/utils/colors';
import { FastAverageColor } from 'fast-average-color';
import dayjs from 'dayjs';

const fac = new FastAverageColor();

export const getFaviconUrl = (url, size = 64) => {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${size}`;
};

export const getStorageKeyForDay = (day?: Date) => dayjs(day).format('DD_MM_YYYY');

export const getJourneyData = async (dayKey?: string): Promise<PageVisit[]> => {
  const key = dayKey ?? getStorageKeyForDay();
  const data = await chrome.storage.local.get([key]);
  return data?.[key] ?? [];
};

export const fetchAndMapJourney = async (): Promise<JourneyItem[]> => {
  const data = await getJourneyData();

  const mappedItems = await Promise.all(
    data.map(async (visit: PageVisit): Promise<JourneyItem | PageVisit> => {
      if (Object.hasOwn(visit, 'ref')) {
        return visit;
      } else {
        const iconUrl = getFaviconUrl(visit.url);
        const colors = await fac.getColorAsync(iconUrl, { ignoredColor: [255, 255, 255] });
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
        } as JourneyItem;
      }
    })
  );

  return mappedItems.map((visit: JourneyItem) => {
    if (!Object.hasOwn(visit, 'ref')) return visit;

    const reference = mappedItems[visit.ref] as JourneyItem;
    return {
      ...reference,
      in: visit.in,
      out: visit.out,
      duration: visit.out ? (visit.out - visit.in) / 1000 : -1,
    };
  });
};
