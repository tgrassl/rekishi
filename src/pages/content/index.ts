// const head = document.head;
// const favIcon: HTMLLinkElement = head.querySelector('[rel*="icon"]');
// const favIconLink = favIcon?.href ?? `${window.location.origin}/favicon.ico`;
// console.log({ favIcon });

// const fac = new FastAverageColor();

console.log(document.readyState);
setTimeout(async () => {
  console.log(document.readyState, 'loaded! sending message...');
  await chrome.runtime.sendMessage({
    type: 'page',
    payload: {
      url: window.location.href,
      title: document.title,
      // colors: {
      //   isDark: colors.isDark,
      //   hex: colors.hex,
      // },
    },
  });
}, 500);

// (async () => {
// const colors = await fac.getColorAsync(
//   `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(window.location.origin)}&size=32`
// );

// try {
//   const ts = performance.now();
//
//   const image = await toPng(document.body, {
//     width: document.body.scrollWidth,
//     height: document.body.scrollHeight,
//     fetchRequestInit: { mode: 'no-cors' },
//   });
//   const payloadBytes = strToU8(image);
//   const compressed = gzipSync(payloadBytes);
//
//   const measure = performance.now() - ts;
//   console.log(Math.round(measure / 1000));
//   const img = new Image();
//   img.src = image;
//   document.body.appendChild(img);
//
//   console.log({ compressed });
// } catch (error) {
//   console.log('error image generation', error);
// }

// console.log({ colors });

// // do something with response here, not outside the function
// console.log(response);
// })();
