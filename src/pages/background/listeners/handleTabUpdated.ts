import { addPreviewAndStore, getActiveVisit, setActiveVisit } from './shared';

export const handleTabUpdated = async (tabId) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.status === 'loading' || !tab.url) return;

  const { url, title, favIconUrl } = tab;
  const currentTab = getActiveVisit();
  if (currentTab?.url !== url) {
    console.log(`tab url changed!`, currentTab?.url, '=>', url);
    setActiveVisit({ url, title, favIconUrl, tabId });
    await addPreviewAndStore({ url });
  } else {
    if (title !== currentTab.title) {
      console.log('tab title changed!', title);
      currentTab.title = title;
    }
  }
};
