import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

interface ChatHeaderProps {
  chatName: string;
  avatar: React.ReactNode;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, avatar }) => {
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  return (
    <header
      className="relative bg-blue-500 text-white shadow-md border-b border-blue-600"
      role="banner"
      aria-label={`Chat con ${chatName}`}
    >
      <div className="flex items-center flex-row justify-left">
        <Button className="block sm:hidden content-fit cursor-pointer p-1 rounded bg-transparent shadow-none"
        onClick={() => setSelectedChat(null)}>
          <ArrowLeft/>
        </Button>
        <div className="pl-2 pr-3">
          {avatar}
        </div>
        
        <h1 className="text-left text-lg font-bold m-4">
          {chatName}
        </h1>
      </div>
    </header>
  );
};

export default ChatHeader;