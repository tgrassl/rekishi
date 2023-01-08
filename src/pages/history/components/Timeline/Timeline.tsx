import { createWindowSize } from '@solid-primitives/resize-observer';
import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { useJourney } from '@pages/history/providers/JourneyProvider';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { draggable as draggableDirective } from '@pages/history/directives/draggable';
import styles from './Timeline.module.scss';

const draggable = draggableDirective;

const getTimeText = (time: number) => {
  if (Math.round(time) <= 0) return 'Now';
  else if (time <= 60) return `${Math.round(time)} seconds ago`;
  else if (time > 60 && time < 3600) return `${Math.round(time / 60)} minutes ago`;
  else if (time > 3600) return `${Math.round(time / 3600)} hours ago`;
  return time;
};

export const Timeline = () => {
  let timelineRef: HTMLDivElement;
  const time = Date.now();

  console.log({ time });

  const { setActiveItem, journey } = useJourney();
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const size = createWindowSize();

  const reversed = [...journey()].reverse();

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
    const gap = 3;
    console.log(elapsedTime);

    const activeItems = reversed.filter((item, index) => {
      const timeIn = (time - item.in) / 1000;

      if (!item.out) {
        return timeIn + gap >= elapsedTime;
      }

      const timeOut = (time - item.out) / 1000;
      const checkIn = timeIn + (index + 1) * gap >= elapsedTime;
      const checkOut = timeOut + (index + 1) * gap <= elapsedTime;

      console.log(index, timeIn + (index + 1) * gap, timeOut + (index + 1) * gap);

      return checkIn && checkOut;
    });

    console.log(activeItems);

    setActiveItem(activeItems[0]);
    setElapsedTime(elapsedTime);
  };

  return (
    <div class={styles.container}>
      <div class={styles.timeline} ref={timelineRef} use:draggable={handleMove}>
        <Show when={elapsedTime() > size.width / 2}>
          <button class={styles.jump} onClick={jumpForward}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
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
