import { Chat, Message } from "@/types/types"
import { useChatStore } from "@/store/chatStore"
import { useUser } from "@/services/UserContext"
import ChatMessage from "./ChatMessage";
import AudioMessagePlayer from "./AudioMessagePlayer";
import { getHourFromDate } from "@/utils/dateUtils";

interface ChatMessageItemProps {
  message: Message;
  chat: Chat;
}
const ChatMessageItem = ({ message, chat } : ChatMessageItemProps) => {
    const contacts = useChatStore((state) => state.contacts);
    const {userId} = useUser();
    if(chat.isGroup && Number(message.userId) !== Number(userId)) {
        const user = !!contacts[message.userId] ? contacts[message.userId] : {name: "Loading..."};
        return <ChatMessage username={user.name} message={message}
            timestamp={getHourFromDate(message.sentAt)}/>
    }
    
    return !!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
        <p className="mt-1">{message.message}</p>
    )
}

export default ChatMessageItem;