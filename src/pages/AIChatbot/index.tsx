import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, ThumbsUp, ThumbsDown, Plus, History, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { fadeInUp } from '@/lib/animations';
import { generateId } from '@/lib/utils';
import { aiService } from '@/services/ai.service';
import { chatService } from '@/services/chat.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

const suggestedQuestions = [
  { en: 'Why are my tomato leaves turning yellow?', hi: 'मेरे टमाटर की पत्तियां पीली क्यों हो रही हैं?' },
  { en: 'When should I sow wheat in MP?', hi: 'मध्य प्रदेश में गेहूं कब बोऊं?' },
  { en: 'Best fertilizer for rice?', hi: 'धान के लिए सबसे अच्छा खाद?' },
  { en: 'How to control aphids organically?', hi: 'जैविक तरीके से एफिड कैसे रोकें?' },
];

export default function AIChatbot() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lang = i18n.language;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: generateId(), role: 'user', content: text.trim(), timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = generateId();
      setActiveSessionId(currentSessionId);
    }

    // Determine the chat title (use the first user message)
    const firstMsg = messages.find((m) => m.role === 'user') || userMsg;
    const title = firstMsg.content.length > 35 ? firstMsg.content.substring(0, 35) + '...' : firstMsg.content;

    // Save user message to Firestore
    try {
      await chatService.saveSession(currentSessionId, updatedMessages, title);
    } catch (err) {
      console.error('Failed to save user message:', err);
    }

    try {
      const result = await aiService.chat(text, { preferredLanguage: lang });
      const aiMsg: Message = { id: generateId(), role: 'assistant', content: result.response, timestamp: new Date() };
      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Save assistant message to Firestore
      try {
        await chatService.saveSession(currentSessionId, finalMessages, title);
      } catch (err) {
        console.error('Failed to save AI response:', err);
      }
    } catch (error) {
      const errorMsg: Message = { id: generateId(), role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the network right now. Please try again later.", timestamp: new Date() };
      const errorMessages = [...updatedMessages, errorMsg];
      setMessages(errorMessages);
      
      try {
        await chatService.saveSession(currentSessionId, errorMessages, title);
      } catch (err) {
        console.error('Failed to save AI error message:', err);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (msgId: string, feedback: 'positive' | 'negative') => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, feedback } : m));
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId('');
    setInput('');
    toast.success('Started a new chat session');
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const sessions = await chatService.getSessions();
      setHistoryList(sessions);
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSelectSession = (session: any) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent selecting the session
    try {
      await chatService.deleteSession(sessionId);
      setHistoryList((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success('Chat deleted');
      if (activeSessionId === sessionId) {
        setMessages([]);
        setActiveSessionId('');
      }
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <PageWrapper showSidebar>
      <div className="flex flex-col h-[calc(100vh-8rem)] w-full">
        {/* Header */}
        <motion.div {...fadeInUp} className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">{t('chat.title')}</h1>
            <p className="text-xs text-text-muted">Powered by Krishi Mitra AI • Hindi + English</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={startNewChat}>{t('chat.newChat') || 'New Chat'}</Button>
            <Button variant="ghost" size="sm" leftIcon={<History className="w-4 h-4" />} onClick={() => { setShowHistory(true); loadHistory(); }}>{t('chat.history') || 'History'}</Button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Empty state with suggested questions */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-3xl bg-primary-400/10 border border-primary-400/20 flex items-center justify-center text-4xl mb-6">🌾</div>
                <h2 className="text-xl font-bold text-text-primary font-display mb-2">Namaste! I'm Krishi Mitra 🙏</h2>
                <p className="text-sm text-text-secondary max-w-md mb-8">Ask me anything about farming — diseases, fertilizers, weather, market prices. I speak Hindi and English!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(lang === 'hi' ? q.hi : q.en)}
                      className="p-3 rounded-xl text-left text-sm bg-surface-2/50 border border-glass-border hover:border-primary-400/30 hover:bg-surface-3 transition-all text-text-secondary">
                      {lang === 'hi' ? q.hi : q.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px]">🌾</div>
                      <span className="text-xs text-text-muted">Krishi Mitra</span>
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-md'
                      : 'bg-surface-2 border border-glass-border text-text-primary rounded-tl-md'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => handleFeedback(msg.id, 'positive')}
                        className={`p-1 rounded ${msg.feedback === 'positive' ? 'text-success' : 'text-text-muted hover:text-success'}`}>
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleFeedback(msg.id, 'negative')}
                        className={`p-1 rounded ${msg.feedback === 'negative' ? 'text-danger' : 'text-text-muted hover:text-danger'}`}>
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px]">🌾</div>
                <div className="flex gap-1.5 p-3 rounded-2xl bg-surface-2 border border-glass-border">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary-400"
                      animate={{ y: [0, -6, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-glass-border">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('chat.placeholder')}
                className="glass-input flex-1" disabled={isTyping} />
              <Button type="submit" disabled={!input.trim() || isTyping} className="!rounded-xl">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* History Modal */}
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title={t('chat.history') || 'Chat History'} size="lg">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" className="text-primary-400" />
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center p-8 text-text-muted">
            No chat history found. Start a conversation to save your history!
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {historyList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-center justify-between hover:border-primary-400/50 transition-colors cursor-pointer ${
                  activeSessionId === item.id ? 'bg-primary-400/10 border-primary-400/30 text-primary-400' : 'bg-surface-2 border-glass-border text-text-primary'
                }`}
                onClick={() => handleSelectSession(item)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-text-muted mt-1">
                    {item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleString() : ''}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(e, item.id)}
                  className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
