"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIChatProps {
  className?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ className }) => {
  const t = useTranslations("AIChat");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], locale }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: t('error_message') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg",
          className
        )}
        aria-label={t('toggle_label')}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-background sm:bg-background/80 sm:backdrop-blur-lg border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b bg-primary/5 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('header')}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm mt-8">
                  <p>{t('empty_state_1')}</p>
                  <p>{t('empty_state_2')}</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3 max-w-[85%]", m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground p-0 overflow-hidden relative")}>
                    {m.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Image
                        src="/AI-MikaelP.jpg"
                        alt="AI Avatar"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className={cn("p-3 rounded-lg text-sm markdown-prose", m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-secondary text-secondary-foreground rounded-tl-none")}>
                    <ReactMarkdown
                      components={{
                        a: ({ node, href, children, ...props }) => {
                          const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
                          if (isInternal) {
                            return <Link href={href} className="underline font-bold text-orange-400 hover:text-orange-300" {...props}>{children}</Link>;
                          }
                          return <a href={href} target="_blank" rel="noopener noreferrer" className="underline font-bold text-orange-400 hover:text-orange-300" {...props}>{children}</a>;
                        },
                        p: ({node, children, ...props}) => <p className="mb-2 last:mb-0" {...props}>{children}</p>
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <input
                  id="ai-chat-input"
                  name="message"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('placeholder')}
                  className="flex-1 bg-secondary/50 border-0 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  autoComplete="off"
                />
                <button type="submit" disabled={isLoading || !input.trim()} aria-label={t('send_button')} className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
