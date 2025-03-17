import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;
export const loginWithGoogle = async (code) => {
    try {
      const response = await axios.post(`${url}/api/auth/token`, {
        code: code
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.data;
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  export const login = async ({email,password}) => {
    try {
      const response = await axios.post(`${url}/api/auth/login`, {
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  export const signup = async ({name, email,password}) => {
    console.log(name);
    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        name: name,
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
