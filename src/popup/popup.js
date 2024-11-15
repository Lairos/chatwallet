document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = new ChatWindow();
  
  // 儲存視窗大小
  function saveWindowSize() {
    const body = document.body;
    chrome.storage.local.set({
      windowSize: {
        width: body.offsetWidth,
        height: body.offsetHeight
      }
    });
  }

  // 載入視窗大小
  chrome.storage.local.get(['windowSize'], (result) => {
    if (result.windowSize) {
      document.body.style.width = `${result.windowSize.width}px`;
      document.body.style.height = `${result.windowSize.height}px`;
    }
  });

  // 實作視窗大小調整
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  document.body.appendChild(resizeHandle);

  let isResizing = false;
  let originalWidth;
  let originalHeight;
  let originalX;
  let originalY;

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    originalWidth = document.body.offsetWidth;
    originalHeight = document.body.offsetHeight;
    originalX = e.clientX;
    originalY = e.clientY;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const width = originalWidth + (e.clientX - originalX);
    const height = originalHeight + (e.clientY - originalY);

    // 限制最小尺寸
    if (width >= 300) document.body.style.width = `${width}px`;
    if (height >= 400) document.body.style.height = `${height}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      saveWindowSize();
    }
  });
}); 