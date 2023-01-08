import { handleTabUpdated } from '@pages/background/listeners/handleTabUpdated';
import { handleTabActivated } from '@pages/background/listeners/handleTabActivated';
import { setJourney } from '@pages/background/shared';
import { openHistory } from '@pages/background/openHistory';

export const registerListeners = () => {
  chrome.tabs.onActivated.addListener(handleTabActivated);

  chrome.tabs.onUpdated.addListener(handleTabUpdated);

  chrome.action.onClicked.addListener(openHistory);

  chrome.runtime.onMessage.addListener(({ type }) => {
    if (type === 'clear') {
      setJourney([]);
    }
  });
};
