import { MessageSquareText } from 'lucide-react';
import { Chat, Message } from '@/types/types';
import { useUser } from '../services/UserContext';

interface ChatListItemProps {
    chat: Chat;
    onClick: () => void;
    lastMessage?: Message;
    isActive: boolean;
}
const ChatListItem = ({ chat, onClick, lastMessage, isActive } : ChatListItemProps) => {
  const defaultImage = <MessageSquareText className="text-gray-500" size={24} />;
  const {userId} = useUser();
  const getChatName = () => {
    if (chat.isGroup) {
        return chat.group.name;
        } else {
        return chat.contact.name;
        }
    }

  const getLastMessage = () => {
    if (lastMessage) {
      //const sender = lastMessage.userId;
      //let message = sender === userId ? "Tú:" : `${lastMessage.user.name}: `;
      return lastMessage.message || lastMessage.fileType;
    }
    return null;
  }
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 rounded-md transition-colors ${
        isActive ? 'bg-blue-100 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 mr-3">
        {chat.image ? (
          <img 
            src={chat.image} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          defaultImage
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-left text-gray-800 truncate">{getChatName()}</h3>
        <p className="text-sm text-left text-gray-500 truncate">hola</p>
        { lastMessage && (
          <p className="text-sm text-gray-500 truncate">{getLastMessage()}</p>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;