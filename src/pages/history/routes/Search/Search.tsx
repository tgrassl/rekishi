import { useJourney } from '@pages/history/providers/JourneyProvider';
import { createMemo, createResource, createSignal, For } from 'solid-js';
import styles from './Search.module.scss';
import { useNavigate, useParams } from '@solidjs/router';
import { SearchBar } from '@pages/history/components/SearchBar/SearchBar';
import { SearchResult } from '@pages/history/components/SearchResult/SearchResult';
import { LoadingSpinner } from '@pages/history/components/LoadingSpinner/LoadingSpinner';
import { mapBrowserSearchResult } from '@pages/history/routes/Search/mapBrowserSearchResult';

export const Search = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { journey } = useJourney();
  const [query, setQuery] = createSignal(params.query);
  const [browserSearchResults] = createResource(
    () => query(),
    // @todo increase search time period
    async (text) => chrome.history.search({ text })
  );

  const mappedBrowserResults = createMemo<chrome.history.HistoryItem[]>(() => mapBrowserSearchResult(journey, browserSearchResults, query));

  const handleSearch = (query: string) => {
    if (query === '' || query === ' ') return;
    setQuery(query);
    navigate(`/search/${query}`);
  };

  return (
    <div class={styles.container}>
      <SearchBar class={styles.searchBar} onAction={handleSearch} initialValue={params.query} />
      {browserSearchResults.loading && <LoadingSpinner center />}
      <div class={styles.results}>
        <For each={mappedBrowserResults()}>{(item) => <SearchResult item={item} />}</For>
      </div>
    </div>
  );
};
