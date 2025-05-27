import { useRef, useEffect } from "react";
import { Chat, Message } from "@/types/types";
import ChatMessageItem from "./ChatMessageItem";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ChatBodyProps {
  messages: Message[];
  userId: string | null;
  chat: Chat;
}

const ChatBody = ({ messages, userId, chat }: ChatBodyProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  let lastDate: String = "";

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white" ref={containerRef}>
      {messages && messages.map((msg, index) => {
        const msgDate = format(new Date(msg.sentAt), "yyyy-MM-dd");
        const showDate = msgDate !== lastDate;
        lastDate = msgDate;
        return <div key={msg.messageId}>    
        {showDate && (
          <div className="text-center my-5 text-gray-500 text-md" >
            {format(new Date(msg.sentAt), "d 'de' MMMM yyyy", { locale: es })}
          </div>
        )}
        <div
          className={`p-2 text-left rounded-lg max-w-xs ${
            Number(msg.userId) === Number(userId)
              ? "ml-auto bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <ChatMessageItem message={msg} chat={chat}/>
        </div>
        </div>
      })}
    </div>
  );
};

export default ChatBody;
