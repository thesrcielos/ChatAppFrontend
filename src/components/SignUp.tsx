import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser, setToken } from "../services/UserContext";
import { signup } from "../services/AuthService";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const { checkAuth } = useUser();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const handleSubmitForm = async (data: SignUpFormData) => {
    if (data.password !== data.passwordConfirmation) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const { name, email, password } = data;
      const response = await signup({ name, email, password });
      const token = response.token;
      setToken(token);

      if (checkAuth()) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      setErrorMessage("Ocurrió un error al registrar el usuario");
    }
  };

  return (
    <main className="signup-container flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Registrarse</h1>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium">
              Nombre
            </label>
            <Input
              id="name"
              placeholder="Escribe tu nombre"
              {...register("name", { required: "El nombre es requerido" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo válido",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="passwordConfirmation" className="font-medium">
              Confirmar Contraseña
            </label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="********"
              {...register("passwordConfirmation", {
                required: "La confirmación de contraseña es requerida",
              })}
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full">
            Registrarse
          </Button>
        </form>
      </Card>
    </main>
  );
};

export default SignUp;
