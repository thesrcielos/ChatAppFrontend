import { create } from 'zustand';
import { Message, Contact, Chat, MessageModification } from '@/types/types';

type ChatState = {
  messages: Record<string, Message[]>; 
  contacts: Record<string, Contact>;
  chats: Chat[];
  selectedChat: number | null;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  addMessages: (chatId: string, messages: Message[]) => void;
  setContacts: (contacts: Contact[]) => void;
  updateChat: (chat: Chat) => void;
  addContact: (contact: Contact) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  moveChatToTop: (chat: Chat) => void;
  moveChatToTopId: (chatId: String) => void;
  handleNewMessage: (chatId: string) => void;
  handleSeenMessage: (chatId: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  editMessage: (chatId: string, messageId: string, newMessage: string) => void;
  handleMessageModification: (chatId: string, message: MessageModification) => void;
  setSelectedChat: (chatId: number | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  contacts: {},
  chats: [],
  selectedChat: null,
  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),
  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),
  addMessages: (chatId, messages) => set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...messages, ...(state.messages[chatId] || [])],
      },
    })),
  setContacts: (contacts) =>
    set((state) => {
      const newContacts = { ...state.contacts };
      for (const contact of contacts) {
        newContacts[contact.id] = contact;
      }
      return { contacts: newContacts };
    }),
  addContact: (contact) =>
    set((state) => ({
      contacts: {
        ...state.contacts,
        [contact.id]: contact,
      },
    })),
  setChats: (chats) =>
    set((state) => ({
      chats: chats
    })), 
  updateChat: (chat) =>
  set((state) => {
    const existingChatIndex = state.chats.findIndex(
      (c) => chat.isGroup ? false :c.contact.id === chat.contact.id
    );

    if (existingChatIndex === -1) {
      return { chats: [chat, ...state.chats] };
    }
    const messages = { ...state.messages };
    const updatedChats = state.chats.map((c, i) => {
      if(i !== existingChatIndex) {
        return c;
      }
      messages[chat.id] = [ {...messages[c.id][0], conversationId: chat.id}];
      return {
          ...c,
          id: chat.id,
          isGroup: chat.isGroup,
          group: chat.group,
          image: chat.image,
          unseenMessages: chat.unseenMessages,
        }
          
    });
    return { chats: updatedChats, messages: messages };
    
  })
,
  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),  
  moveChatToTop: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats.filter((c) => c.id !== chat.id)],
    })),
  moveChatToTopId: (chatId) =>
    set((state) => ({
      chats: [...state.chats.filter((c) => c.id === Number(chatId)), ...state.chats.filter((c) => c.id !== Number(chatId))],
    })),
  handleNewMessage: (chatId) =>
    set((state) => {
      const newChats = state.chats.map((chat) => {
      return String(chat.id) === String(chatId)
        ? {...chat, unseenMessages: chat.unseenMessages + 1} 
        : chat;
      });
      console.log(newChats);
      return {
        chats: newChats,
      };
  }),
  handleSeenMessage: (chatId) =>
    set((state) => {
      const newChats = state.chats.map((chat) => {
        return String(chat.id) === String(chatId)
          ? {...chat, unseenMessages: 0} 
          : chat;
      });
      return {
        chats: newChats,
      };
    }),
  handleMessageModification: (chatId, message) =>
    set((state) => {
      let newMessages: Message[] = [];
      if (message.type === 'EDIT') {
        newMessages = state.messages[chatId]?.map((msg) => {
        if (msg.messageId !== message.messageId) {
          return msg;
        }
        return {
          ...msg,
          message: message.message,
        };
        
        }) || [];
      }else if (message.type === 'DELETE') {
        newMessages = state.messages[chatId]?.filter((msg) => msg.messageId !== message.messageId) || [];
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: newMessages,
        },
      };
    }),
  deleteMessage: (chatId, messageId) =>
    set((state) => {
      const newMessages = state.messages[chatId]?.filter((msg) => msg.messageId !== messageId) || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: newMessages,
        },
      };
    }),
  editMessage: (chatId, messageId, newMessage) => 
    set((state) => {
      const newMessages = state.messages[chatId]?.map((msg) => {
        if (msg.messageId === messageId) {
          return { ...msg, message: newMessage };
        }
        return msg;
      }) || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: newMessages,
        },
      };
    }),
  setSelectedChat: (chatId) =>
    set(() => ({ 
      selectedChat: chatId 
    })),  
}));
