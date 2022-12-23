console.log("background loaded");

const getHistoryData = async () => {
    const data = await chrome.storage.local.get(["history"]);
    return data?.history ?? [];
}

(async() => {
    const data = await getHistoryData();
    console.log('stored data', data)
})()

chrome?.history?.onVisited.addListener(
    async (data) => {
        console.log('history', data)
        const previous = await getHistoryData();
        const newData = [...previous, data];
        await chrome.storage.local.set({ history: newData });
    }
)



