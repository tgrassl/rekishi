import { colorShade } from '@shared/utils/colors';
import { Show } from 'solid-js';
import styles from './TimelineBar.module.scss';

export const TimelineBar = (props) => {
  return (
    <>
      <div
        style={{
          background: `linear-gradient(${props.item.colors?.hex}, ${colorShade(props.item.colors?.hex ?? '#333', -30)})`,
          width: (props.item.duration === -1 ? (Date.now() - props.item.in) / 1000 : props.item.duration) + 'px',
        }}
        class={styles.bar}
      >
        <Show when={props.item.duration === -1 || props.item.duration > 30} keyed>
          <div
            class={styles.icon}
            style={{
              'background-color': props.item.colors.isLight ? props.item.colors?.hex : '#fff',
              'border-color': props.item.colors.isLight ? props.item.colors?.hex : '#fff',
            }}
          >
            <img src={props.item.icon} alt={props.item.url} />
          </div>
        </Show>
      </div>
    </>
  );
};
