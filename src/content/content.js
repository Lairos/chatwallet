let chatWindowElement = null;

// 監聽來自 background script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleChatWindow') {
    if (!chatWindowElement) {
      createChatWindow();
    } else {
      chatWindowElement.style.display = 
        chatWindowElement.style.display === 'none' ? 'flex' : 'none';
    }
  }
});

async function createChatWindow() {
  // 載入 HTML 內容
  const response = await fetch(chrome.runtime.getURL('src/popup/popup.html'));
  const html = await response.text();
  
  // 創建容器元素
  const container = document.createElement('div');
  container.innerHTML = html;
  chatWindowElement = container.querySelector('#chat-window');
  
  // 載入 CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('src/popup/popup.css');
  document.head.appendChild(link);
  
  // 載入 ChatWindow.js
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/components/ChatWindow.js');
  script.type = 'module';
  document.body.appendChild(script);
  
  // 添加到頁面
  document.body.appendChild(chatWindowElement);
  
  // 初始化聊天視窗
  const chatWindow = new ChatWindow();
  
  // 綁定關閉按鈕事件
  const closeBtn = chatWindowElement.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindowElement.style.display = 'none';
    });
  }
  
  // 綁定最小化按鈕事件
  const minimizeBtn = chatWindowElement.querySelector('.minimize-btn');
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      const messagesContainer = chatWindowElement.querySelector('.chat-messages');
      const inputContainer = chatWindowElement.querySelector('.chat-input');
      
      if (messagesContainer.style.display !== 'none') {
        messagesContainer.style.display = 'none';
        inputContainer.style.display = 'none';
        chatWindowElement.style.height = '40px';
      } else {
        messagesContainer.style.display = 'block';
        inputContainer.style.display = 'flex';
        chatWindowElement.style.height = '600px';
      }
    });
  }
} 