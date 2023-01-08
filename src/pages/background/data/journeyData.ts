import { PageVisit } from '@shared/model/pageVisit';
import { getStorageKeyForDay } from '@shared/utils/getJourney';

const currentDayKey = getStorageKeyForDay();

let activeVisit: PageVisit = null;
let journey = [];

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
  }
};

export const updatePreviousVisit = (tabId) => {
  if (activeVisit && journey.length > 0) {
    if (activeVisit.tab === tabId) {
      const existingTabItems = journey.filter((item) => item.tab === tabId);

      // update previous item in same tab
      if (existingTabItems.length > 0) {
        const lastItemInTabIndex = journey.indexOf(existingTabItems[existingTabItems.length - 1]);
        const item = journey[lastItemInTabIndex];
        journey[lastItemInTabIndex] = { ...item, out: +new Date() };
      }
    } else {
      // update previous item
      const item = journey[journey.length - 1];
      journey[journey.length - 1] = { ...item, out: +new Date() };
    }
  }
};

export const setActiveVisit = ({ url, title, favIconUrl, tabId }) => {
  updatePreviousVisit(tabId);

  const newActiveVisit = { url, title, icon: favIconUrl, in: Date.now(), tab: tabId };
  const alreadyVisitedIndex = journey.findIndex((item) => item.url === url);

  if (alreadyVisitedIndex > -1) {
    // reference already visited item
    activeVisit = { ref: alreadyVisitedIndex, in: Date.now(), tab: tabId };
  } else {
    activeVisit = newActiveVisit;
  }

  const dayKey = getStorageKeyForDay();
  if (currentDayKey !== dayKey) {
    setJourney([]);
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
