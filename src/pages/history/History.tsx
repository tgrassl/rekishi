import '@src/styles/index.css';
import styles from './History.module.css';
import { Timeline } from '@pages/history/components/Timeline/Timeline';

const History = () => {
  const clear = async () => {
    await chrome.storage.local.set({ test: [] });
  };

  return (
    <div class={styles.App}>
      <button onClick={clear}>Clear History</button>
      <Timeline />
    </div>
  );
};

export default History;
