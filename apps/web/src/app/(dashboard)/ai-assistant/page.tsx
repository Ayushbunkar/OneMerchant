"use client";

import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! I'm your OneMerchant AI Assistant. I can help you analyze your sales, draft marketing emails, check stock levels, and predict demand. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiClient.post("/ai/chat", { message: input, conversationId });
      const data = res.data;
      if (data.conversationId) setConversationId(data.conversationId);
      
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), role: "assistant", content: data.reply || "I encountered an issue processing that." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), role: "assistant", content: "Sorry, the AI service is currently unavailable. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Chat with your intelligent commerce copilot.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-white/10 shadow-xl">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent border border-white/10"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-accent/50 glass rounded-tl-sm text-foreground"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent border border-white/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-accent/50 glass rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t bg-card/50 glass">
          <form 
            className="flex w-full gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              placeholder="Ask about your sales, inventory, or ask for marketing ideas..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background/50 border-white/10"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="shrink-0 gap-2">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
