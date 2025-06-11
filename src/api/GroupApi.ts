import axiosInstance from "./Api.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/chats";
const api = axiosInstance();
export const createGroupChat = async (name: string, description: string,userId: number, userList: number[]) => {
  try {
    const data = await api.post(`${BACKEND_URL}/group/conversations`,
      {
        name: name,
        description: description,
        userId: userId,
        groupUsers: userList
      }
    );
    return await data.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    return false;
  }
}

export const getGroupChatMessages = async (id: number, page: number, size: number) => {
    try {
        await api.get(`${BACKEND_URL}/group/conversation/${id}/messages?page=${page}&size=${size}`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}