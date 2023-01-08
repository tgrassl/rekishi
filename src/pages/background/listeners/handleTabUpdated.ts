import { addPreviewAndStore, getActiveVisit, setActiveVisit } from '../data/journeyData';

export const handleTabUpdated = async (tabId) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.status === 'loading' || !tab.url) return;

    const { url, title, favIconUrl } = tab;
    const currentTab = getActiveVisit();

    // tab url changed
    if (currentTab?.url !== url) {
      setActiveVisit({ url, title, favIconUrl, tabId });
      await addPreviewAndStore({ url });
    } else {
      if (title !== currentTab.title) {
        currentTab.title = title;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
