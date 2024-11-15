// 監聽擴充功能安裝事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatWallet 已安裝');
});

// 監聽擴充功能圖示點擊事件
chrome.action.onClicked.addListener((tab) => {
  // 向當前分頁發送消息，顯示聊天視窗
  chrome.tabs.sendMessage(tab.id, { action: 'toggleChatWindow' });
}); 