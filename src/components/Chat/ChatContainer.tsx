import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { LoadingIndicator } from './LoadingIndicator';
import { chatService } from '../../services/api';
import { ChatState, Message } from '../../types/chat';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    conversationId: 'default',
    isLoading: false,
    error: null,
  });
  const [showFullDetails, setShowFullDetails] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await chatService.sendMessage(message, chatState.conversationId);
      
      setChatState(prev => ({
        ...prev,
        messages: response.messages,
        conversationId: response.conversation_id,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send message. Please try again.',
      }));
    }
  };

  const handleClearConversation = async () => {
    try {
      await chatService.clearConversation(chatState.conversationId);
      setChatState(prev => ({
        ...prev,
        messages: [],
        error: null,
      }));
    } catch (error) {
      console.error('Error clearing conversation:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to clear conversation.',
      }));
    }
  };

  const handleRetry = () => {
    setChatState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <div className="w-28 h-12 overflow-hidden">
            <img
              src="bwell_logo.png" // Make sure this path is correct relative to the public folder
              alt="B.Well Logo"
              className="object-contain w-full h-full"
            />
          </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Companion</h1>
              <p className="text-sm text-gray-600">Intelligent Medical Support</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showFullDetails}
                onChange={() => setShowFullDetails((prev) => !prev)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Show Reasoning</span>
            </label>
            <button
              onClick={handleClearConversation}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <RefreshCw size={16} />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatState.messages.length === 0 && !chatState.isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              {/* Replace logo here */}
              <div className="w-56 h-15 mx-auto overflow-hidden">
                <img
                  src="bwell_logo.png" // Update this path accordingly
                  alt="B.Well Logo"
                  className="object-contain w-full h-full"
                />
              </div>
              
              <p className="text-gray-600 max-w-md mx-auto">
                Describe your symptoms or medical concerns, and I'll help guide you through 
                a systematic diagnostic process with questions and test recommendations.
              </p>
            </div>
          </div>
        )}

        {(showFullDetails
          ? chatState.messages
          : chatState.messages.filter(
              (message) =>
                message.agent === 'RequestTest' ||
                message.agent === 'ProvideDiagnosis' ||
                message.agent === 'AskQuestion' ||
                message.role === 'user' ||
                (message.role === 'assistant' && !message.agent)
            )
        ).map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {chatState.isLoading && <LoadingIndicator />}

        {chatState.error && (
          <div className="flex items-center justify-center p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="text-red-500" size={20} />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{chatState.error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
        disabled={!!chatState.error}
      />
    </div>
  );
};

export async function streamChatMessage(
  message: string,
  conversationId: string,
  onToken: (token: string) => void
) {
  const response = await fetch('http://localhost:8000/chat/stream', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId }),
    headers: { 'Content-Type': 'application/json' }
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  let done = false;
  let partial = '';
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      partial += decoder.decode(value, { stream: true });
      if (partial) {
        onToken(partial); // Call this to update the UI
        partial = '';
      }
    }
  }
}