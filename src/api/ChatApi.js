import api from "./Api.js";

BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/chat";

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
        await api.get(`${BACKEND_URL}/conversation/${id}/messages?page=${page}&size=${size}`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
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

export const sendMessage = async () => {
    
}