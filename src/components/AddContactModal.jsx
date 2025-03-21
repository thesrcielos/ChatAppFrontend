import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { X, Search } from "lucide-react";
import {getUsersByPatterns, sendContactRequest} from "../api/UserApi";
import { useUser } from "../services/UserContext.jsx";

const AddContactModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const{userId, setUserId} = useUser();
  

  const handleSearch = async () => {
    const coincidences = await getUsersByPatterns(searchTerm, 0, 5);
    console.log(coincidences.values);
    setSearchResult(coincidences.values);
  };

  const sendRequest = async (id) => {
    console.log(id);
    await sendContactRequest({userId:userId, contactId:id});
  }
  
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Título y botón de cerrar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Añadir Contacto</h2>
          <Button onClick={onClose} className="p-1 rounded-full bg-gray-200">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Campo de búsqueda con botón de lupa */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <Button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-lg">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Lista de resultados */}
        <div className="space-y-2">
          {searchResult.length > 0 ? (
            searchResult.map((contact, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded-lg">
                <div key={index}>
                  <p>{contact.name}</p>
                  <p>{contact.email}</p>
                </div>
                <Button onClick={() => sendRequest(contact.userId)} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                  Agregar
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">No se encontraron contactos.</p>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default AddContactModal;
