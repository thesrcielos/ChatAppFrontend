import "./Chat.css";
import { useEffect, useState } from "react";
import { CircleUserRound, Search } from "lucide-react";
import { Button, Card, CardHeader, CardBody, Input  } from "@heroui/react";
import { getUserChats, getUserChatsByPatterns} from "../api/ChatApi";
import {createGroupChat} from "../api/GroupApi";
import { useUser } from "../services/UserContext";
import {jwtDecode} from "jwt-decode";
import AddContactModal from "./AddContactModal";
import RequestsModal from "./RequestModal";
import CreateGroupModal from "./CreateGroupModal";
import ListChatMessages from "./ListChatMessages";
import { Chat } from "@/types/types";

export default function ChatApp() {
  const [contacts, setContacts] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {userId, setUserId} = useUser();
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [contact, setContact] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  useEffect( () => {
      const load = async ()=>{
        const token = localStorage.getItem("token");
        if (!!token) {
          let payload : any = jwtDecode(token);
          setUserId(payload.id);
          await getChats(payload.id);
        }
      }
    load();
  }, []);


  const getChats = async (id: number) => {
    const data = await getUserChats(id, 0, 10);
    const contacts = data.values;
    setContacts(contacts);
  }
  
  const createGroup = async (name: string, members: number[]) => {
    const result =  await createGroupChat(name, Number(userId), members);
    if(!result) {
      alert("Group not created");
      return;
    }
    setContacts([result, ...contacts])
  }
  const handleSearchTerm = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const data = await getUserChatsByPatterns(Number(userId), searchTerm, 0, 10);
    setContacts(data.values); 
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
          <Button 
            className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
            onPress={() => setIsNewGroupOpen(true)}
          >
            Group +
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
            contacts.map((contact) => (
                <Button key={contact.id} onPress={()=>setContact(contact)} className="w-full py-3 text-left mb-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                  {contact.isGroup ? contact.group.name : contact.contact.name}
                </Button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No hay chats disponibles</p>
          )}
        </CardBody>
    </Card>
    <ListChatMessages selectedContact={contact}
      contacts={contacts}  />
    <CreateGroupModal isOpen={isNewGroupOpen} onClose={setIsNewGroupOpen} onCreateGroup={createGroup}/>
    <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <RequestsModal isOpen={isRequestsModalOpen} onClose={() => setIsRequestsModalOpen(false)} />
  </div>
  );
}