import { useState } from "react";
import { MoreVertical, UserX, Shield, Users, Trash2, LogOut, ArrowLeft } from "lucide-react";
import Perfil from "./Profile";
import { Button } from "./ui/button";
import { useChatStore } from "@/store/chatStore";

interface ChatHeaderProps {
  chatName: string;
  avatar: React.ReactNode;
  onClickName?: () => void;
  contactId?: string;
  isGroup?: boolean;
  chatId?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, avatar, onClickName, contactId, isGroup, chatId }) => {
  const [showProfile, setShowProfile] = useState(false);

  const handleNameClick = () => {
    setShowProfile(true);
    if (onClickName) onClickName();
  };

  const closeModal = () => {
    setShowProfile(false);
  };

  const handleOptionClick = (action: string) => {
    console.log(`Acción seleccionada: ${action}`);
    setShowProfile(false);
  };

  return (
    <>
      <header
        className="bg-blue-500 text-white p-4 shadow-md border-b border-blue-600"
        role="banner"
        aria-label={`Chat con ${chatName}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              {avatar}
            </div>
            <h1
              className="text-lg font-semibold leading-none cursor-pointer hover:underline"
              onClick={handleNameClick}
            >
              {chatName}
            </h1>
          </div>
          <div className="relative">
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Más opciones"
              onClick={handleNameClick}
            >
              <MoreVertical />
            </button>
          </div>
        </div>
      </header>

      {showProfile && (
        <Perfil 
          onClose={closeModal} 
          contactId={contactId} 
          isGroup={isGroup} 
          chatId={chatId}
        >
          <div className="hidden" />
        </Perfil>
      )}
    </>
  );
};

export default ChatHeader;
