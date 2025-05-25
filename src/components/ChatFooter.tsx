import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import MessageInput from "./MessageInput";
import AudioRecorder from "./AudioRecorder";
import { Message, Chat } from "@/types/types";
import { toLocalISOString } from "@/utils/dateUtils";
import { sendMessageWS } from "@/services/MessageService";
import { useChatStore } from "@/store/chatStore";

interface ChatFooterProps {
  chat: Chat;
  userId: string | null;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  setMessage: (msg: Message) => void;
}

const ChatFooter = ({
  chat,
  userId,
  newMessage,
  setNewMessage,
  setMessage
}: ChatFooterProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const addMessage = useChatStore((state) => state.addMessage);
  const changeChatsOrder = useChatStore((state) => state.moveChatToTop);
  const addEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const id = chat.isGroup ? userId : chat.contact.id;

    const message: Message = {
      message: newMessage,
      userId: userId ? Number(userId) : 0,
      sentAt: new Date(),
      conversationId: chat.id,
      messageId: "",
    };

    addMessage(String(chat.id), message);
    sendMessageWS({
        content: newMessage,
        conversationId: chat.id,
        contactId: id,
        sentAt: toLocalISOString(new Date()),
    })

    setShowPicker(false);
    setNewMessage("");
    changeChatsOrder(chat);
  };

  const sendMessageKeyEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <footer className="relative text-container pt-2 pb-2 pl-4 pr-4 bg-white flex items-end justify-end gap-2">
      {!isRecordingAudio && (
        <>
          <Button onClick={() => setShowPicker(!showPicker)}>
            <Smile />
          </Button>
          {showPicker && (
            <div className="absolute left-10 bottom-10 z-10">
              <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji.emoji)} />
            </div>
          )}
          <MessageInput text={newMessage} setText={setNewMessage} sendMessage={sendMessageKeyEnter} />
        </>
      )}
      {newMessage !== "" ? (
        <Button onClick={sendMessage} className="p-1 m-0 bg-white text-gray">
          <Send className="w-7 h-7"  aria-label="Enviar Mensaje"/>
        </Button>
      ) : (
        <AudioRecorder setMessage={setMessage} contact={chat} onOpen={setIsRecordingAudio} />
      )}
    </footer>
  );
};

export default ChatFooter;
