import axios from "axios";

export const loginWithGoogle = async (code) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/token', {
        code: code
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
  };

  export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  export const login = async ({email,password}) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
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
      const response = await axios.post('http://localhost:8080/api/auth/register', {
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
