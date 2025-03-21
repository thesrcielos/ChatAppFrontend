import "./Chat.css";
import { useEffect, useState } from "react";
import { Send, Menu, Search } from "lucide-react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { sendMessageWS } from "../services/MessageService";
import {getChatMessages,  getUserChats, getUserChatsByPatterns} from "../api/ChatApi.js";
import { useUser } from "../services/UserContext.jsx";
import {jwtDecode} from "jwt-decode";
import AddContactModal from "./AddContactModal.jsx";
import RequestsModal from "./RequestModal.jsx";
import { motion } from "framer-motion";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {userId, setUserId} = useUser();
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [contact, setContact] = useState(null);

  const filteredContacts = () => {/* contacts.filter((contact) =>
    contact.toLowerCase().includes(searchTerm.toLowerCase())*/
  };

  useEffect( () => {
      const load = async ()=>{
      const token = localStorage.getItem("token");
      if (!!token) {
        let payload = jwtDecode(token);
        setUserId(payload.id);
        console.log(payload.id);
        await getChats(payload.id);
      }
    }
    load();
  }, []);
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessageWS({content: newMessage,
                conversationId: contact.id,
                contactId:contact.contact.id,
                sentAt: new Date()
    });
    setMessages([...messages, { message: newMessage, userId: userId }]);
    setNewMessage("");
  };

  const getChats = async (id) => {
    const data = await getUserChats(id, 0, 10);
    console.log(data);
    setContacts(data.values);
  }

  const openChat = async (contact) => {
    setContact(contact);
    if(contact.id === null) {
      setMessages([]);
      return;
    }
    const data = await getChatMessages(contact.id, 0, 10);
    setMessages(data.values);
    console.log(messages);
  }
  
  const handleSearchTerm = async () => {
    if(searchTerm !== "") {
      const data = await getUserChatsByPatterns(userId, searchTerm, 0, 10);
      setContacts(data.values);
    }
  }

  return (
    <div className="flex w-screen justify-left items-left h-screen">
    {/* Lista de contactos con barra de búsqueda */}
    <div className="w-2/5 pl-2 bg-gray shadow-lg">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-left font-bold">Chats</h2>
        <div className="flex gap-2">
          {/* Botón para ver solicitudes de contacto */}
          <Button 
            className="bg-green-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => setIsRequestsModalOpen(true)}
          >
            📩
          </Button>
          {/* Botón para añadir contactos */}
          <Button 
            className="bg-blue-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </Button>
        </div>
      </div>
      <Card className="flex flex-row items-center bg-white">
        <Input type="text" placeholder="Buscar..." value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="s-contacts rounded-lg"/>
        <Button onPress={handleSearchTerm}>
          <Search className="w-5 h-5 text-white-500" />
        </Button>
      </Card>

       <Card className="w-full max-w-md shadow-lg">
      <CardBody className="p-4 max-h-80 overflow-y-auto">
        {contacts?.length > 0 ? (
          contacts.map((contact, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button onPress={()=>openChat(contact)} className="w-full py-3 text-left mb-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                {contact.contact.name}
              </Button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay chats disponibles</p>
        )}
      </CardBody>
    </Card>
    </div>

    {/* Área de chat */}
    { !!contact ? (
    <main className="flex-1 flex flex-col">
      <header className="p-4 bg-blue-500 text-white font-bold text-lg">
        {contact.contact.name}
      </header>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 text-left rounded-lg max-w-xs ${
              msg.userId === Number(userId) ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {msg.message}
            {console.log(msg.userId == userId)}
            {console.log(typeof userId)}
            {console.log(typeof msg.userId)}
          </div>
        ))}
      </div>

      <footer className="p-4 border-t bg-white flex items-center gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border rounded-lg"
        />
        <Button onClick={sendMessage} className="bg-blue-500 text-white">
          <Send className="w-5 h-5" />
        </Button>
      </footer>
    </main>):null }
    <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <RequestsModal isOpen={isRequestsModalOpen} onClose={() => setIsRequestsModalOpen(false)} />
  </div>
  );
}
