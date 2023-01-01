import * as lz from 'lz-string';

console.log('background loaded');

const getHistoryData = async () => {
  const data = await chrome.storage.local.get(['test']);
  return data?.test ?? [];
};

(async () => {
  const data = await getHistoryData();
  console.log('stored data', data);
})();

// chrome?.history?.onVisited.addListener(
//     async (data) => {
//         console.log('history', data)
//         const previous = await getHistoryData();
//         const newData = [...previous, data];
//         await chrome.storage.local.set({ history: newData });
//     }
// )

chrome.runtime.onMessage.addListener(async function (request, sender) {
  const payload = request.payload;
  if (!payload) return;

  const { url, title, icon, colors } = payload;

  switch (request.type) {
    case 'page': {
      const screenshot = await chrome.tabs.captureVisibleTab({ format: 'jpeg', quality: 80 });
      const compressed = lz.compressToUTF16(screenshot);
      const payloadWithScreenshot = { ...payload, preview: compressed };

      const previous = await getHistoryData();
      let newData = [...previous, payloadWithScreenshot];

      const existingUrlIndex = previous.findIndex((data) => data.url === url && !data.title);
      if (existingUrlIndex !== -1) {
        console.log('adding metadata to:', existingUrlIndex);

        newData = [...previous];
        const item = newData[existingUrlIndex];

        const updatedItem = { ...item, ...payloadWithScreenshot };
        console.log('prepared', updatedItem, { ...payloadWithScreenshot });

        newData[existingUrlIndex] = updatedItem;
      }

      console.log('storing', newData);

      await chrome.storage.local.set({ test: newData });
      break;
    }
  }
  // sendResponse(image);
});

const handleNavigationUpdate = async (data) => {
  if (data.transitionType === 'auto_subframe') return;

  console.log('navigation about to occur!', data);

  const previous = await getHistoryData();

  let newData = [...previous];

  if (data.transitionType !== 'reload') {
    const existingTabItems = previous.filter((item) => item.tab === data.tabId);

    if (existingTabItems.length > 0) {
      const lastItemInTabIndex = previous.indexOf(existingTabItems[existingTabItems.length - 1]);
      const item = newData[lastItemInTabIndex];
      console.log('updating previous item in same tab', item);
      newData[lastItemInTabIndex] = { ...item, out: +new Date() };
    }
  }

  const tabGroup = await chrome.tabs.get(data.tabId);

  newData = [...newData, { tab: data.tabId, in: data.timeStamp, url: data.url, group: tabGroup.groupId }];
  await chrome.storage.local.set({ test: newData });
};

// chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigationUpdate, { url: [{ schemes: ['https'] }] });
chrome.webNavigation.onHistoryStateUpdated.addListener((data) => console.log('state updated!', data), { url: [{ schemes: ['https'] }] });

chrome.webNavigation.onCommitted.addListener(handleNavigationUpdate, { url: [{ schemes: ['https'] }] });

chrome.tabs.onRemoved.addListener(async (tabId) => {
  console.log('tab closed!', tabId);
  const previous = await getHistoryData();
  const existingTabItems = previous.filter((data) => data.tab === tabId);

  if (existingTabItems.length > 0) {
    const lastItemInTabIndex = previous.indexOf(existingTabItems[existingTabItems.length - 1]);
    const newData = [...previous];
    const item = newData[lastItemInTabIndex];
    newData[lastItemInTabIndex] = { ...item, out: +new Date() };
    await chrome.storage.local.set({ test: newData });
  }
});
