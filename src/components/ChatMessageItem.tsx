import { Chat, Message } from "@/types/types"
import { useChatStore } from "@/store/chatStore"
import GroupChatMessage from "./GroupChatMessage";
import ChatMessage from "./ChatMessage";
import { getHourFromDate } from "@/utils/dateUtils";

interface ChatMessageItemProps {
  message: Message;
  chat: Chat;
}
const ChatMessageItem = ({ message, chat } : ChatMessageItemProps) => {
    const contacts = useChatStore((state) => state.contacts);
    if(chat.isGroup) {
        const user = !!contacts[message.userId] ? contacts[message.userId] : {name: "Loading..."};
        return <GroupChatMessage username={user.name} message={message}
            timestamp={getHourFromDate(message.sentAt)}/>
    }
    return (
        <ChatMessage message={message}/>
    )
    
}

export default ChatMessageItem;