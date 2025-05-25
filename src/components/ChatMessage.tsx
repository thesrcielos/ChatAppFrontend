import AudioMessagePlayer from "./AudioMessagePlayer";
import { Message } from "../types/types";

interface ChatMessageProps {
    username: string;
    message: Message;
    timestamp?: string;
    avatar?: string;
}    

const ChatMessage = ({ username, message, timestamp, avatar }: ChatMessageProps) => {
    return (
      <div className="flex gap-3 hover:bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
        {avatar ? (
            <img src={avatar} alt={username} className="w-10 h-10 rounded-full" />
            ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
            </div>  
        )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{username}</span>
            {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
          </div>
          {!!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
          <p className="mt-1">{message.message}</p>
          )}
        </div>
      </div>
    );
  };

export default ChatMessage;