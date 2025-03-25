import api from "./Api.js";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/chats";

export const deleteMessage = async (id) => {
    try {
        await api.delete(`${BACKEND_URL}/conversation/${id}/message`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const editMessage = async ({id, message}) => {
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

export const getChatMessages = async (id, page, size) => {
    try {
        const data = await api.get(`${BACKEND_URL}/conversation/${id}/messages?page=${page}&size=${size}`);
        return await data.data;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return null;
      }
}

export const getGroupChatMessages = async (id, page, size) => {
    try {
        await api.get(`${BACKEND_URL}/group/conversation/${id}/messages?page=${page}&size=${size}`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const getUserChats = async (id, page, size) => {
  try {
    const data = await api.get(`${BACKEND_URL}/users/${id}?page=${page}&size=${size}`);
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}

export const getUserChatsByPatterns = async (id, pattern, page, size) => {
  try {
    const data = await api.get(`${BACKEND_URL}/users/${id}/contacts?pattern=${pattern}&page=${page}&size=${size}`);
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}
export const sendAudioMessage = async (file, message) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", new Blob([JSON.stringify(message)], { type: "application/json" })); 
    const response = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`,formData, {
      headers: { "Content-Type": "multipart/form-data" }});
    return await response.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}

export const getFileData = async (url) => {
  try {
    const data = await axios.get(url,{ headers : {"Content-Type": "application/json"}});
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return null;
  }
}
