import { Resource } from 'solid-js';
import { JourneyItem } from '@shared/model/journeyItem';

export const mapBrowserSearchResult = (
  journey: Resource<JourneyItem[]>,
  browserSearchResults: Resource<chrome.history.HistoryItem[]>,
  query: () => string
) => {
  if (!journey.loading && !browserSearchResults.loading) {
    const historyItemsForQuery = journey()?.filter((item) => item.url?.includes(query()) || item.title?.includes(query()));
    if (historyItemsForQuery.length === 0) return browserSearchResults();

    return browserSearchResults().map((item) => {
      const relatingItem = historyItemsForQuery.find((hItem) => hItem.url === item.url);
      if (!relatingItem) return item;

      return {
        ...item,
        ...(relatingItem.preview && { preview: relatingItem.preview }),
      };
    });
  }
  return null;
};
