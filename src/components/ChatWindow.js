export class ChatWindow {
  constructor() {
    this.position = this.loadPosition();
    this.initializeDraggable();
    this.initializeResizable();
    this.bindEventListeners();
  }

  loadPosition() {
    // 從 storage 讀取上次位置
    return chrome.storage.local.get(['windowPosition'])
      .then(result => result.windowPosition || { x: 20, y: 20 });
  }

  initializeDraggable() {
    const header = document.querySelector('.chat-header');
    header.addEventListener('mousedown', this.startDragging.bind(this));
  }

  initializeResizable() {
    // 實作視窗大小調整功能
  }

  bindEventListeners() {
    document.getElementById('send-btn').addEventListener('click', this.sendMessage.bind(this));
    document.getElementById('message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加使用者訊息到聊天視窗
    this.addMessage(message, 'user');
    input.value = '';
    
    // 發送到 API 並處理回應
    try {
      const response = await this.sendToAPI(message);
      this.addMessage(response, 'ai');
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
} 