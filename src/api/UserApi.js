import api from "./Api.js";

BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api";

export const acceptContact = async (id) => {
    try {
        await api.post(`${BACKEND_URL}/users/contacts/${id}/accept`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }

}

export const blockContact = async (id) => {
    try {
        await api.post(`${BACKEND_URL}/users/contacts/${id}/block`);
        return true;
      } catch (error) {
        console.error('Error al crear el post:', error);
        return false;
      }
}

export const deleteContact = async (id) => {
  try {
      await api.delete(`${BACKEND_URL}/users/contacts/${id}`);
      return true;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getBlockedContact = async (id, page, size) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts/blocked?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getContactRequests = async (id, page, size) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts/requested?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return false;
    }
}

export const getUserContacts = async (id, page, size) => {
  try {
      const data = await api.get(`${BACKEND_URL}/users/${id}/contacts?page=${page}&size=${size}`);
      return await data.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      return null;
    }
}

export const sendContactRequest = async ({userId, contactId}) => {
  try {
      await api.post(`${BACKEND_URL}/users/{id}/contacts?page=${page}&size=${size}` ,
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
