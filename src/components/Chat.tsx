import "./Chat.css";
import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardContent  } from "./ui/card";
import { Input } from "./ui/input";
import { getUserChats, getUserChatsByPatterns} from "../api/ChatApi";
import {createGroupChat} from "../api/GroupApi";
import { useUser } from "@/services/UserContext";
import {jwtDecode} from "jwt-decode";
import AddContactModal from "./AddContactModal";
import RequestsModal from "./RequestModal";
import CreateGroupModal from "./CreateGroupModal";
import ListChatMessages from "./ListChatMessages";
import UserMenu from "./UserMenu";
import ChatListItem from "./ChatListItem";
import { useChatStore } from "@/store/chatStore";

export default function ChatApp() {
  const contacts = useChatStore((state) => state.chats);
  const setContacts = useChatStore((state) => state.setChats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {userId, setUserId} = useUser();
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [contactsFetched, setContactsFetched] = useState(false);

  useEffect( () => {
      const load = async ()=>{
        const token = localStorage.getItem("token");
        if (!!token) {
          let payload : any = jwtDecode(token);
          setUserId(payload.id);
          console.log("User ID from token:", payload.id);
          await getChats(payload.id);
        }
      }
    load();
  }, []);

  const getChats = useCallback(async (id: number) => {
    if (contactsFetched) return;

    const data = await getUserChats(id, 0, 10);
    const contacts = data.values;
    console.log("Contacts fetched:", contacts);
    setContacts(contacts);
    setContactsFetched(true);
  }, [contactsFetched]);

  
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
    <Card className="w-2/5 bg-gray-100 rounded-lg shadow-md">
      <CardHeader className="flex flex-col gap-4 justify-start items-start">
        <div className="w-full flex justify-between items-center gap-3">
          <h2 className="text-left font-bold text-lg flex-grow">Chats</h2>
          <UserMenu onOpenRequests={() => setIsRequestsModalOpen(true)}
            onAddContact={() => setIsModalOpen(true)}
            onCreateGroup={() => setIsNewGroupOpen(true)}/> 
        </div>

        <div className="search-contacts inline-flex items-center w-full border rounded-lg px-3 py-2">
          <Search className="text-gray-500 w-5 h-5" />
          <Input 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm}  
            onChange={(e) => handleSearchTerm(e.target.value)} 
            className="w-full text-xl border-none focus:outline-none focus:ring-0 bg-transparent ml-2"
          />
        </div>
      </CardHeader>
        <CardContent className="relative w-[100%] p-0 overflow-y-auto">
          {contacts?.length > 0 ? (
            contacts.map((chat) => (
                <ChatListItem key={chat.id} onClick={()=>setSelectedChat(chat.id)}
                  isActive={chat.id === selectedChat} chat={chat} />
            ))
          ) : (
            <p className="text-gray-500 text-center">No hay chats disponibles</p>
          )}
        </CardContent>
    </Card>
    <ListChatMessages 
      contacts={contacts}  
      />
    <CreateGroupModal isOpen={isNewGroupOpen} onClose={setIsNewGroupOpen} onCreateGroup={createGroup}/>
    <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <RequestsModal isOpen={isRequestsModalOpen} onClose={() => setIsRequestsModalOpen(false)} />
  </div>
  );
}