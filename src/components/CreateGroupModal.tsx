import React, { useState } from 'react';
import AddContactGroupModal from './AddContactGroupModal';
import { Contact } from '@/types/types';

interface CreateChatGroupModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onCreateGroup: (groupName: string, participants: number[]) => void;
}

const CreateChatGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateChatGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Contact[]>([]);
  const [isSelectingContacts, setIsSelectingContacts] = useState(false);

  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert('Por favor ingresa un nombre para el grupo');
      return;
    }
  
    const userList = participants.map((user) => user.contact);
    onCreateGroup(groupName, userList)
    setGroupName('');
    setDescription('');
    setParticipants([]);

    onClose(false);
  };
  
  const getParticipants = () => {
    return participants;
  }
  const addParticipants = (newParticipants: Contact[]) => {
      setParticipants([...newParticipants]);
  };
  
  const removeParticipant = (participantToRemove: Contact) => {
    setParticipants(participants.filter(p => p !== participantToRemove));
  };
  
  const close = () => {
    setGroupName('');
    setDescription('');
    setParticipants([]);
    onClose(false);
  }

  return (
    <div onClick={close}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-60">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Crear nuevo grupo de chat</h2>
          <button 
            onClick={close}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del grupo 
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Amigos de la universidad"
              required
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del grupo (opcional)"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Participantes
              </label>
              <button
                type="button"
                style={{padding: 0}}
                onClick={() => setIsSelectingContacts(true)}
                className="bg-blue-500 text-white h-6 w-6 rounded-md hover:bg-blue-600"
              >
                +
              </button>
            </div>
            
            
            {participants.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Participantes agregados:</p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="bg-gray-100 w-full px-3 py-1 rounded-full flex items-center">
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeParticipant(participant)}
                        className="ml-2 bg-transparent text-gray-500 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear grupo
            </button>
          </div>
        </form>
      </div>
      {isSelectingContacts && (<AddContactGroupModal 
        onClose={() => setIsSelectingContacts(false)}
        selected={getParticipants}
        onAddContact={addParticipants}
      />)}
    </div>
  );
};

export default CreateChatGroupModal;