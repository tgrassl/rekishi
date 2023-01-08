import { createWindowSize } from '@solid-primitives/resize-observer';
import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { useJourney } from '@pages/history/providers/JourneyProvider';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { draggable as draggableDirective } from '@pages/history/directives/draggable';
import styles from './Timeline.module.scss';
import { getTimeText } from '@shared/utils/getTimeText';
import { TimelineButton } from '@pages/history/components/TimelineButton/TimelineButton';

const draggable = draggableDirective;

const BAR_GAP = 4;

export const Timeline = () => {
  const { setActiveItem, journey } = useJourney();
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const size = createWindowSize();

  let timelineRef: HTMLDivElement;
  const time = Date.now();
  const journeyReversed = [...journey()].reverse();

  createEffect(() => {
    const middle = size.width / 2;
    timelineRef.style.paddingRight = middle + 'px';
    timelineRef.style.paddingLeft = middle + 'px';

    timelineRef.addEventListener('wheel', () => handleMove(timelineRef), { passive: true });

    jumpForward();
  });

  const jumpForward = () => {
    timelineRef.scrollLeft = timelineRef.scrollWidth;
    setElapsedTime(0);
    setActiveItem(journey()[journey().length - 1]);
  };

  const handleMove = (timeline: HTMLDivElement) => {
    const scrolledTime = timeline.scrollWidth - size.width - timeline.scrollLeft;
    const elapsedTime = scrolledTime < 0 ? 0 : scrolledTime;

    const activeItems = journeyReversed.filter((item, index) => {
      const position = index + 1;
      const timeIn = (time - item.in) / 1000;
      const timeOut = item.out ? (time - item.out) / 1000 : null;

      if (!timeOut) {
        return timeIn + BAR_GAP >= elapsedTime;
      }

      const checkIn = timeIn + position * BAR_GAP >= elapsedTime;
      const checkOut = timeOut <= elapsedTime;

      return checkIn && checkOut;
    });

    setActiveItem(activeItems[0]);
    setElapsedTime(elapsedTime);
  };

  return (
    <div class={styles.container}>
      <div class={styles.timeline} ref={timelineRef} use:draggable={handleMove}>
        <Show when={elapsedTime() > size.width / 2}>
          <TimelineButton class={styles.jump} onClick={jumpForward} />
        </Show>
        <div class={styles.seekArea}>
          <div class={styles.seekTime}>{getTimeText(elapsedTime())}</div>
          <div class={styles.seekbar} />
        </div>
        <For each={journey()}>{(item) => <TimelineBar item={item} />}</For>
      </div>
    </div>
  );
};
