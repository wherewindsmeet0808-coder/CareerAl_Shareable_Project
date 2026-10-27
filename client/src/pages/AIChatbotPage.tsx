import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  User,
  Globe,
  Loader2,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';

export const AIChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    const res = await apiRequest(`/chat/history?lang=${language}`);
    if (res.success) {
      setMessages(res.messages || []);
      if (res.aiStatus) {
        setAiStatus(res.aiStatus);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || sending) return;

    // Optimistically append user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputValue('');
    setSending(true);

    const res = await apiRequest('/chat/message', {
      method: 'POST',
      body: {
        message: messageContent,
        language
      }
    });

    setSending(false);

    if (res.success && res.message) {
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, res.message]);
    } else {
      // Add error notice
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${res.error || 'Failed to reach AI Career Coach. Please try again.'}`,
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Clear all conversation history in this language?')) return;
    await apiRequest(`/chat/history?lang=${language}`, { method: 'DELETE' });
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col h-[85vh]">
      {/* Header */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-navy-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{t.chatbot.title}</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">Context-Aware AI Mentor for {user?.full_name}</p>
          </div>
        </div>

        {/* Right side controls: Language switcher & clear */}
        <div className="flex items-center space-x-2">
          {/* Language Switch */}
          <div className="flex rounded-lg bg-navy-950 p-0.5 border border-navy-800 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded font-semibold ${
                language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded font-semibold ${
                language === 'ta' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              தமிழ்
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Service Status Pill */}
      {aiStatus && (
        <div className="mb-3 px-4 py-2 rounded-xl bg-navy-900/60 border border-navy-800/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Engine: <strong>{aiStatus.provider}</strong></span>
          </div>
          <span className="italic text-slate-500">{aiStatus.isRealAI ? 'Live Gemini LLM' : 'Intelligent Rule-Based Mode'}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto glass-card p-4 sm:p-6 rounded-3xl border border-navy-800 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How can I help you today, {user?.full_name}?</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                I can explain software architectures, suggest portfolio project ideas, review interview questions, or formulate a customized roadmap.
              </p>
            </div>

            {/* Prompt pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-4">
              {t.chatbot.suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(sug)}
                  className="p-3 text-left rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-brand-600 text-white'
                      : 'bg-gradient-to-tr from-violet-600 to-brand-600 text-white shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300 rounded-tl-none'
                      : 'bg-navy-950/90 border border-navy-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-brand-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-navy-950/90 border border-navy-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              <span>{t.chatbot.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 relative shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.chatbot.placeholder}
          disabled={sending}
          className="w-full pl-4 pr-12 py-3.5 bg-navy-900 border border-navy-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || sending}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
