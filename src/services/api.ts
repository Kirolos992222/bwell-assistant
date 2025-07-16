import axios from 'axios';
import { ChatResponse } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    const response = await api.post('/chat', {
      message,
      conversation_id: conversationId,
    });
    return response.data;
  },

  getConversation: async (conversationId: string): Promise<ChatResponse> => {
    const response = await api.get(`/conversation/${conversationId}`);
    return response.data;
  },

  clearConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversation/${conversationId}`);
  },
};