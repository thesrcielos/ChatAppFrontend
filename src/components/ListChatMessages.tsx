import ChatMessages from "./ChatMessages";

const ListChatMessages = ({selectedContact, contacts}) => {

    return (
        contacts.map((contact) => {
            return <ChatMessages 
                key={contact.id}
                contact={contact}
                selectedContact={selectedContact}
            />
        })
    )

}

export default ListChatMessages;