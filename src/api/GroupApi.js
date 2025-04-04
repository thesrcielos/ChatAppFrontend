import api from "./Api.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/chats";

export const createGroupChat = async ({name, id, userList}) => {
  try {
    const data = await api.post(`${BACKEND_URL}/group/conversation`,
      {
        name: name,
        userId: id,
        groupUsers: userList
      }
    );
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