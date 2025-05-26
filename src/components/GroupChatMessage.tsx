import AudioMessagePlayer from "./AudioMessagePlayer";
import { Message } from "@/types/types";
import { useUser } from "@/services/UserContext";

interface ChatMessageProps {
    username?: string;
    message: Message;
    timestamp?: string;
    avatar?: string;
}    

const GroupChatMessage = ({ username, message, timestamp, avatar }: ChatMessageProps) => {
  const { userId } = useUser();
  const isSender = String(message.userId) === String(userId);
  if (isSender) {
      return !!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
        <div className="flex relative">
          <p className="mt-1">{message.message}</p>
          <span className="absolute bottom-0 right-0 text-xs text-black-500">{timestamp}</span>
        </div>
      )
    }
    return (
      <div className="flex gap-3 rounded-lg">
      <div className="flex-shrink-0">
      {avatar ? (
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full" />
           ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {username?.charAt(0).toUpperCase()}
          </div>  
      )}
      </div>
      <div className="flex-1 relative">
        <div className="flex items-center gap-2">
          <span className="font-medium">{username}</span>
        </div>
        {!!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
          <p className="mt-1">{message.message}</p>
        )}
        {timestamp && <span className="absolute bottom-0 right-0 text-xs text-gray-500">{timestamp}</span>}
      </div>
      </div>
      );
  }

export default GroupChatMessage;