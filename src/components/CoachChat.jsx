import { useState } from 'react';
import { AIService } from '../services/aiService';

export default function CoachChat({ fullAppData }) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: "Hello! I am your MOMENTUM AI Coach, grounded in your real habits, workout volume, nutrition, water intake, and personal records. How can I guide your progress today?",
      suggestedQuestions: [
        'How am I doing this month?',
        'How is my gym progress?',
        'What should I eat today?',
        'Why did my transformation score drop?'
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
          text: res.data.reply || "I analyzed your stored data. Your consistency remains solid!",
          suggestedQuestions: res.data.suggestedQuestions || []
        }
      ]);
    }
  };

  return (
    <div className="card p-6 flex flex-col h-[520px] border-accent-primary/20 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-primary text-dark-900 font-extrabold flex items-center justify-center text-sm shadow-glow">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Ask Your Coach</h3>
            <span className="text-[10px] text-accent-primary font-semibold">Grounded in your real application data</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-accent-primary text-dark-900 font-semibold rounded-tr-none' 
                : 'bg-dark-900 border border-white/10 text-white rounded-tl-none space-y-2'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {/* Quick suggested chips */}
            {msg.sender === 'coach' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestedQuestions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-accent-primary/20 border border-white/10 text-[10px] text-white/80 hover:text-white transition-all"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-dark-900 border border-white/10 text-xs text-white/60 w-fit">
            <div className="w-3 h-3 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
            <span>Analyzing your historical records...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2 pt-3 border-t border-white/10 mt-2">
        <input
          type="text"
          placeholder="Ask about your habits, workouts, macros, or goals..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:border-accent-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-accent-primary text-dark-900 font-extrabold text-xs shadow-glow hover:brightness-110 transition-all"
        >
          Send
        </button>
      </form>

    </div>
  );
}
