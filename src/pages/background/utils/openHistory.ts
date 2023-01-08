export const openHistory = async (): Promise<void> => {
  await chrome.tabs.create({ url: 'chrome://history' });
};
