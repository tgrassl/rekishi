import { createSignal } from 'solid-js';
import styles from './SearchBar.module.scss';
import clsx from 'clsx';

export interface SearchBarProps {
  class: string;
  initialValue?: string;
  onAction?: (query: string) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const [query, setQuery] = createSignal(props.initialValue ?? '');

  const handleQuery = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onAction?.(query());
    }
  };

  return (
    <div class={clsx(styles.container, props.class)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={styles.icon}>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <input
        class={styles.input}
        type="text"
        placeholder="Search in your history"
        required
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
        onKeyUp={handleQuery}
      />
    </div>
  );
};
