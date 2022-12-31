import { TimelineBar } from '@pages/history/components/TimelineBar/TimelineBar';
import { colorShade } from '@src/utils/colors';
import { FastAverageColor } from 'fast-average-color';
import { createEffect, createResource, createSignal, For } from 'solid-js';
import styles from './Timeline.module.scss';

const groupBy = (array, key) => {
  return array.reduce((result, currentItem) => {
    (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
    return result;
  }, {}); // Empty object is the initial value for result object
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
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
}

const getHistoryData = async () => {
  // const data = await chrome.storage.local.get(["history"]);
  const data = await chrome.storage.local.get(['test']);
  return data?.test ?? [];
};

const fetchAndMapHistory = async () => {
  const data = await getHistoryData();
  const dataWithColors = await Promise.all(
    data.map(async (item) => {
      const iconUrl = getFaviconUrl(item.url);
      const colors = await fac.getColorAsync(iconUrl, { ignoredColor: [255, 255, 255, 255] });
      const brightIconColor = colors.hex === '#ffffff';
      return {
        ...item,
        icon: iconUrl,
        colors: { isDark: colors.isDark, hex: brightIconColor ? colorShade('#ffffff', -50) : colors.hex, isLight: brightIconColor },
        duration: item.out ? (item.out - item.in) / 1000 : -1,
      };
    })
  );
  console.log(dataWithColors);

  const grouped = groupBy(dataWithColors, 'tab');

  console.log(grouped);
  return Object.values(grouped);
};

export const Timeline = () => {
  // const [history, setHistory] = createSignal([]);
  const [tabs] = createResource<any[]>(fetchAndMapHistory);
  const [elapsedTime, setElapsedTime] = createSignal(0);
  let timelineRef: HTMLDivElement;

  createEffect(() => {
    if (!tabs.loading) {
      const middle = window.innerWidth / 2;
      timelineRef.style.paddingRight = middle + 'px';
      timelineRef.style.paddingLeft = middle + 'px';

      timelineRef.scrollLeft = timelineRef.scrollWidth;

      timelineRef.addEventListener('wheel', function () {
        const scrolledTime = timelineRef.scrollWidth - window.innerWidth - timelineRef.scrollLeft;
        setElapsedTime(scrolledTime);
        console.log('scroll amount', scrolledTime);
        // if (e.deltaY > 0) item.scrollLeft += 100;
        // else item.scrollLeft -= 100;
      });
    }
  });

  return (
    <div class={styles.container}>
      <div class={styles.timeline} ref={timelineRef}>
        <div class={styles.seekArea}>
          <div class={styles.seekTime}>{getTimeText(elapsedTime())}</div>
          <div class={styles.seekbar} />
        </div>
        <span>{tabs.loading && 'Loading...'}</span>
        <div class={styles.tabs}>
          <For each={tabs()}>
            {(tab) => (
              <div
                class={styles.tab}
                style={
                  {
                    // width: (tab[tab.length - 1].in - tab[0].in) / 1000 + 'px',
                    // 'padding-left': (Date.now() - tab[0].in) / 1000 + 'px',
                  }
                }
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
