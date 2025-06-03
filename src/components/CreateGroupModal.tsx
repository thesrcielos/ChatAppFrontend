import React, { useState } from 'react';
import AddContactGroupModal from './AddContactGroupModal';
import { Contact } from '@/types/types';
import { Dialog, DialogTrigger,DialogContent, DialogHeader
      ,DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from './ui/button';
import {createGroupChat} from "../api/GroupApi";
import { useChatStore } from '@/store/chatStore';
import { useUser } from '../services/UserContext';
import { toast } from "sonner";

interface CreateChatGroupModalProps {
  children: React.ReactNode;
}

const CreateChatGroupModal = ({ children }: CreateChatGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Contact[]>([]);
  const addChat = useChatStore((state) => state.addChat);
  const { userId } = useUser();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.info('Por favor ingresa un nombre para el grupo');
      return;
    }
    if (participants.length == 0) {
      toast.info('Debes agregar al menos 1 participante al grupo');
      return;
    }
  
    const userList = participants.map((user) => user.contact);
    createGroup(groupName, userList)
    setGroupName('');
    setDescription('');
    setParticipants([]);
  };
  
  const createGroup = async (name: string, members: number[]) => {
      const result =  await createGroupChat(name, Number(userId), members);
      if(!result) {
        toast.info("Error al crear el grupo, intenta nuevamente");
        return;
      }
      addChat(result);
    }

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
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
          {children}
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Grupo</DialogTitle>
        </DialogHeader>
        
        <form>
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
              <AddContactGroupModal 
                selected={getParticipants}
                onAddContacts={addParticipants}
              />
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
        </form>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" className='cursor-pointer' onClick={handleSubmit}>
              Crear Grupo
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" className='cursor-pointer' onClick={close}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatGroupModal;