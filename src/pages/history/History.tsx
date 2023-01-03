import { HistoryProvider } from '@pages/history/providers/HistoryProvider';
import { Search } from '@pages/history/routes/Search/Search';
import { View } from '@pages/history/routes/View/View';
import { Route, Routes, A } from '@solidjs/router';
import '@src/styles/index.css';
import styles from './History.module.scss';

const History = () => {
  const clear = async () => {
    await chrome.storage.local.set({ test: [] });
  };

  return (
    <HistoryProvider>
      <div class={styles.App}>
        <div class={styles.header}>
          <A href="/" class={styles.logo}>
            rekishi.
          </A>
        </div>
        <button onClick={clear}>Clear History</button>
        <Routes>
          <Route path="/" component={View} />
          <Route path="/search/:query" component={Search} />
        </Routes>
      </div>
    </HistoryProvider>
  );
};

export default History;
