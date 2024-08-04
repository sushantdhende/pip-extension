document.getElementById('pipButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id, allFrames: true },
      function: togglePictureInPicture
    });
  });
});

function togglePictureInPicture() {
  const video = document.querySelector('video');
  if (video) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture();
    }
  } else {
    // If no video is found in the main document, check iframes
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeVideo = iframeDocument.querySelector('video');
        if (iframeVideo) {
          if (iframeDocument.pictureInPictureElement) {
            iframeDocument.exitPictureInPicture();
          } else {
            iframeVideo.requestPictureInPicture();
          }
          return;
        }
      } catch (e) {
        console.error('Cannot access iframe:', e);
      }
    }
    alert('No video element found on this page.');
  }
}
