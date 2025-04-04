import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input
  } from "@heroui/react";

const CreateGroupModal = ({onSubmit }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // Manejar el envío del formulario
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ groupName, members });
      resetForm();
    };
  
    // Añadir un nuevo miembro
    const addMember = () => {
      if (newMember.trim() && !members.includes(newMember.trim())) {
        setMembers([...members, newMember.trim()]);
        setNewMember('');
      }
    };
  
    // Eliminar un miembro
    const removeMember = (memberToRemove) => {
      setMembers(members.filter(member => member !== memberToRemove));
    };
  
    // Resetear el formulario
    const resetForm = () => {
      setGroupName('');
      setMembers([]);
      setNewMember('');
    };
  
    // Manejar cierre del modal
    const handleClose = () => {
      resetForm();
      onClose();
    };
  
    return (
      <>
        <Button onPress={onOpen}>Open Modal</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          {/* Modal Header */}
          <ModalContent>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              Crear Nuevo Chat Grupal
            </h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              x
            </button>
          </ModalContent>
          
          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Nombre del Grupo */}
            <div className="mb-4">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Grupo
              </label>
              <input 
                type="text" 
                id="groupName" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Amigos del trabajo"
              />
            </div>
            
            {/* Añadir Miembros */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Añadir Miembros
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre o correo del miembro"
                />
                <button 
                  type="button"
                  onClick={addMember}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 flex items-center"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Lista de Miembros */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miembros ({members.length})
              </label>
              <div className="bg-gray-50 rounded-md p-2 max-h-40 overflow-y-auto">
                {members.length === 0 ? (
                  <p className="text-gray-500 text-sm italic py-1">Aún no hay miembros añadidos</p>
                ) : (
                  <ul className="space-y-1">
                    {members.map((member, index) => (
                      <li key={index} className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded">
                        <div className="flex items-center">
                          u
                          <span className="text-sm">{member}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeMember(member)}
                          className="text-red-500 hover:text-red-700"
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
              <button 
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 flex items-center"
                disabled={!groupName || members.length === 0}
              >
                -
                Crear Grupo
              </button>
            </div>
          </form>
        </Modal>
      </>
    );
  };
  
  export default CreateGroupModal;