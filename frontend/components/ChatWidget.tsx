"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const authContext = useAuth();
  const authToken = authContext?.token || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
  
    if (!authToken) {
      const authErrorMsg: Message = { 
        role: "assistant", 
        content: "Для использования чата требуется авторизация. Пожалуйста, войдите в аккаунт.", 
        timestamp: new Date().toISOString() 
      };
      setMessages((prev) => [...prev, authErrorMsg]);
      return;
    }
  
    setMessage("");
    setIsLoading(true);
  
    const newUserMsg: Message = { 
        role: "user", 
        content: userMessage, 
        timestamp: new Date().toISOString() 
    };
    setMessages((prev) => [...prev, newUserMsg]);
  
    try {
      const response = await fetch("http://localhost:8000/v1/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: userMessage,
          chat_id: chatId || null
        }),
      });
  
      if (!response.ok) {
        let errorMsg = "Ошибка связи с сервером";
        try {
          const errorData = await response.json();
          if (response.status === 401 && errorData.detail) {
            errorMsg = `Ошибка авторизации: ${errorData.detail}. Войдите заново.`;
          }
        } catch (parseErr) {
          // Ignore parse error
        }
        throw new Error(errorMsg);
      };
  
      const data = await response.json();
      
      setChatId(data.chat_id);
      const aiMsg: Message = {
        role: "assistant",
        content: data.content,
        timestamp: data.timestamp,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: error.message, 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-400 cursor-pointer hover:bg-amber-500 text-slate-900 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-800 border border-slate-700 w-[350px] h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-700 p-4 flex justify-between items-center border-b border-slate-600">
            <div className="flex items-center gap-2 text-white">
              <Bot className="text-amber-400" size={20} />
              <span className="font-bold select-none">Ассистент CraftSigns</span>
            </div>
            <button onClick={() => setIsOpen(false)} className=" cursor-pointer text-slate-400 hover:text-white transition-colors">
              <X size={20}/>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600">
            {messages.length === 0 && (
              <div className="text-slate-400 text-center mt-10 text-sm">
                Привет! Я помогу рассчитать стоимость вывески или отвечу на вопросы.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-amber-400 text-slate-900 rounded-tr-none" 
                    : "bg-slate-700 text-white rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none animate-pulse text-slate-400">
                  Печатает...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-slate-700/50 border-t border-slate-600 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ваш вопрос..."
              className="flex-1 bg-slate-900 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-400 select-none  cursor-pointer p-2 rounded-xl text-slate-900 hover:bg-amber-500 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};