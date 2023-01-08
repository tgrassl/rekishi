import { getFaviconUrl } from '@shared/utils/getJourney';
import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from './SearchResult.module.scss';
import { createResource } from 'solid-js';
import { getColorsFromUrl } from '@shared/utils/getColorsFromUrl';
import HistoryItem = chrome.history.HistoryItem;

export interface SearchResultProps {
  item?: HistoryItem & { preview?: string };
}

export const SearchResult = (props: SearchResultProps) => {
  const smallFavIcon = getFaviconUrl(props.item.url, 128);
  const [colors] = createResource(async () => getColorsFromUrl(smallFavIcon));

  return (
    <a class={styles.container} href={props.item.url}>
      <div class={clsx(styles.preview, !props.item.preview && styles.small)}>
        <img
          src={props.item.preview ?? getFaviconUrl(props.item.url, 1024)}
          alt={props.item.title}
          style={{ filter: colors()?.isLight && !props.item.preview ? 'invert(1)' : 'none' }}
        />
      </div>
      <div class={styles.footer}>
        <div class={styles.icon}>
          <img src={smallFavIcon} alt={props.item.title} style={{ filter: colors()?.isLight ? 'invert(1)' : 'none' }} />
        </div>
        <div class={styles.infos}>
          <span class={styles.title}>{props.item.title}</span>
          <span>{dayjs(props.item.lastVisitTime).format('lll')}</span>
        </div>
      </div>
    </a>
  );
};
