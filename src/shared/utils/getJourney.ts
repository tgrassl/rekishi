import { JourneyItem } from '@shared/model/journeyItem';
import { PageVisit } from '@shared/model/pageVisit';
import dayjs from 'dayjs';
import { getColorsFromUrl } from '@shared/utils/getColorsFromUrl';

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
    data.map(async (visit: PageVisit, index): Promise<JourneyItem | PageVisit> => {
      // fix missing outs
      const out = !visit.out && index !== data.length - 1 ? data[index + 1]?.in : visit.out;
      const fixedVisit = { ...visit, out };

      // handle refs in the next step
      if (Object.hasOwn(fixedVisit, 'ref')) {
        return fixedVisit;
      } else {
        const iconUrl = getFaviconUrl(fixedVisit.url);
        const colors = await getColorsFromUrl(iconUrl);
        return {
          ...fixedVisit,
          out,
          icon: iconUrl,
          duration: out ? (out - fixedVisit.in) / 1000 : -1,
          colors,
        } as JourneyItem;
      }
    })
  );

  return mappedItems.map((visit: JourneyItem) => {
    if (!Object.hasOwn(visit, 'ref')) return visit;

    // map ref to existing item and add time slots
    const reference = mappedItems[visit.ref] as JourneyItem;
    return {
      ...reference,
      in: visit.in,
      out: visit.out,
      duration: visit.out ? (visit.out - visit.in) / 1000 : -1,
    };
  });
};
