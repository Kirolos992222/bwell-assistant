import React from 'react';
import { Message } from '../../types/chat';
import { User, Bot, Brain, AlertTriangle, TestTube, HelpCircle, FileText, Stethoscope } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const getAgentConfig = (agent?: string) => {
  switch (agent) {
    case 'HypothesisAgent':
      return {
        name: 'Hypothesis Agent',
        icon: Brain,
        bgColor: 'bg-purple-500',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-700',
        bgLight: 'bg-purple-50'
      };
    case 'ChallengerAgent':
      return {
        name: 'Challenger Agent',
        icon: AlertTriangle,
        bgColor: 'bg-orange-500',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-700',
        bgLight: 'bg-orange-50'
      };
    case 'TestChooserAgent':
      return {
        name: 'Test Chooser Agent',
        icon: TestTube,
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        bgLight: 'bg-blue-50'
      };
    case 'AskQuestion':
      return {
        name: 'Question Agent',
        icon: HelpCircle,
        bgColor: 'bg-green-500',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        bgLight: 'bg-green-50'
      };
    case 'RequestTest':
      return {
        name: 'Test Request Agent',
        icon: FileText,
        bgColor: 'bg-indigo-500',
        borderColor: 'border-indigo-200',
        textColor: 'text-indigo-700',
        bgLight: 'bg-indigo-50'
      };
    case 'ProvideDiagnosis':
      return {
        name: 'Diagnosis Agent',
        icon: Stethoscope,
        bgColor: 'bg-red-500',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        bgLight: 'bg-red-50'
      };
    default:
      return {
        name: 'AI Assistant',
        icon: Bot,
        bgColor: 'bg-emerald-500',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        bgLight: 'bg-white'
      };
  }
};
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const agentConfig = getAgentConfig(message.agent);
  const IconComponent = agentConfig.icon;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : `${agentConfig.bgColor} text-white`
          }`}>
            {isUser ? <User size={16} /> : <IconComponent size={16} />}
          </div>
        </div>
        
        <div className="flex flex-col">
          {!isUser && message.agent && (
            <div className={`text-xs font-medium mb-1 px-2 py-1 rounded-full self-start ${agentConfig.textColor} ${agentConfig.bgLight} ${agentConfig.borderColor} border`}>
              {agentConfig.name}
            </div>
          )}
          
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : `${agentConfig.bgLight} ${agentConfig.textColor} border ${agentConfig.borderColor} rounded-bl-md`
          }`}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            {message.timestamp && (
              <div className={`text-xs mt-2 ${
                isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};