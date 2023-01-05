import { useJourney } from '@pages/history/providers/JourneyProvider';
import { createMemo, createResource, createSignal, For } from 'solid-js';
import styles from './Search.module.scss';
import { useParams, useNavigate } from '@solidjs/router';
import { SearchBar } from '@pages/history/components/SearchBar/SearchBar';
import { SearchResult } from '@pages/history/components/SearchResult/SearchResult';
import { LoadingSpinner } from '@pages/history/components/LoadingSpinner/LoadingSpinner';
import HistoryItem = chrome.history.HistoryItem;

export const Search = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { journey } = useJourney();
  const [query, setQuery] = createSignal(params.query ?? 'twitter');
  const [browserSearchResults] = createResource(
    () => query(),
    async (text) => chrome.history.search({ text })
  );

  const mappedBrowserResults = createMemo<HistoryItem[]>(() => {
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
  });

  const handleSearch = (query: string) => {
    if (query === '' || query === ' ') return;
    setQuery(query);
    navigate(`/search/${query}`);
  };

  return (
    <div>
      <SearchBar class={styles.search} onAction={handleSearch} initialValue={params.query} />
      {browserSearchResults.loading && <LoadingSpinner center />}
      <div class={styles.results}>
        <For each={mappedBrowserResults()}>{(item) => <SearchResult item={item} />}</For>
      </div>
    </div>
  );
};
