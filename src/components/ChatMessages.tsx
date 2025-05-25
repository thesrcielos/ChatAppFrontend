import { useState, useEffect, useRef } from "react";
import { useUser } from "../services/UserContext";
import { getUsersChatInfo, getChatMessages } from "../api/ChatApi";
import { Chat, Message } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { useChatStore } from "@/store/chatStore";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

interface ChatMessagesProps {
    selectedContact: Chat | null;
    contact: Chat;
    setChatLastMessage: Dispatch<SetStateAction<Record<string, Message>>>;
}

const ChatMessages = ({selectedContact, contact} : ChatMessagesProps) => {
    const {userId} = useUser();
    const [newMessage, setNewMessage] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const messages = useChatStore((state) => state.messages[String(contact.id)]);
    const addMessage = useChatStore((state) => state.addMessage);
    const addMessages = useChatStore((state) => state.addMessages);
    const setMessages = useChatStore((state) => state.setMessages);
    const setContacts = useChatStore((state) => state.setContacts);
    
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const isOpen = selectedContact?.id === contact.id;

    useEffect(() => {
        const getMessages = async () => {
           if (!contact.id) return;
          const users = await getUsersChatInfo(contact.id);
          setContacts(users);
          let date = new Date();
          const messages = await getChatMessages(contact.id, date, 1);
          setMessages(String(contact.id), messages.values);
        }
        getMessages();
    }, [contact.id]);

    useEffect(() => {
        if (!message) return;
        addMessage(String(contact.id), message);
    }, [message]);
    
    useEffect(() => {
      if (!isOpen) return;
      getMessagesFromChat();
    }, [isOpen]);

    useEffect(() => {
      handleScroll();
    }, [messages]);
    

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
      const data = await getChatMessages(contact.id, date, PAGE_SIZE);
      console.log("Mensajes obtenidos:", data);
      addMessages(String(contact.id), data.values);
      setDataFetched(true);
    }

    const getChatName = () => {
      if (contact.isGroup) {
        return contact.group.name;
      }
      return contact.contact.name;
    };

    if (!isOpen) {
      return null;
    } 
    return (
      <main className="flex-1 flex flex-col w-3/5">
        <ChatHeader chatName={getChatName()} />
        <ChatBody messages={messages} userId={userId} chat={contact} />
        <ChatFooter
          chat={contact}
          userId={userId}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setMessage={setMessage}
        />
      </main>);
}

export default ChatMessages;