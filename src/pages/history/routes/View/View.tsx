import { SearchBar } from '@pages/history/components/SearchBar/SearchBar';
import { Timeline } from '@pages/history/components/Timeline/Timeline';
import { useJourney } from '@pages/history/providers/JourneyProvider';
import { getFaviconUrl } from '@shared/utils/journey';
import { useNavigate } from '@solidjs/router';
import clsx from 'clsx';
import { createEffect, createMemo } from 'solid-js';
import styles from './View.module.scss';

export const View = () => {
  const { journey, activeItem } = useJourney();
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

  createEffect(() => {
    console.log('view data', journey());
  });

  return (
    <>
      <SearchBar class={styles.search} onAction={handleSearch} />
      {!journey.loading && (
        <>
          <div class={clsx(styles.preview, !activeItem()?.preview && styles.icon)} style={{ 'border-color': activeItem()?.colors?.hex }}>
            <img src={previewSrc()} />
          </div>
          <Timeline />
        </>
      )}
    </>
  );
};
