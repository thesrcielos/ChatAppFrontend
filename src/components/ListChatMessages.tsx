import { Chat } from "@/types/types";
import ChatMessages from "./ChatMessages";

interface ListChatMessagesProps {
    contacts: Chat[];
}

const ListChatMessages = ({contacts}: ListChatMessagesProps ) => {

    return (
        contacts.map((chat) => {
            return <ChatMessages 
                key={chat.id}
                chat={chat}
            />
        })
    )

}

export default ListChatMessages;