import '@src/styles/index.css';
import styles from './Options.module.scss';
import { createResource } from 'solid-js';
import { bytesToSize } from '@src/utils/bytesToSize';

const Options = () => {
  const [usedStorage] = createResource<number>(async () => chrome.storage.local.getBytesInUse());

  const clear = async () => {
    await chrome.storage.local.clear();
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <span class={styles.logo}>rekishi.</span>
      </header>
      <div class={styles.container}>
        <div>
          Used storage: <b>{bytesToSize(usedStorage())}</b>
        </div>
        <button onClick={clear}>Clear storage</button>
      </div>
    </div>
  );
};

export default Options;
