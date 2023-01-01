import styles from '@pages/history/History.module.scss';
import { Timeline } from '@pages/history/components/Timeline/Timeline';
import { useHistory } from '@pages/history/providers/HistoryProvider';
import * as lz from 'lz-string';
import { createMemo } from 'solid-js';
import { getFaviconUrl } from '@src/utils/history';
import clsx from 'clsx';

export const View = () => {
  const { history, activeItem } = useHistory();

  const previewSrc = createMemo(() => {
    if (!activeItem()) return null;

    if (activeItem()?.preview) {
      return lz.decompressFromUTF16(activeItem().preview);
    }

    return getFaviconUrl(activeItem()?.url, 250);
  });

  return (
    <>
      {!history.loading && (
        <div class={clsx(styles.preview, !activeItem()?.preview && styles.icon)} style={{ 'border-color': activeItem()?.colors?.hex }}>
          <img src={previewSrc()} />
        </div>
      )}
      <Timeline history={history} />
    </>
  );
};
