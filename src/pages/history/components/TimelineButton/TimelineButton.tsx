import styles from './TimelineButton.module.scss';
import clsx from 'clsx';

export interface TimelineButtonProps {
  class: string;
  onClick: () => void;
}

export const TimelineButton = (props: TimelineButtonProps) => {
  return (
    <button class={clsx(styles.button, props.class)} onClick={() => props.onClick()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
};
