import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, Sprout, 
  RotateCcw, Globe, ShieldAlert, CheckCircle2, ChevronDown, Minimize2 
} from 'lucide-react';

export default function AgriChatbot({ currentContext = null, isOpenDefault = false, onClose = null }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hello! I am **AgriDoctor AI**, your smart agricultural consultant. Ask me anything about crop diseases, organic/chemical treatments, weather spraying advice, or pest control.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync open state with parent if provided
  useEffect(() => {
    if (isOpenDefault) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [isOpenDefault]);

  // If new diagnosis context arrives, announce it in chat
  useEffect(() => {
    if (currentContext && currentContext.disease_detected) {
      const contextMsg = {
        sender: 'bot',
        text: `🌿 **Active Diagnosis Loaded:** I see your scan for **${currentContext.crop_name || 'Crop'}** detected **${currentContext.disease_detected}** (Severity: ${currentContext.severity || 'Moderate'}). How can I assist you with this treatment?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, contextMsg]);
    }
  }, [currentContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    { label: "🌿 Organic Remedies", prompt: "What are the best organic and natural treatments for this crop condition?" },
    { label: "🌧️ Rain & Spray Safety", prompt: "Is it safe to spray fungicide if rain is forecasted in the next 48 hours?" },
    { label: "💊 Dosage & Chemical Guide", prompt: "What is the recommended chemical dosage and application precaution?" },
    { label: "🇮🇳 हिंदी में समझाइए", prompt: "कृपया इस बीमारी का सरल रोकथाम और उपचार हिंदी में बताएं।" },
    { label: "🛡️ Prevention Tips", prompt: "How do I prevent this disease from spreading to neighboring plants?" }
  ];

  const handleSend = async (userPrompt = null) => {
    const messageToSend = userPrompt || input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text: messageToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!userPrompt) setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/gemini/chat', {
        message: messageToSend,
        context: currentContext,
        language: language
      });

      const reply = response.data?.reply || "I couldn't process that response. Please try again.";
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Connection error to AgriDoctor AI. Please ensure your backend is running and the AI service is configured in `backend/.env`.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Chat cleared. Feel free to ask any agricultural or crop disease questions!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Format bot text with bold and bullet highlights
  const formatBotText = (text) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        return <p key={idx} className="font-bold text-emerald-300 text-sm mt-2 mb-1">{line.replace(/^#+\s*/, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs my-0.5 leading-relaxed">
            {line.replace(/^[-*]\s*/, '')}
          </li>
        );
      }
      return <p key={idx} className="text-xs text-slate-200 my-1 leading-relaxed">{line}</p>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="open-agri-chatbot-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30 group"
          title="Ask AgriDoctor AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-slate-900" />
          </div>
          <span className="font-semibold text-sm tracking-wide flex items-center gap-1.5">
            AgriDoctor AI
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      )}

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-900/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/20 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">AgriDoctor AI</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded border border-emerald-500/30">AI Agronomist</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Live Agronomist & Plant Doctor
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <ChevronDown className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Pill (if active diagnosis exists) */}
              {currentContext && currentContext.disease_detected && (
                <div className="px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-500/15 flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="truncate flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    Focus: <strong className="text-white">{currentContext.crop_name} - {currentContext.disease_detected}</strong>
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold text-[10px]">
                    {currentContext.severity || 'Active'}
                  </span>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-900/20' 
                          : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.sender === 'bot' ? formatBotText(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                      <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-emerald-200/70' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="px-4 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    className="whitespace-nowrap px-2.5 py-1 bg-slate-800 hover:bg-emerald-950 hover:border-emerald-500/40 border border-slate-700/60 rounded-full text-[11px] text-slate-300 hover:text-emerald-300 transition-all flex-shrink-0"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask any question to AgriDoctor AI..."
                  className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-md transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
