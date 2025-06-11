import { StringifyOptions } from "querystring";
import axiosInstance from "./Api.js";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api";
export interface User {
  id: number;
  name: string;
  email: string;
}
export interface Chat {
  id: number,
  description: string,
  picture?:string
}

const api = axiosInstance();
export const acceptContact = async (id: number) => {
    try {
        await api.post(`${BACKEND_URL}/users/contacts/${id}/accept`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }

}

export const blockContact = async (id: number) => {
    try {
        await api.post(`${BACKEND_URL}/users/contacts/${id}/block`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const deleteContact = async (id: number) => {
  try {
      await api.delete(`${BACKEND_URL}/users/contacts/${id}`);
      return true;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getBlockedContact = async (id: number, page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts/blocked?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getContactRequests = async (id: number, page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts/requested?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getContactRequestsSent = async (id: number, page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts/requested-sent?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getUserContacts = async (id: number, page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return null;
    }
}

export const rejectContactRequest = async (id: number) => {
  try {
    await api.delete(`${BACKEND_URL}/users/contacts/request/${id}`);
    return true;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return false;
  }
}
export const sendContactRequest = async (userId: number , contactId: number) => {
  try {
      await api.post(`${BACKEND_URL}/users/contacts/request` ,
        {
          userId: userId,
          contactId: contactId
        }
      );
      return true;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getUsersByPatterns = async (pattern: string, id: string,page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/coincidences?pattern=${pattern}&page=${page}&size=${size}`);
      return await data.data;
  } catch (error) {
    console.error('Error al obtener el id:', error);
    return false;
  }
}
export const getUserInfo = async (userId: number): Promise<User | null> => {
  try {
   
    const response = await api.get(`http://localhost:8080/users/${userId}`, {
    });
    return await response.data;
    
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    return null;
  }
};
export const uploadProfilePicture = async (
  userId: number,
  file: File
): Promise<boolean> => {
  
  const formData = new FormData();
  formData.append("file", file);
  
  formData.append("userId", String(userId));

  try {
    const response = await fetch(`${BACKEND_URL}/files/profile-picture`, {
      method: "POST",
      headers: {
        
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: formData, 
    });

    return response.ok;
  } catch (error) {
    console.error("Error al subir la foto de perfil:", error);
    return false;
  }
};


export const deleteProfilePicture = async (userId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${BACKEND_URL}/files/${userId}/profile-picture`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error al eliminar la imagen de perfil:", error);
  }
};
export const getChatGroupInfo = async (chatId:number): Promise<Chat | null> => {
  return null;
}