import { useState } from "react";
import { X, Search } from "lucide-react";
import { getUsersByPatterns, sendContactRequest } from "../api/UserApi";
import { useUser } from "@/services/UserContext";
import { ContactSearch } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContactModal = ({ isOpen, onClose }: AddContactModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ContactSearch[]>([]);
  const { userId } = useUser();
  const [contactsAdded, setContactsAdded] = useState(new Set<string>());

  const handleSearch = async () => {
    const coincidences = await getUsersByPatterns(searchTerm, userId ?? "", 0, 5);
    setSearchResult(coincidences.values);
  };

  const sendRequest = async (id: number) => {
    let newContactsAdded = new Set(contactsAdded);
    newContactsAdded.add(id.toString());
    setContactsAdded(newContactsAdded);
    await sendContactRequest(Number(userId), id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Añadir Contacto</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch} className="cursor-pointer" variant="default">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          {searchResult.length > 0 ? (
            searchResult.map((contact) => (
              <div
                key={contact.userId}
                className="flex justify-between items-center p-2 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                {!contactsAdded.has(contact.userId.toString()) ? (
                <Button
                  className="cursor-pointer"
                  onClick={() => sendRequest(contact.userId)}
                  variant="secondary"
                  size="sm"
                >
                  Agregar
                </Button>) : (
                  <Button disabled variant="secondary" size="sm">
                    <Check className="w-6 h-6" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No se encontraron contactos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
