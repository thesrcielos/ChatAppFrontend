import axiosInstance from "./Api.js";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api";

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

export const getUsersByPatterns = async (pattern: string, page: number, size: number) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/coincidences?pattern=${pattern}&page=${page}&size=${size}`);
      return await data.data;
  } catch (error) {
    console.error('Error al obtener el id:', error);
    return false;
  }
}