import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { colorShade } from '@src/utils/colors';
import { FastAverageColor } from 'fast-average-color';
import { createEffect, createResource, createSignal, For } from 'solid-js';
import styles from './Timeline.module.scss';
import { HistoryItem } from '@src/model/historyItem';

const groupBy = <T extends any[]>(array: T, key: string): { contents: T; key: number }[] => {
  return array.reduce((result, currentItem) => {
    const existingItem = result.find((resultItem) => resultItem[key] === currentItem[key]);

    if (!existingItem) {
      result.push({ key: currentItem[key], contents: [currentItem] });
    } else {
      existingItem.contents = [...existingItem.contents, currentItem];
    }

    return result;
  }, []);
};

const fac = new FastAverageColor();

const getTimeText = (time: number) => {
  if (Math.round(time) <= 0) return 'Now';
  else if (time < 60) return `${Math.round(time)} seconds ago`;
  else if (time > 60 && time < 3600) return `${Math.round(time / 60)} minutes ago`;
  else if (time > 3600) return `${Math.round(time / 3600)} hours ago`;
  return time;
};

function getFaviconUrl(url) {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=64`;
}

const getHistoryData = async (): Promise<HistoryItem[]> => {
  // const data = await chrome.storage.local.get(["history"]);
  const data = await chrome.storage.local.get(['test']);
  return data?.test ?? [];
};

const fetchAndMapHistory = async () => {
  const data = await getHistoryData();
  return await Promise.all(
    data.map(async (item) => {
      const iconUrl = getFaviconUrl(item.url);
      const colors = await fac.getColorAsync(iconUrl, { ignoredColor: [255, 255, 255, 255] });
      const brightIconColor = colors.hex === '#ffffff';
      return {
        ...item,
        icon: iconUrl,
        colors: {
          isDark: colors.isDark,
          hex: brightIconColor ? colorShade('#ffffff', -50) : colors.hex,
          isLight: brightIconColor,
        },
        duration: item.out ? (item.out - item.in) / 1000 : -1,
      };
    })
  );
};

export const Timeline = () => {
  // const [history, setHistory] = createSignal([]);
  const [tabs] = createResource<HistoryItem[]>(fetchAndMapHistory);
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [groupedTabs, setGroupedTabs] = createSignal([]);
  let timelineRef: HTMLDivElement;

  createEffect(() => {
    if (!tabs.loading) {
      const grouped = groupBy<HistoryItem[]>(tabs(), 'tab');
      const groupedArray = Object.values(grouped);
      const groupedArraySorted = groupedArray.sort((a, b) => (a.key > b.key ? -1 : 1));

      console.log(groupedArraySorted);
      setGroupedTabs(groupedArraySorted);

      const middle = window.innerWidth / 2;
      timelineRef.style.paddingRight = middle + 'px';
      timelineRef.style.paddingLeft = middle + 'px';

      timelineRef.addEventListener('wheel', function () {
        const scrolledTime = timelineRef.scrollWidth - window.innerWidth - timelineRef.scrollLeft;
        setElapsedTime(scrolledTime);
      });
    }
  });

  setTimeout(() => {
    timelineRef.scrollLeft = timelineRef.scrollWidth;
  }, 150);

  let isDown = false;
  let startX;
  let scrollLeft;

  const handleSeekDown = (e: MouseEvent) => {
    isDown = true;
    timelineRef.classList.add('active');
    startX = e.pageX - timelineRef.offsetLeft;
    scrollLeft = timelineRef.scrollLeft;
  };

  const handleSeekLeave = () => {
    isDown = false;
  };

  const handleSeekUp = () => {
    isDown = false;
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
        <span>{tabs.loading && 'Loading...'}</span>
        <div class={styles.tabs}>
          <For each={groupedTabs()}>
            {({ contents: tab }) => (
              <div
                class={styles.tab}
                style={{
                  'padding-left': (tab[0].in - tabs()[0].in) / 1000 + 'px',
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
