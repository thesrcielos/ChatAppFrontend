import { useRef, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import { Input, Button, Card, Form } from "@heroui/react";
import { connectWebSocket } from "../services/MessageService";
import { useUser, setToken } from "../services/UserContext";

export const Login = () => {
  const userEmail = useRef<HTMLInputElement | null>(null);
  const userPassword = useRef<HTMLInputElement | null>(null);
  const { checkAuth } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail.current || !userPassword.current) return;

    const email = userEmail.current.value;
    const password = userPassword.current.value;

    try {
      const data = await loginUser({ email, password });
      const token = data.token;
      setToken(token);

      if (checkAuth()) {
        handleAuthentication();
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  useEffect(() => {
    if (checkAuth()) {
      console.log("login authenticated");
      handleAuthentication();
    }
  }, [checkAuth]);

  const handleAuthentication = async () => {
    navigate("/home");
    connectWebSocket();
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI; 
    const scope = "openid profile email";
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
              className="flex justify-start items-start"
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
};

export default Login;
