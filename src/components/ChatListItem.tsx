import { MessageSquareText } from 'lucide-react';
import { Chat, Message } from '@/types/types';
import { useChatStore } from '@/store/chatStore';
import { useUser } from '@/services/UserContext';

interface ChatListItemProps {
    chat: Chat;
    onClick: () => void;
    lastMessage?: Message;
    isActive: boolean;
}
const ChatListItem = ({ chat, onClick, isActive } : ChatListItemProps) => {
  const {userId} = useUser();
  const contacts = useChatStore((state) => state.contacts);
  const lastMessage = useChatStore((state) => state.messages[String(chat.id)]);
  const getPicture = () => {
    if (chat.isGroup && chat.group.image) {
        console.log("holaaaa 1");  
        return(
            <img 
              src={chat.image} 
              className="w-full h-full rounded-full object-cover"
            />
        );
    }else if (!chat.isGroup) {
        const user = contacts[chat.contact.contact];
        if (user?.picture) {
          return (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />);
          }
        }return (
            <div className="bg-gray-300 w-full h-full flex items-center justify-center rounded-full">
              <MessageSquareText className="text-white" size={24} />
            </div>
          );
     
    }
  const getChatName = () => {
    return chat.isGroup ? chat.group.name : chat.contact.name;
  }

  const getLastMessage = () => {
    if (lastMessage) {
      const message = lastMessage[lastMessage.length - 1];
      let messageText;
      if(chat.isGroup) {
        const sender = String(message.userId) === userId ? "Tú: " : contacts[message.userId].name +": ";
        messageText = sender + (message.message || message.fileType);
      } else{
        const sender = String(message.userId) === userId ? "Tú: " : "";
        messageText = sender + (message.message || message.fileType);
      }
      return messageText.length > 40 ? messageText.slice(0, 40) + '...' : messageText;
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
     
      {getPicture()}
      
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-left text-gray-800 truncate">{getChatName()}</h3>
        { lastMessage && (
          <p className="text-sm text-left text-gray-500 truncate">{getLastMessage()}</p>
        )}
      </div>
      {chat.unseenMessages > 0 && (
        <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {chat.unseenMessages}
        </div>
      )}
    </div>
  );
};

export default ChatListItem;