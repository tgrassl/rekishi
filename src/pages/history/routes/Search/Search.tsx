import styles from '@pages/history/History.module.css';
import { Timeline } from '@pages/history/components/Timeline/Timeline';
import { useHistory } from '@pages/history/providers/HistoryProvider';
import * as lz from 'lz-string';

export const Search = () => {
  const { history } = useHistory();

  return <div>Search</div>;
};
