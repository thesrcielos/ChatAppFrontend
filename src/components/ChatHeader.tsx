import { useState } from "react";
import { MoreVertical, UserX, Shield, Users, Trash2, LogOut } from "lucide-react";
import Perfil from "./Profile";

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
  const [showOptions, setShowOptions] = useState(false);

  const handleNameClick = () => {
    if(showProfile) toggleProfile();
    else{
    setShowProfile(true);
    if (onClickName) onClickName();
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const closeModal = () => {
    setShowProfile(false);
  };

  const handleOptionClick = (action: string) => {
    // Aquí implementaremos las acciones según la opción seleccionada
    console.log(`Acción seleccionada: ${action}`);
    setShowOptions(false);
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
              onClick={toggleProfile}
            >
              <MoreVertical />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {isGroup ? (
                  <>
                    <button
                      onClick={() => handleOptionClick('groupInfo')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Información del grupo
                    </button>
                    <button
                      onClick={() => handleOptionClick('leaveGroup')}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Salir del grupo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleOptionClick('block')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Bloquear contacto
                    </button>
                    <button
                      onClick={() => handleOptionClick('delete')}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar contacto
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {showProfile && <Perfil onClose={closeModal} contactId={contactId} isGroup={isGroup} chatId={chatId} />}
    </>
  );
};

export default ChatHeader;
