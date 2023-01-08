import { handleTabUpdated } from '@pages/background/listeners/handleTabUpdated';
import { handleTabActivated } from '@pages/background/listeners/handleTabActivated';
import { setJourney } from '@pages/background/listeners/shared';

export const registerListeners = () => {
  chrome.tabs.onActivated.addListener(handleTabActivated);

  chrome.tabs.onUpdated.addListener(handleTabUpdated);

  chrome.runtime.onMessage.addListener(({ type }) => {
    if (type === 'clear') {
      setJourney([]);
    }
  });
};
