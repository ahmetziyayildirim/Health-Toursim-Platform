import apiService from './api';

// Chat API service
class ChatService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  // Get or create session ID
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
  }

  // Send message to AI
  async sendMessage(message) {
    try {
      const response = await apiService.post('/chat/message', {
        message,
        sessionId: this.sessionId
      });

      return response;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  // Get chat history
  async getChatHistory() {
    try {
      const response = await apiService.get(`/chat/history/${this.sessionId}`);
      return response;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }

  // Clear chat
  async clearChat() {
    try {
      const response = await apiService.post('/chat/clear', {
        sessionId: this.sessionId
      });

      // Create new session
      this.sessionId = this.getOrCreateSessionId();

      return response;
    } catch (error) {
      console.error('Clear chat error:', error);
      throw error;
    }
  }

  // Get quick suggestions
  async getSuggestions() {
    try {
      const response = await apiService.get('/chat/suggestions');
      return response;
    } catch (error) {
      console.error('Get suggestions error:', error);
      throw error;
    }
  }

  // Reset session (create new)
  resetSession() {
    localStorage.removeItem('chatSessionId');
    this.sessionId = this.getOrCreateSessionId();
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;
