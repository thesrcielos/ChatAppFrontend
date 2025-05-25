import axios from "axios";

const url: string = import.meta.env.VITE_BACKEND_URL;

interface AuthResponse {
  token: string; 
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export const loginWithGoogle = async (code: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${url}/api/auth/token`, {
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const loginUser = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${url}/api/auth/login`, {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const signup = async ({ name, email, password }: SignupCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${url}/api/auth/register`, {
      name: name,
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
