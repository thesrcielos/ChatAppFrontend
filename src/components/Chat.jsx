import "./Chat.css";
import MessageInput from "./MessageInput.jsx";
import { useEffect, useState } from "react";
import { Send, CircleUserRound, Search, Smile } from "lucide-react";
import { Button, Card, CardHeader, CardBody, Input  } from "@heroui/react";
import { sendMessageWS, subscribe, sendAudioWS } from "../services/MessageService";
import {getChatMessages,  getUserChats, getUserChatsByPatterns, getFileData} from "../api/ChatApi.js";
import { useUser } from "../services/UserContext.jsx";
import {jwtDecode} from "jwt-decode";
import AddContactModal from "./AddContactModal.jsx";
import RequestsModal from "./RequestModal.jsx";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import AudioRecorder from "./AudioRecorder.jsx";
import ReactAudioPlayer from 'react-audio-player';
import AudioMessagePlayer from "./AudioMessagePlayer.jsx";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {userId, setUserId} = useUser();
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  useEffect( () => {
      const load = async ()=>{
      const token = localStorage.getItem("token");
      if (!!token) {
        let payload = jwtDecode(token);
        setUserId(payload.id);
        console.log(payload.id);
        await getChats(payload.id);
        subscribe(handleMessages);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (message === null) {
      return;
    }
    setMessages([...messages, message])
  }, [message])

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
  }

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessageWS({content: newMessage,
                conversationId: contact.id,
                contactId:contact.contact.id,
                sentAt: new Date()
    });
    setMessages([...messages, { message: newMessage, userId: userId }]);
    setShowPicker(false);
    setNewMessage("");
  }

  const sendMessageKeyEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage(); // Ejecuta el evento del botón
    }
  }

  const getChats = async (id) => {
    const data = await getUserChats(id, 0, 10);
    console.log(data);
    setContacts(data.values);
  }

  const handleMessages = (message) => {
    setMessage(message)
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
  
  const handleSearchTerm = async (searchTerm) => {
    setSearchTerm(searchTerm);
    const data = await getUserChatsByPatterns(userId, searchTerm, 0, 10);
    setContacts(data.values); 
  }

  const convertMessage = (message) => {
    console.log(message);
    if(!!message.fileType) {
      return <AudioMessagePlayer audioSrc={message.fileUrl}/>
    }
    return <p>{message.message}</p>
  }

  return (
    <div className="container-chat flex justify-left items-left h-screen">
    {/* Lista de contactos con barra de búsqueda */}
    <Card className="w-2/5 p-4 bg-gray-100 rounded-lg shadow-md">
      <CardHeader className="flex flex-col gap-4 justify-start items-start">
        {/* Título y botones */}
        <div className="flex items-center gap-3">
          <h2 className="text-left font-bold text-lg flex-grow">Chats</h2>
          {/* Botón para ver solicitudes de contacto */}
          <Button 
            className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            onPress={() => setIsRequestsModalOpen(true)}
          >
            <CircleUserRound className="w-6 h-6 text-white" />
          </Button>
          {/* Botón para añadir contactos */}
          <Button 
            className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
            onPress={() => setIsModalOpen(true)}
          >
            +
          </Button>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-contacts inline-flex items-center w-full border rounded-lg px-3 py-2">
          <Search className="text-gray-500 w-5 h-5" />
          <Input 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm}  
            onChange={(e) => handleSearchTerm(e.target.value)} 
            className="w-full border-none focus:outline-none focus:ring-0 bg-transparent ml-2"
          />
        </div>
      </CardHeader>
        <CardBody className="p-4 w-full max-h-80 overflow-y-auto">
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

    {/* Área de chat */}
    { !!contact ? (
    <main className="flex-1 flex flex-col w-3/5">
      <header className="p-4 bg-blue-500 text-white font-bold text-lg">
        {contact.contact.name}
      </header>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 text-left rounded-lg max-w-xs ${
              Number(msg.userId) === Number(userId) ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {convertMessage(msg)}
          </div>
        ))}
      </div>

      <footer className="relative text-container pt-2 pb-2 pl-4 pr-4 bg-white 
      flex items-end justify-end gap-2">
        { !isRecordingAudio && (
          <>
            <Button onPress={() => setShowPicker(!showPicker)}>
              <Smile />
            </Button>
            {showPicker && (
              <div className="absolute bottom-12">
                <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji.emoji)} />
              </div>
            )}
            <MessageInput text={newMessage} setText={setNewMessage} sendMessage={sendMessageKeyEnter} />
          </>
        )}
        <Button onClick={sendMessage} className="bg-white text-gray">
          {newMessage !== "" ? (
            <Send className="w-5 h-5" onClick={sendMessage} />
          ) : (
            <AudioRecorder onAudioReady={sendAudioWS} setMessage={setMessage}
            contact={contact} onOpen={setIsRecordingAudio}/>
          )}
        </Button>
      </footer>

    </main>):<div className="w-3/5"></div> }
    <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <RequestsModal isOpen={isRequestsModalOpen} onClose={() => setIsRequestsModalOpen(false)} />
  </div>
  );
}