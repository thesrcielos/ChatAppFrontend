import { useRef, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {isAuthenticated, login} from "../services/AuthService";
import { Input, Button, Card, Form } from "@heroui/react";
import {connectWebSocket} from "../services/MessageService";


export const Login = () => {
    const userEmail = useRef(null);
    const userPassword = useRef(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = userEmail.current.value;
      const password = userPassword.current.value;
  
      await login({email,password});
      if (isAuthenticated()) {
        handleAuthentication();
      }
    };

    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated()) {
        handleAuthentication();
      }
    }, [navigate]);
  
    const handleAuthentication = async () => {
      connectWebSocket();
      navigate('/home');
    }
    const handleGoogleLogin = () => {
      // Abrir ventana de login de Google
      const clientId = '420529377259-kqc8jor0bu6aktlm5pulgouhudrtnb8l.apps.googleusercontent.com';
      const redirectUri = 'http://localhost:5173/google/callback/'; // La URI de redirección configurada
      const scope = 'openid profile email';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
    };

    return (
      <main>      
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="flex flex-col justify-center items-center w-96 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
          
          <Form onSubmit={handleSubmit} className="text-left">
            <Input
              type="email"
              placeholder="Email"
              label="Email"
              ref={userEmail}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              label="Password"
              ref={userPassword}
              className="w-full"
              required
            />
            <Button type="submit" color="primary">
              Ingresar
            </Button>
            <div className="signup-link">
                <p>
                ¿No tienes cuenta? <a href="/signup">Regístrate aquí</a>
                </p>
            </div>
          </Form>
    
          <div className="mt-4 flex justify-center">
            <button 
              onClick={handleGoogleLogin} 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Iniciar sesión con Google
            </button>
          </div>
        </Card>
      </div>
    </main>
    
    );
}

export default Login;