import { useHistory } from '@pages/history/providers/HistoryProvider';
import { getFaviconUrl } from '@src/utils/history';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { createResource, For } from 'solid-js';
import styles from './Search.module.scss';

export const Search = () => {
  const [browserSearchResults] = createResource(async () => chrome.history.search({ text: 'chrome' }));
  const { history } = useHistory();

  console.log(browserSearchResults());

  return (
    <div>
      {browserSearchResults.loading && 'Loading...'}
      <div class={styles.results}>
        <For each={browserSearchResults()}>
          {(item) => (
            <div class={styles.result}>
              <div class={clsx(styles.resultPreview, styles.icon)}>
                <img src={getFaviconUrl(item.url, 1024)} alt={item.title} />
              </div>
              <div class={styles.resultFooter}>
                <img src={getFaviconUrl(item.url, 128)} alt={item.title} class={styles.resultIcon} />
                <div class={styles.resultInfos}>
                  <span class={styles.resultTitle}>{item.title}</span>
                  <span>{dayjs(item.lastVisitTime).format('lll')}</span>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
