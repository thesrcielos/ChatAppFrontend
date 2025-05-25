import { useRef, useEffect } from "react";
import { Chat, Message } from "@/types/types";
import ChatMessageItem from "./ChatMessageItem";

interface ChatBodyProps {
  messages: Message[];
  userId: string | null;
  chat: Chat;
}

const ChatBody = ({ messages, userId, chat }: ChatBodyProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white" ref={containerRef}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 text-left rounded-lg max-w-xs ${
            Number(msg.userId) === Number(userId)
              ? "ml-auto bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <ChatMessageItem message={msg} chat={chat}/>
        </div>
      ))}
    </div>
  );
};

export default ChatBody;
