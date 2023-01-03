import { useHistory } from '@pages/history/providers/HistoryProvider';
import { createMemo, createResource, createSignal, For } from 'solid-js';
import styles from './Search.module.scss';
import { useParams } from '@solidjs/router';
import { SearchBar } from '@pages/history/components/SearchBar/SearchBar';
import { SearchResult } from '@pages/history/components/SearchResult/SearchResult';
import { LoadingSpinner } from '@pages/history/components/LoadingSpinner/LoadingSpinner';
import HistoryItem = chrome.history.HistoryItem;

export const Search = () => {
  const params = useParams();
  const { history } = useHistory();
  const [query, setQuery] = createSignal(params.query ?? 'twitter');
  const [browserSearchResults] = createResource(
    () => query(),
    async (text) => chrome.history.search({ text })
  );

  const mappedResults = createMemo<HistoryItem[]>(() => {
    if (!history.loading && !browserSearchResults.loading) {
      const historyItemsForQuery = history()?.filter((item) => item.url?.includes(query()) || item.title?.includes(query()));
      if (historyItemsForQuery.length === 0) return browserSearchResults();
      return browserSearchResults().map((item) => {
        const relatingItem = historyItemsForQuery.find((hi) => hi.url === item.url);
        if (!relatingItem) return item;

        return {
          ...item,
          ...(relatingItem.preview && { preview: relatingItem.preview }),
        };
      });
    }
    return null;
  });

  console.log(mappedResults());

  const handleSearch = (query: string) => {
    if (query === '' || query === ' ') return;
    setQuery(query);
  };

  return (
    <div>
      <SearchBar class={styles.search} onAction={handleSearch} initialValue={params.query} />
      {browserSearchResults.loading && <LoadingSpinner center />}
      <div class={styles.results}>
        <For each={mappedResults()}>{(item) => <SearchResult item={item} />}</For>
      </div>
    </div>
  );
};
