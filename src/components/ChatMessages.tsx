import { useState, useEffect } from "react";
import { Button } from "@heroui/react"
import {Smile, Send} from 'lucide-react';
import MessageInput from "./MessageInput";
import {sendAudioWS} from "../services/MessageService";
import EmojiPicker from "emoji-picker-react";
import AudioRecorder from "./AudioRecorder";
import { useUser } from "../services/UserContext";
import { sendMessageWS } from "../services/MessageService";
import AudioMessagePlayer from "./AudioMessagePlayer";
import { getUsersChatInfo, getChatMessages } from "../api/ChatApi";
import { subscribe } from "../services/MessageService";
import ChatMessage from "./ChatMessage";
import { Chat, Contact, Message } from "@/types/types";

interface ChatMessagesProps {
    selectedContact: Chat;
    contact: Chat;
}

const ChatMessages = ({selectedContact, contact} : ChatMessagesProps) => {
    const {userId} = useUser();
    const [showPicker, setShowPicker] = useState(false);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [message, setMessage] = useState<Message | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersInfo, setUsersInfo] = useState<Record<string, Contact>>({});

    useEffect(() => {
        const getMessages = async () => {
            const messages = await getChatMessages(contact.id, 0, 10);
            setMessages(messages.values);
            subscribe(String(contact.id), handleMessages);
            const users = await getUsersChatInfo(contact.id);
            const usersInfo = users.reduce((acc : { [key: string]: Contact }, user: Contact) => {
              acc[user.id] = user;
              return acc;
            }, {});
            setUsersInfo(usersInfo);
        }
        getMessages();
    }, []);

    useEffect(() => {
        if (!message) return;
        console.log("New message: ", message);
        setMessages((prev: Message[]) => [...prev, message]);
    }, [message]);

    const handleMessages = (message: Message) => {
        setMessage(message);
    }
    const sendMessageKeyEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          sendMessage();
        }
    }

    function getHourFromDate(timestamp: Date) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const convertMessage = (message: Message) => {
        if(contact.isGroup && Number(message.userId) !== Number(userId)) {
          const user = !!usersInfo[message.userId] ? usersInfo[message.userId] : {name: "Loading..."};
          return <ChatMessage username={user.name} message={message}
          timestamp={getHourFromDate(message.sentAt)}/>
        }
        return !!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
          <p className="mt-1">{message.message}</p>
          )
    }

    const addEmoji = (emoji: string) => {
        setNewMessage(newMessage + emoji);
      }
    
      const sendMessage = () => {
        if (newMessage.trim() === "") return;
        const id = contact.isGroup ? userId : contact.contact.id;
        sendMessageWS({content: newMessage,
                    conversationId: contact.id,
                    contactId: id,
                    sentAt: new Date()
        });
        setMessages([...messages, {  message: newMessage, userId: userId ? Number(userId): 0,
          sentAt: new Date(), conversationId: contact.id, messageId: "" }]);
        setShowPicker(false);
        setNewMessage("");
    }

    const getChatName = () => {
        if (contact.isGroup) {
          return contact.group.name;
        }
        return contact.contact.name;
    };

    if (selectedContact?.id !== contact.id) {
      return null;
    }

    return (
        <main className="flex-1 flex flex-col w-3/5">
          <header className="p-4 bg-blue-500 text-white font-bold text-lg">
            {getChatName()}
          </header>
    
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 text-left rounded-lg max-w-xs ${
                  Number(msg.userId) === Number(userId) ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {convertMessage(msg)}
              </div>
            ))}
          </div>
    
          <footer className="relative text-container pt-2 pb-2 pl-4 pr-4 bg-white 
          flex items-end justify-end gap-2">
            { !isRecordingAudio && (
              <>
                <Button onPress={() => setShowPicker(!showPicker)}>
                  <Smile />
                </Button>
                {showPicker && (
                  <div className="absolute bottom-12">
                    <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji.emoji)} />
                  </div>
                )}
                <MessageInput text={newMessage} setText={setNewMessage} sendMessage={sendMessageKeyEnter} />
              </>
            )}
            <Button onClick={sendMessage} className="bg-white text-gray">
              {newMessage !== "" ? (
                <Send className="w-5 h-5" onClick={sendMessage} />
              ) : (
                <AudioRecorder setMessage={setMessage}
                contact={contact} onOpen={setIsRecordingAudio}/>
              )}
            </Button>
          </footer>
        </main>);
}

export default ChatMessages;