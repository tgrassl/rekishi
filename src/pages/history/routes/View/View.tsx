import styles from '@pages/history/History.module.css';
import { Timeline } from '@pages/history/components/Timeline/Timeline';
import { useHistory } from '@pages/history/providers/HistoryProvider';
import * as lz from 'lz-string';

export const View = () => {
  const { history, activeItem } = useHistory();

  let imageRef: HTMLImageElement;

  return (
    <>
      {!history.loading && (
        <img
          ref={imageRef}
          class={styles.preview}
          src={lz.decompressFromUTF16((activeItem() ? activeItem() : history()[history().length - 1]).preview)}
        />
      )}
      <Timeline history={history} />
    </>
  );
};
