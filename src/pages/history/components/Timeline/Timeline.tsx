import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { createEffect, createSignal, For } from 'solid-js';
import styles from './Timeline.module.scss';
import { HistoryItem } from '@src/model/historyItem';
import { groupBy } from '@src/utils/groupBy';
import { useHistory } from '@pages/history/providers/HistoryProvider';

const getTimeText = (time: number) => {
  if (Math.round(time) <= 0) return 'Now';
  else if (time < 60) return `${Math.round(time)} seconds ago`;
  else if (time > 60 && time < 3600) return `${Math.round(time / 60)} minutes ago`;
  else if (time > 3600) return `${Math.round(time / 3600)} hours ago`;
  return time;
};

export const Timeline = (props) => {
  const { setActiveItem } = useHistory();
  const [elapsedTime, setElapsedTime] = createSignal(0);

  let timelineRef: HTMLDivElement;
  let isDown = false;
  let startX;
  let scrollLeft;
  const time = Date.now();

  createEffect(() => {
    if (!props.history.loading) {
      const middle = window.innerWidth / 2;
      timelineRef.style.paddingRight = middle + 'px';

      // @todo add difference between latest item and now
      timelineRef.style.paddingLeft = middle + 'px';

      timelineRef.addEventListener(
        'wheel',
        function () {
          const scrolledTime = timelineRef.scrollWidth - window.innerWidth - timelineRef.scrollLeft;
          setElapsedTime(scrolledTime);
        },
        { passive: true }
      );
    }
  });

  setTimeout(() => {
    timelineRef.scrollLeft = timelineRef.scrollWidth;
  }, 150);

  const handleSeekDown = (e: MouseEvent) => {
    isDown = true;
    timelineRef.classList.add('active');
    startX = e.pageX - timelineRef.offsetLeft;
    scrollLeft = timelineRef.scrollLeft;
    timelineRef.style.cursor = 'grabbing';
  };

  const handleSeekLeave = () => {
    isDown = false;
    timelineRef.style.cursor = 'grab';
  };

  const handleSeekUp = () => {
    isDown = false;
    timelineRef.style.cursor = 'grab';
  };

  const handleSeekMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.offsetLeft;
    const deltaX = (x - startX) * 2;
    timelineRef.scrollLeft = scrollLeft - deltaX;

    const scrolledTime = timelineRef.scrollWidth - window.innerWidth - timelineRef.scrollLeft;
    const elapsedTime = scrolledTime < 0 ? 0 : scrolledTime;
    const activeItems = props.history().filter((item) => {
      const checkIn = (time - item.in) / 1000 >= elapsedTime;
      if (!item.out) {
        return checkIn;
      }
      return checkIn && (time - item.out) / 1000 <= elapsedTime;
    });

    setActiveItem(activeItems[0]);
    setElapsedTime(elapsedTime);
  };

  return (
    <div class={styles.container}>
      <div
        class={styles.timeline}
        ref={timelineRef}
        onMouseDown={handleSeekDown}
        onMouseLeave={handleSeekLeave}
        onMouseUp={handleSeekUp}
        onMouseMove={handleSeekMove}
      >
        <div class={styles.seekArea}>
          <div class={styles.seekTime}>{getTimeText(elapsedTime())}</div>
          <div class={styles.seekbar} />
        </div>
        <span>{props.history.loading && 'Loading...'}</span>
        <For each={props.history()}>{(item) => <TimelineBar item={item} />}</For>
      </div>
    </div>
  );
};
