import { registerListeners } from '@pages/background/listeners/register';

console.log('background loaded');

chrome.runtime.onStartup.addListener(() => {
  console.log('started up!');
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('installed!');
});

registerListeners();
