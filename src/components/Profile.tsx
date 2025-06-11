import { useEffect, useState } from "react";
import {
  getUserInfo,
  uploadProfilePicture,
  deleteProfilePicture,
  getChatGroupInfo
} from "@/api/UserApi";
import { useUser } from "../services/UserContext";
import { MessageSquareText, Shield, Trash2, Users, LogOut } from 'lucide-react';
import { useChatStore } from "@/store/chatStore";


type PerfilProps = {
  onClose: () => void;
  contactId?: string;
  isGroup?: boolean;
  chatId?: number;
};

export interface User {
  id: number;
  name: string;
  email?: string;
  picture?: string;
}

export interface Group {
  name: string;
  groupUsers: number[];
  image: string;
}

function convertToWebP(file: File, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error leyendo el archivo"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo convertir a WebP"));
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Error cargando la imagen"));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const Perfil = ({ onClose, contactId, isGroup, chatId }: PerfilProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const { userId } = useUser(); 
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isOwnProfile = !contactId;
  const targetId = contactId ?? userId;
  const chats = useChatStore((state) => state.chats);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!targetId) return;
        
        if (isGroup && chatId) {
          // Find the group in the chats list using chatId
          const groupChat = chats.find(chat => chat.isGroup && chat.id === chatId);
          if (groupChat) {
            setGroup(groupChat.group);
          }
        } else {
          const data = await getUserInfo(Number(targetId));
          setUser(data);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    loadProfile();
  }, [targetId, isGroup, chats, chatId]);

  const getPicture = (): React.ReactNode => {
    if (isGroup) {
      if (group?.image) {
        return (
          <img
            src={group.image}
            alt="Foto del grupo"
            className="w-24 h-24 rounded-full mb-4 cursor-pointer object-cover"
            onClick={handleImageClick}
          />
        );
      }
    } else if (user?.picture) {
      return (
        <img
          src={user.picture}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full mb-4 cursor-pointer object-cover"
          onClick={handleImageClick}
        />
      );
    }
    return (
      <div
        className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gray-300 cursor-pointer"
        onClick={handleImageClick}
      >
        <MessageSquareText className="text-white" size={24} />
      </div>
    );
  };

  const handleImageClick = () => {
    if (isOwnProfile) setShowOptions((v) => !v);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0]; 
    if (!originalFile || !user) return;
    
    try {
      const webpBlob = await convertToWebP(originalFile, 0.8);
      const webpFile = new File(
        [webpBlob],
        originalFile.name.replace(/\.\w+$/, ".webp"),
        { type: "image/webp" }
      );
      
      const formData = new FormData();
      formData.append("file", webpFile);
      formData.append("userId", String(user.id));

      const file = e.target.files?.[0];
      if (file && user) {
        setSelectedFile(file);
        const success = await uploadProfilePicture(user.id, file);
        if (success) {
          const updated = await getUserInfo(user.id);
          setUser(updated);
        }
      }
      setShowOptions(false);
    } catch (err) {
      console.error("Error en conversión a WebP:", err);
    } finally {
      setShowOptions(false);
    }
  };
    
  const handleDelete = async () => {
    if (user) {
      await deleteProfilePicture(user.id);
      const updated = await getUserInfo(user.id);
      setUser(updated);
    }
    setShowOptions(false);
  };

  const handleOptionClick = (action: string) => {
    // Aquí implementaremos las acciones según la opción seleccionada
    console.log(`Acción seleccionada: ${action}`);
    onClose();
  };

  if (!user && !group) {
    return (
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow rounded-lg p-6 w-96">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Perfil de {isGroup ? 'Grupo' : 'Usuario'}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-col items-center">
        {getPicture()}
        <h3 className="text-xl font-medium">{isGroup ? group?.name : user?.name}</h3>
        {!isGroup && user?.email && (
          <p className="text-gray-600 mb-2">{user.email}</p>
        )}
        {isGroup && group?.groupUsers && (
          <p className="text-gray-600 mb-2">{group.groupUsers.length} participantes</p>
        )}
      </div>

      {/* Menú de opciones */}
      {isOwnProfile && showOptions && !isGroup && (
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 z-50">
          <label className="block cursor-pointer text-blue-500 hover:underline">
            Editar foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleDelete}
            className="block text-red-500 hover:underline mt-2"
          >
            Eliminar foto
          </button>
        </div>
      )}

      {/* Opciones de contacto/grupo */}
      {!isOwnProfile && (
        <div className="mt-6 space-y-2">
          {isGroup ? (
            <>
              <button
                onClick={() => handleOptionClick('groupInfo')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Users className="w-4 h-4 mr-2" />
                Información del grupo
              </button>
              <button
                onClick={() => handleOptionClick('leaveGroup')}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir del grupo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleOptionClick('block')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Shield className="w-4 h-4 mr-2" />
                Bloquear contacto
              </button>
              <button
                onClick={() => handleOptionClick('delete')}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar contacto
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Perfil;
