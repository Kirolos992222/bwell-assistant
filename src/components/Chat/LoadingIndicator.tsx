import React from 'react';
import { Bot, Brain } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[85%]">
        <div className="mr-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center animate-pulse">
            <Brain size={16} />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-xs font-medium mb-1 px-2 py-1 rounded-full self-start text-purple-700 bg-purple-50 border border-purple-200 animate-pulse">
            Processing Agents...
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-purple-700">Agents analyzing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};