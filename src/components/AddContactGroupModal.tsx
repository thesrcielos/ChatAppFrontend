import React, { useState, useEffect } from 'react';
import { getUserContacts } from "../api/UserApi";
import { getUserChatsByPatterns } from "../api/ChatApi";
import { useUser } from '../services/UserContext';
import useDebounce from '../services/useDebounce';
import { Contact, Chat } from '../types/types';

interface AddContactGroupModalProps {
  onClose: () => void;
  onAddContact: (contacts: Contact[]) => void;
  selected: () => Contact[];
}

const AddContactGroupModal = ({ onClose, onAddContact, selected }: AddContactGroupModalProps) => {
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

  useEffect(() => {
    const getData = async () => {
      const contacts = await getUserContacts(Number(userId), 0, 10);
      const currentSelected = selected();
      const all = contacts?.values ?? [];
      setAvailableContacts(all);
      setSelectedContacts(currentSelected);
      setFilteredContacts(mergeUniqueContacts(currentSelected, all));
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!debouncedQuery.trim()) {
        setFilteredContacts(mergeUniqueContacts(selectedContacts, availableContacts));
        return;
      }
      const chats = await getUserChatsByPatterns(Number(userId), debouncedQuery, 0, 5);
      const filtered = chats?.values.map((c: Chat) => c.contact) ?? [];
      setFilteredContacts(filtered);
    };
    getData();
  }, [debouncedQuery]);

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts(prev =>
      prev.some(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleAddContacts = () => {
    if (selectedContacts.length === 0) {
      alert('Por favor, selecciona al menos un contacto');
      return;
    }
    onAddContact(selectedContacts);
    setSelectedContacts([]);
    setSearchQuery('');
    onClose();
  };

  const close = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContacts([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Añadir contactos</h2>
          <button
            onClick={close}
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input de búsqueda */}
        <div className="mb-4">
          <div className="relative w-full inline-flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar contactos..."
            />
          </div>
        </div>

        {/* Lista de contactos */}
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
                    <input
                      type="checkbox"
                      checked={selectedContacts.some(c => c.id === contact.id)}
                      readOnly
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

        {/* Barra de estado y botones */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              {selectedContacts.length} contacto(s) seleccionado(s)
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddContacts}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={selectedContacts.length === 0}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactGroupModal;
