import { PageVisit } from '@shared/model/pageVisit';
import { getStorageKeyForDay } from '@shared/utils/journey';

let activeVisit: PageVisit = null;
export let journey = [];

export const setJourney = (data: PageVisit[]) => {
  journey = data;
};

export const addPreviewAndStore = async ({ url }) => {
  try {
    await addPreviewToUrl({ url });
    const dayKey = getStorageKeyForDay();
    await chrome.storage.local.set({ [dayKey]: journey });
  } catch (error) {
    setTimeout(async () => {
      await addPreviewAndStore({ url });
    }, 100);
  }
};

export const addPreviewToUrl = async ({ url }) => {
  const indexToUpdate = journey.findIndex((item) => item.url === url);
  if (indexToUpdate > -1) {
    const preview = await chrome.tabs.captureVisibleTab({ format: 'jpeg', quality: 80 });

    const itemToUpdate = journey[indexToUpdate];
    journey[indexToUpdate] = { ...itemToUpdate, preview };
    console.log('added preview to ', url);
  }
};

export const updatePreviousVisit = (tabId) => {
  if (activeVisit && journey.length > 0) {
    if (activeVisit.tab === tabId) {
      const existingTabItems = journey.filter((item) => item.tab === tabId);

      if (existingTabItems.length > 0) {
        const lastItemInTabIndex = journey.indexOf(existingTabItems[existingTabItems.length - 1]);
        const item = journey[lastItemInTabIndex];
        console.log('updating previous item in same tab', item);
        journey[lastItemInTabIndex] = { ...item, out: +new Date() };
      }
    } else {
      const item = journey[journey.length - 1];
      console.log('setting out on previous item', item);
      journey[journey.length - 1] = { ...item, out: +new Date() };
    }
  }
};

export const setActiveVisit = ({ url, title, favIconUrl, tabId }) => {
  updatePreviousVisit(tabId);

  const newActiveVisit = { url, title, icon: favIconUrl, in: Date.now(), tab: tabId };
  const alreadyVisitedIndex = journey.findIndex((item) => item.url === url);

  if (alreadyVisitedIndex > -1) {
    activeVisit = { ref: alreadyVisitedIndex, in: Date.now(), tab: tabId };
  } else {
    activeVisit = newActiveVisit;
  }

  journey.push(activeVisit);
  console.log({ journey });
};

export const getActiveVisit = () => {
  if (activeVisit && Object.hasOwn(activeVisit, 'ref')) {
    return journey[activeVisit.ref];
  }
  return activeVisit;
};
