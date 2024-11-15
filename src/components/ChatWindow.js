export class ChatWindow {
  constructor() {
    this.position = this.loadPosition();
    this.initializeDraggable();
    this.initializeResizable();
    this.bindEventListeners();
  }

  async loadPosition() {
    const result = await chrome.storage.local.get(['windowPosition']);
    return result.windowPosition || { x: 20, y: 20 };
  }

  initializeDraggable() {
    const header = document.querySelector('.chat-header');
    if (header) {
      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;

      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          const chatWindow = document.getElementById('chat-window');
          chatWindow.style.transform = 
            `translate(${currentX}px, ${currentY}px)`;
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  initializeResizable() {
    // 實作視窗大小調整功能
    // 可以之後再實作
  }

  bindEventListeners() {
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');

    if (sendBtn && messageInput) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加使用者訊息到聊天視窗
    this.addMessage(message, 'user');
    input.value = '';
    
    try {
      // 模擬 AI 回覆
      setTimeout(() => {
        this.addMessage('這是一個測試回覆', 'ai');
      }, 1000);
    } catch (error) {
      this.showError('發送訊息失敗，請稍後再試');
    }
  }

  addMessage(content, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showError(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = message;
    messagesContainer.appendChild(errorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// 如果在內容腳本中載入，自動初始化
if (typeof window !== 'undefined') {
  window.ChatWindow = ChatWindow;
} 