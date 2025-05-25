import { Message } from "@/types/types";
import AudioMessagePlayer from "./AudioMessagePlayer";
import { getHourFromDate } from "@/utils/dateUtils";

interface ChatMessageProps {
    message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {

    return (
        <div className="flex relative">
            {!!message.fileType ? (<AudioMessagePlayer audioSrc={message?.fileUrl ?? ""}/>) : (
            <p className="mt-1">{message.message}</p>)}
            <span className="absolute bottom-0 right-0 text-xs">{getHourFromDate(message.sentAt)}</span>
        </div>
    )
}

export default ChatMessage;