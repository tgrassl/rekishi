import { HistoryProvider } from '@pages/history/providers/HistoryProvider';
import { Search } from '@pages/history/routes/Search/Search';
import { View } from '@pages/history/routes/View/View';
import { Route, Routes } from '@solidjs/router';
import '@src/styles/index.css';
import styles from './History.module.scss';

const History = () => {
  const clear = async () => {
    await chrome.storage.local.set({ test: [] });
  };

  return (
    <HistoryProvider>
      <div class={styles.App}>
        <div class={styles.header}>rekishi.</div>
        {/* <button onClick={clear}>Clear History</button> */}
        <Routes>
          <Route path="/" component={View} />
          <Route path="/search" component={Search} />
        </Routes>
      </div>
    </HistoryProvider>
  );
};

export default History;
