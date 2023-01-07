import { registerListeners } from '@pages/background/listeners/register';

import { setJourney } from '@pages/background/listeners/shared';
import { getJourneyData } from '@shared/utils/journey';

console.log('background loaded');

(async () => {
  const data = await getJourneyData();
  console.log('stored data for today', data);
  setJourney(data);
})();

chrome.runtime.onStartup.addListener(() => {
  console.log('started up!');
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('installed!');
});

registerListeners();
