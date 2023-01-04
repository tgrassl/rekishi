import { getHistoryData } from '@src/utils/history';
import { handleTabUpdated } from '@pages/background/listeners/handleTabUpdated';
import { handleTabActivated } from '@pages/background/listeners/handleTabActivated';
import { setJourney } from '@pages/background/listeners/shared';

(async () => {
  const data = await getHistoryData();
  console.log('stored data', data);
  setJourney(data);
})();

export const registerListeners = () => {
  chrome.tabs.onActivated.addListener(handleTabActivated);

  chrome.tabs.onUpdated.addListener(handleTabUpdated);
};
