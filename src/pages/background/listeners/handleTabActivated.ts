import { addPreviewAndStore, getActiveVisit, setActiveVisit } from './shared';

export const handleTabActivated = async (data) => {
  const tab = await chrome.tabs.get(data.tabId);
  if (tab.status === 'loading' || !tab.url) return;

  const currentTab = getActiveVisit();
  const { url, title, favIconUrl } = tab;
  if (currentTab?.url !== url) {
    console.log('active tab changed!', tab);
    setActiveVisit({ url, title, favIconUrl, tabId: data.tabId });
    await addPreviewAndStore({ url });
  }
};
