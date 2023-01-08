import '@shared/styles/index.scss';
import { bytesToSize } from '@shared/utils/bytesToSize';
import { createResource } from 'solid-js';
import styles from './Options.module.scss';

const Options = () => {
  const [usedStorage, { refetch }] = createResource<number>(async () => chrome.storage.local.getBytesInUse());

  const clear = async () => {
    await chrome.runtime.sendMessage({
      type: 'clear',
    });
    await chrome.storage.local.clear();
    await refetch();
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
