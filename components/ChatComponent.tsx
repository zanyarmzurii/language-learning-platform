"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  courseId?: string;
  message: string;
  file?: string;
  timestamp: string;
  read: boolean;
}

interface ChatComponentProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  courseId?: string;
}

export default function ChatComponent({
  currentUserId,
  receiverId,
  receiverName,
  courseId,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        receiverId,
        ...(courseId && { courseId }),
      });

      const res = await fetch(`/api/chat?${params}`);
      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [receiverId, courseId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId,
          courseId,
          message: newMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...messages, data.data]);
        setNewMessage("");
        scrollToBottom();
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-purple-600 text-white rounded-t-lg">
        <h3 className="font-semibold">{receiverName}</h3>
        {courseId && (
          <p className="text-sm opacity-75">چاتی خول</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-4xl mb-4">💬</p>
            <p>هێشتا هیچ پەیامێک نییە</p>
            <p className="text-sm">یەکەم پەیام بنێرە!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isMine
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{msg.message}</p>
                {msg.file && (
                  <a
                    href={msg.file}
                    target="_blank"
                    className={`text-sm underline mt-1 block ${
                      isMine ? "text-purple-200" : "text-purple-600"
                    }`}
                  >
                    📎 فایلی نێردراو
                  </a>
                )}
                <div
                  className={`text-xs mt-1 ${
                    isMine ? "text-purple-200" : "text-gray-500"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString("ckb")}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="پەیامێک بنووسە..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "..." : "ناردن"}
        </Button>
      </form>
    </div>
  );
}
