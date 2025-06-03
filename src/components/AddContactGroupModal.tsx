import React, { useState, useEffect } from 'react';
import { getUserContacts } from "../api/UserApi";
import { getUserChatsByPatterns } from "../api/ChatApi";
import { useUser } from '../services/UserContext';
import useDebounce from '../services/useDebounce';
import { Contact, Chat } from '../types/types';
import { Dialog, DialogTrigger,DialogContent, DialogHeader
      ,DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { toast } from "sonner";

interface AddContactGroupModalProps {
  onAddContacts: (contact: Contact[]) => void;
  selected: () => Contact[];
}

const AddContactGroupModal = ({onAddContacts, selected }: AddContactGroupModalProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { userId } = useUser();

  const mergeUniqueContacts = (a: Contact[], b: Contact[]): Contact[] => {
    const map = new Map<string, Contact>();
    [...a, ...b].forEach(c => map.set(c.id, c));
    return Array.from(map.values());
  };

   const fetchInitialContacts = async () => {
    if (!userId) return;
    try {
      const contacts = await getUserContacts(Number(userId), 0, 10);
      const currentSelected = selected();
      const all = contacts?.values ?? [];
      setAvailableContacts(all);
      setSelectedContacts(currentSelected);
      setFilteredContacts(mergeUniqueContacts(currentSelected, all));
    } catch (error) {
      console.error('Error al obtener contactos:', error);
    }
  };

  const fetchFilteredContacts = async () => {
    if (!userId) return;
    if (!debouncedQuery.trim()) {
      setFilteredContacts(mergeUniqueContacts(selectedContacts, availableContacts));
      return;
    }
    const chats = await getUserChatsByPatterns(Number(userId), debouncedQuery, 0, 5);
    const filtered = chats?.values.map((c: Chat) => c.contact) ?? [];
    setFilteredContacts(filtered);
    
  }


  useEffect(() => {
    fetchFilteredContacts();
  }, [debouncedQuery]);

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts(prev =>
      prev.some(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleAddContacts = (e: React.MouseEvent) => {
    if (selectedContacts.length === 0) {
      e.preventDefault();
      toast.error('Por favor, selecciona al menos un contacto');
      return;
    }
    onAddContacts(selectedContacts);
    setSelectedContacts([]);
    setSearchQuery('');
  };

  const close = (e: React.MouseEvent) => {
    setSelectedContacts([]);
    setSearchQuery('');
  };

  return (
    <Dialog onOpenChange={fetchInitialContacts}>
        <DialogTrigger>
          <Plus className="w-5 h-5 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Miembros</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar contactos..."
          />

        <div className="mb-4 max-h-64 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`py-3 px-2 flex items-center cursor-pointer hover:bg-gray-50 ${
                    selectedContacts.some(c => c.id === contact.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleContactSelection(contact)}
                >
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                  <div className="ml-2">
                    <Checkbox
                      checked={selectedContacts.some(c => c.id === contact.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No se encontraron contactos
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              {selectedContacts.length} contacto(s) seleccionado(s)
            </div>
          </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" 
            className="cursor-pointer" onClick={handleAddContacts}>
              Añadir
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary" 
            className="cursor-pointer" onClick={close}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactGroupModal;
