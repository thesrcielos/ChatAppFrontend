import { ReactNode, useEffect, useState } from "react";
import {
  getUserInfo,
  uploadProfilePicture,
  deleteProfilePicture,
} from "@/api/UserApi";
import { useUser } from "../services/UserContext";
import { MessageSquareText } from 'lucide-react';
import useIsMobile from "@/services/IsMobile";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type PerfilProps = {
  children: ReactNode;
};

export interface User {
  id: number;
  name: string;
  email?: string;
  picture?: string;
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
const Perfil = ({children }: PerfilProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useUser(); 
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!userId) return;
        const data = await getUserInfo(Number(userId));
        setUser(data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    loadUser();
  }, [userId]);

 const getPicture = (): React.ReactNode => {
  if (user?.picture) {
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
    setShowOptions((v) => !v);
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
    }catch (err) {
      console.error("Error en conversión a WebP:", err);
    } finally {
      setShowOptions(false);

    }
  }
    
 
  const handleDelete = async () => {
    if (user) {
      await deleteProfilePicture(user.id);
      const updated = await getUserInfo(user.id);
      setUser(updated);
    }
    setShowOptions(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent className={`${isMobile ? "fixed top-0 left-0 translate-x-0 translate-y-0 rounded-none":""}`}>
        <DialogHeader>
          <DialogTitle>
            Perfil de Usuario
          </DialogTitle>
        </DialogHeader>

      {user ? (
      <>  
        <div className="flex flex-col items-center">
        {getPicture()}
        <h3 className="text-xl font-medium">{user.name}</h3>
        {user.email && (
          <p className="text-gray-600 mb-2">{user.email}</p>
        )}
      </div>

      {showOptions && (
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
      </> ):
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        Cargando perfil...
      </div>}
      </DialogContent>
    </Dialog>
  );
};

export default Perfil;
