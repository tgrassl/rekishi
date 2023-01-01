import '@src/styles/index.css';
import styles from './History.module.css';
import { Timeline } from '@pages/history/components/Timeline/Timeline';
import * as lz from 'lz-string';
import { createResource } from 'solid-js';
import { HistoryItem } from '@src/model/historyItem';
import { fetchAndMapHistory } from '@src/utils/history';

const History = () => {
  const [history] = createResource<HistoryItem[]>(fetchAndMapHistory);

  const clear = async () => {
    await chrome.storage.local.set({ test: [] });
  };

  return (
    <div class={styles.App}>
      <button onClick={clear}>Clear History</button>
      {!history.loading && <img class={styles.preview} src={lz.decompressFromUTF16(history()[history().length - 1].preview)} />}
      <Timeline history={history} />
    </div>
  );
};

export default History;
