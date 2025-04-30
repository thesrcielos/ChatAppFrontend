import { useRef, useState } from "react";
import { signup } from "../services/AuthService";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useUser, setToken } from "../services/UserContext";

const SignUp = () => {
    const navigate = useNavigate();
    const userEmail = useRef(null);
    const userName = useRef(null);
    const [userPassword, setUserPassword] = useState("");
    const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
    const {checkAuth, login} = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = userEmail.current.value;
        const name = userName.current.value;
        if(userPassword !== userPasswordConfirmation && userPassword !== ""){
            alert("Las contraseñas no coinciden");
            return;
        }
        const password = userPassword;
        const data = await signup({name,email,password});
        const token = await data.token;
        setToken(token);
            
        if(checkAuth()){
            navigate("/home");
        }

    }

    return(
        <main className="signup-container">
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    ref={userName}
                    required
                    placeholder="Escribe tu nombre"
                />
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    ref={userEmail}
                    required
                    placeholder="example@example.com"
                />
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e)=>{setUserPassword(e.target.value)}}
                    required
                    placeholder="********"
                />
                <label htmlFor="password-confirmation">Confirmar Contraseña</label>
                <input
                    type="password"
                    id="password-confirmation"
                    name="password-confirmation"
                    onChange={(e)=>{setUserPasswordConfirmation(e.target.value)}}
                    required
                    placeholder="********"
                />
                <button
                    type="submit"
                >Registrarse</button>
            </form>
        </main>
    );
}

export default SignUp;