import { MessageRequest } from "@/types/types";
import axiosInstance from "./Api.js";
import axios from "axios";
import { toLocalISOString } from "@/utils/dateUtils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/chats";

const api = axiosInstance();
export const deleteMessage = async (id: string) => {
    try {
        await api.delete(`${BACKEND_URL}/conversation/${id}/message`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const editMessage = async (id: string, message: string) => {
    try {
        await api.put(`${BACKEND_URL}/conversation/${id}/message`, {
            id: id,
            message: message
        });
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const getChatMessages = async (id: number, beforeDate: Date, size: number) => {
    try {
        const dateTime = toLocalISOString(beforeDate);
        const data = await api.get(`${BACKEND_URL}/conversation/${id}/messages/before?beforeDate=${dateTime}&size=${size}`);
        return await data.data;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return null;
      }
}

export const getUserChats = async (id: number, page: number, size: number) => {
  try {
    const data = await api.get(`${BACKEND_URL}/users/${id}?page=${page}&size=${size}`);
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}

export const getUsersChatInfo = async (id: number) => {
  try {
    const data = await api.get(`${BACKEND_URL}/${id}/users`);
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}


export const getUserChatsByPatterns = async (id: number, pattern: string, page: number, size: number) => {
  try {
    const data = await api.get(`${BACKEND_URL}/users/${id}/contacts?pattern=${pattern}&page=${page}&size=${size}`);
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}
export const sendAudioMessage = async (file: Blob, message: MessageRequest) => {
  if (!file || file.size === 0) {
    console.error('Archivo de audio inválido.');
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", new Blob([JSON.stringify(message)], { type: "application/json" })); 
    const response = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`,formData, {
      headers: { "Content-Type": "multipart/form-data" }});
    return response.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}

export const getFileData = async (url: string) => {
  try {
    const data = await axios.get(url,{ headers : {"Content-Type": "application/json"}});
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}
