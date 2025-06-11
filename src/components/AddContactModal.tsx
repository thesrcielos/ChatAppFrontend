import React, { useState } from "react";
import { Search } from "lucide-react";
import { getUsersByPatterns, sendContactRequest } from "../api/UserApi";
import { useUser } from "@/services/UserContext";
import { ContactSearch } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { Dialog, DialogTrigger,DialogContent, DialogHeader
      ,DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import useIsMobile from "@/services/IsMobile";

interface AddContactModalProps {
  children: React.ReactNode;
}
const AddContactModal = ({children}: AddContactModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ContactSearch[]>([]);
  const { userId } = useUser();
  const [contactsAdded, setContactsAdded] = useState(new Set<string>());
  const isMobile = useIsMobile();

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


  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${isMobile ? "fixed top-0 left-0 translate-x-0 translate-y-0 rounded-none m-0":""}`}>
        <DialogHeader>
          <DialogTitle>Añadir Contacto</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch} className="cursor-pointer" 
          variant="default" disabled={searchTerm.trim() === ""}>
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
         <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => {setSearchTerm(""); setSearchResult([])}}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default AddContactModal;
