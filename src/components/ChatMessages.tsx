import { useState, useEffect, useRef } from "react";
import { useUser } from "@/services/UserContext";
import { MessageSquareText, ArrowLeft } from "lucide-react";
import { getUsersChatInfo, getChatMessages } from "@/api/ChatApi";
import { Chat, Message } from "@/types/types";
import { useChatStore } from "@/store/chatStore";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { markSeenMessages } from "@/services/MessageService";
import "./ChatMessages.css";

interface ChatMessagesProps {
    chat: Chat;
}

const ChatMessages = ({chat} : ChatMessagesProps) => {
    const {userId} = useUser();
    const [newMessage, setNewMessage] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const messages = useChatStore((state) => state.messages[String(chat.id)]);
    const addMessage = useChatStore((state) => state.addMessage);
    const addMessages = useChatStore((state) => state.addMessages);
    const setMessages = useChatStore((state) => state.setMessages);
    const setContacts = useChatStore((state) => state.setContacts);
    const handleSeenMessage = useChatStore((state) => state.handleSeenMessage);
    const selectedChat = useChatStore((state) => state.selectedChat);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const isOpen = selectedChat === chat.id;
    const contacts = useChatStore((state) => state.contacts);

    useEffect(() => {
        const getMessages = async () => {
           if (!chat.id) return;
          const users = await getUsersChatInfo(chat.id);
          setContacts(users);
          if(messages && messages.length > 0) return;
          let date = new Date();
          const messagesFetched = await getChatMessages(chat.id, date, 1);
          setMessages(String(chat.id), messagesFetched.values);
        }
        getMessages();
    }, [chat.id]);

    useEffect(() => {
        if (!message) return;
        addMessage(String(chat.id), message);
    }, [message]);
    
    useEffect(() => {
      if (!isOpen) return;
      getMessagesFromChat();
      markMessagesAsSeen();
    }, [isOpen]);

    useEffect(() => {
      handleScroll();
      markMessagesAsSeen();
    }, [messages]);
    
    let seenTimeout: ReturnType<typeof setTimeout> | null = null;

    const markMessagesAsSeen = () => {
      if (!chat.id || chat.unseenMessages <= 0 || !isOpen) return;

      if (seenTimeout) {
        clearTimeout(seenTimeout);
      }
      seenTimeout = setTimeout(() => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) return;

        const messageId = lastMessage.messageId;
        if (!messageId || !userId) return;

        const conversationId = chat.id;
        markSeenMessages(String(conversationId), messageId, userId);
        handleSeenMessage(String(chat.id));
      }, 2000);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }

    const getMessagesFromChat = async () => {
      if(dataFetched) { 
        return;
      }
      const date = messages.length > 0 ? new Date(messages[messages.length - 1].sentAt) : new Date();
      const PAGE_SIZE = 49;
      const data = await getChatMessages(chat.id, date, PAGE_SIZE);
      console.log("Mensajes obtenidos:", data);
      addMessages(String(chat.id), data.values);
      setDataFetched(true);
    }

    const getChatName = () => {
      if (chat.isGroup) {
        return chat.group.name;
      }
      return chat.contact.name;
    };
  
    const getPicture = (): React.ReactNode => {
      if (chat.isGroup && chat.group.image) {
        return (
          <img
            src={chat.group.image}
            alt="Grupo"
            className="w-8 h-8 rounded-full object-cover"
          />
        );
      } else if (!chat.isGroup) {
        const user = contacts[chat.contact.contact];
        if (user?.picture) {
          return (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          );
        }
      }
      return (
        <div className="bg-blue-500 p-2 rounded-full">
          <MessageSquareText className="text-white" size={24} />
        </div>
      );
    };

    if (!isOpen) {
      return null;
    }

    return (
      <main className="sm:w-[100vw] relative flex-1 flex flex-col min-w-[300px]">
        <ChatHeader 
          chatName={getChatName()} 
          avatar={getPicture()} 
          contactId={chat.isGroup ? undefined : String(chat.contact.contact)}
          isGroup={chat.isGroup}
          chatId={chat.id}
        /> 
        <ChatBody messages={messages} userId={userId} chat={chat} />
        <ChatFooter
          chat={chat}
          userId={userId}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setMessage={setMessage}
        />
      </main>
    );
};

export default ChatMessages;