import { create } from 'zustand';
import { Message, Contact, Chat } from '@/types/types';

type ChatState = {
  messages: Record<string, Message[]>; 
  contacts: Record<string, Contact>;
  chats: Chat[];
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  addMessages: (chatId: string, messages: Message[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  moveChatToTop: (chat: Chat) => void;
  moveChatToTopId: (chatId: String) => void;
  handleNewMessage: (chatId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  contacts: {},
  chats: [],
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
  setChats: (chats) =>
    set((state) => ({
      chats: chats
    })),  
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
      console.log("handleNewMessage", chatId);
      console.log("state.chats", state.chats[0].id);
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
}));
