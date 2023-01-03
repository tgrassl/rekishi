import styles from './LoadingSpinner.module.scss';
import clsx from 'clsx';

export interface LoadingSpinnerProps {
  center?: boolean;
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div class={clsx(styles.spinner, props.center && styles.center)}>
      <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} />
      <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} />
      <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} /> <div class={styles.blade} />
    </div>
  );
};
