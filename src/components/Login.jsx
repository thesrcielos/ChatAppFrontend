import { useRef, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {isAuthenticated, login} from "../services/AuthService";

export const Login = () => {
    const userEmail = useRef(null);
    const userPassword = useRef(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = userEmail.current.value;
      const password = userPassword.current.value;
  
      await login({email,password});
      if (isAuthenticated()) {
        navigate('/home');
      }
    };

    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated()) {
        navigate('/home');
      }
    }, [navigate]);
  
    const handleGoogleLogin = () => {
      // Abrir ventana de login de Google
      const clientId = '420529377259-kqc8jor0bu6aktlm5pulgouhudrtnb8l.apps.googleusercontent.com';
      const redirectUri = 'http://localhost:5173/google/callback/'; // La URI de redirección configurada
      const scope = 'openid profile email';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
    };

    return (
        <main className="login-container">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Correo Electrónico</label>
                <input
                type="email"
                ref={userEmail}
                id="email"
                name="email"
                required
                placeholder="Ingresa tu correo"
                />

                <label htmlFor="password">Contraseña</label>
                <input
                type="password"
                ref={userPassword}
                id="password"
                name="password"
                required
                placeholder="Ingresa tu contraseña"
                />

                <button type="submit">Entrar</button>
            </form>
            <div className="signup-link">
                <p>
                ¿No tienes cuenta? <a href="/signup">Regístrate aquí</a>
                </p>
            </div>
            <div className="login-oauth">
                <button onClick={handleGoogleLogin}>Google</button>
            </div>
    </main>
    );
}

export default Login;