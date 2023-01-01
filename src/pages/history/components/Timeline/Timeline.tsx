import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { createEffect, createSignal, For } from 'solid-js';
import styles from './Timeline.module.scss';
import { HistoryItem } from '@src/model/historyItem';
import { groupBy } from '@src/utils/groupBy';

const getTimeText = (time: number) => {
  if (Math.round(time) <= 0) return 'Now';
  else if (time < 60) return `${Math.round(time)} seconds ago`;
  else if (time > 60 && time < 3600) return `${Math.round(time / 60)} minutes ago`;
  else if (time > 3600) return `${Math.round(time / 3600)} hours ago`;
  return time;
};

export const Timeline = (props) => {
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [groupedTabs, setGroupedTabs] = createSignal([]);

  let timelineRef: HTMLDivElement;
  let isDown = false;
  let startX;
  let scrollLeft;

  createEffect(() => {
    if (!props.history.loading) {
      const grouped = groupBy<HistoryItem[]>(props.history(), 'tab');
      const groupedArray = Object.values(grouped);
      const groupedArraySorted = groupedArray.sort((a, b) => (a.key > b.key ? -1 : 1));

      console.log(groupedArraySorted);
      setGroupedTabs(groupedArraySorted);

      const middle = window.innerWidth / 2;
      timelineRef.style.paddingRight = middle + 'px';
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
    setElapsedTime(scrolledTime);
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
        <div class={styles.tabs}>
          <For each={groupedTabs()}>
            {({ contents: tab }) => (
              <div
                class={styles.tab}
                style={{
                  'padding-left': (tab[0].in - props.history()[0].in) / 1000 + 'px',
                }}
              >
                <For each={tab}>{(item) => <TimelineBar item={item} />}</For>
              </div>
            )}
          </For>
        </div>
        {/*<For each={history()}>{(item) => <TimelineBar item={item} />}</For>*/}
      </div>
    </div>
  );
};
