import { registerListeners } from '@pages/background/listeners/register';

import { setJourney } from '@pages/background/shared';
import { getJourneyData } from '@shared/utils/getJourney';
import { openHistory } from '@pages/background/openHistory';

console.log('background loaded');

(async () => {
  const data = await getJourneyData();
  console.log('stored data for today', data);
  setJourney(data);
})();

chrome.runtime.onInstalled.addListener(() => {
  openHistory();
});

registerListeners();
