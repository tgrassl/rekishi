import { Timeline } from '@pages/history/components/Timeline/Timeline';
import { useHistory } from '@pages/history/providers/HistoryProvider';
import { getFaviconUrl } from '@src/utils/history';
import clsx from 'clsx';
import { createMemo } from 'solid-js';
import styles from './View.module.scss';
import { SearchBar } from '@pages/history/components/SearchBar/SearchBar';
import { useNavigate } from '@solidjs/router';

export const View = () => {
  const { history, activeItem } = useHistory();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query === '' || query === ' ') return;

    navigate(`/search/${query}`);
  };

  const previewSrc = createMemo(() => {
    if (!activeItem()) return null;

    if (activeItem()?.preview) {
      return activeItem().preview;
    }

    return getFaviconUrl(activeItem()?.url, 250);
  });

  return (
    <>
      <SearchBar class={styles.search} onAction={handleSearch} />
      {!history.loading && (
        <div class={clsx(styles.preview, !activeItem()?.preview && styles.icon)} style={{ 'border-color': activeItem()?.colors?.hex }}>
          <img src={previewSrc()} />
        </div>
      )}
      <Timeline history={history} />
    </>
  );
};
