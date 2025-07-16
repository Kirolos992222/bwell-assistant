export interface Message {
  role?: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  agent?: 'HypothesisAgent' | 'ChallengerAgent' | 'TestChooserAgent' | 'AskQuestion' | 'RequestTest' | 'ProvideDiagnosis';
}

export interface ChatState {
  messages: Message[];
  conversationId: string;
  isLoading: boolean;
  error: string | null;
}

export interface ChatResponse {
  messages: Message[];
  conversation_id: string;
  graph_state: any;
}