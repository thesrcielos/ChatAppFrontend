import { Chat, Message } from "@/types/types";
import ChatMessages from "./ChatMessages";
import { Dispatch, SetStateAction } from "react";

interface ListChatMessagesProps {
    selectedContact: Chat | null;
    contacts: Chat[];
    setLastMessages: Dispatch<SetStateAction<Record<string, Message>>>;
}

const ListChatMessages = ({selectedContact, contacts, setLastMessages}: ListChatMessagesProps ) => {

    return (
        contacts.map((contact) => {
            return <ChatMessages 
                key={contact.id}
                chat={contact}
                setChatLastMessage={setLastMessages}
                selectedChat={selectedContact}
            />
        })
    )

}

export default ListChatMessages;