import { createWindowSize } from '@solid-primitives/resize-observer';
import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { useJourney } from '@pages/history/providers/JourneyProvider';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { draggable as draggableDirective } from '@pages/history/directives/draggable';
import styles from './Timeline.module.scss';
import { getTimeText } from '@shared/utils/getTimeText';

export const TimelineButton = (props) => {
  return (
    <button class={styles.jump} onClick={props.onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
};

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
          <TimelineButton onClick={jumpForward} />
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
