import styles from './SearchResult.module.scss';
import clsx from 'clsx';
import { getFaviconUrl } from '@src/utils/history';
import dayjs from 'dayjs';
import HistoryItem = chrome.history.HistoryItem;

export interface SearchResultProps {
  item?: HistoryItem & { preview: string };
}

export const SearchResult = (props: SearchResultProps) => {
  return (
    <a class={styles.container} href={props.item.url}>
      <div class={clsx(styles.preview, !props.item.preview && styles.small)}>
        <img src={props.item.preview ?? getFaviconUrl(props.item.url, 1024)} alt={props.item.title} />
      </div>
      <div class={styles.footer}>
        <div class={styles.icon}>
          <img src={getFaviconUrl(props.item.url, 128)} alt={props.item.title} />
        </div>
        <div class={styles.infos}>
          <span class={styles.title}>{props.item.title}</span>
          <span>{dayjs(props.item.lastVisitTime).format('lll')}</span>
        </div>
      </div>
    </a>
  );
};
