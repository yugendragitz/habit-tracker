import { useState } from 'react';
import { AIService } from '../services/aiService';

export default function CoachChat({ fullAppData }) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: "Hello Yugi. I've analyzed your real stored habits, workout volume, nutrition, and water records. What's on your mind today?",
      suggestedQuestions: [
        'How am I doing this week?',
        'What should I focus on today?',
        'Why did my score change?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const res = await AIService.requestCoachAction('chat', fullAppData, { userMessage: textToSend.trim() });
    setIsLoading(false);

    if (res?.data) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'coach',
          text: res.data.reply || "I analyzed your stored data. Your momentum remains strong!",
          suggestedQuestions: res.data.suggestedQuestions || [
            'How am I doing this week?',
            'What should I focus on today?',
            'Why did my score change?'
          ]
        }
      ]);
    }
  };

  return (
    <div className="card p-6 flex flex-col h-[520px] bg-[#0d0f19] border-white/10 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">ASK YOUR COACH</span>
          <h3 className="font-black text-white text-sm">Grounded Digital Performance Guidance</h3>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-tr-none' 
                : 'bg-[#141827] border border-white/10 text-white rounded-tl-none space-y-2'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {/* Quick suggestion chips */}
            {msg.sender === 'coach' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestedQuestions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-[10px] text-white/80 hover:text-white transition-all font-medium"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#141827] border border-white/10 text-xs text-white/60 w-fit">
            <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing your historical records...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2 pt-3 border-t border-white/10 mt-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask your coach anything about your progress..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#141827] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-purple-500/50 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-40 transition-all"
        >
          Send
        </button>
      </form>

    </div>
  );
}
