import { handleTabUpdated } from '@pages/background/listeners/handleTabUpdated';
import { handleTabActivated } from '@pages/background/listeners/handleTabActivated';

export const registerListeners = () => {
  chrome.tabs.onActivated.addListener(handleTabActivated);

  chrome.tabs.onUpdated.addListener(handleTabUpdated);
};
