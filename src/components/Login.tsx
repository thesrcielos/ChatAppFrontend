import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/AuthService";
import { connectWebSocket } from "@/services/MessageService";
import { useUser, setToken } from "@/services/UserContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const { checkAuth } = useUser();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthentication = () => {
    navigate("/home");
    connectWebSocket();
  };

  useEffect(() => {
    if (checkAuth()) {
      console.log("login authenticated");
      handleAuthentication();
    }
  }, [checkAuth]);

  const onSubmit = async (values: LoginFormData) => {
    const { email, password } = values;

    // Validaciones
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!password || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

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

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = "openid profile email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <main className="flex justify-center items-center w-[100vw] min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            ¿No tienes cuenta? <a href="/signup" className="text-blue-600 underline">Regístrate aquí</a>
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </Card>
    </main>
  );
};

export default Login;
