import { useEffect } from "react"
import { useUser, setToken } from "../services/UserContext";
import { loginWithGoogle} from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import {connectWebSocket} from "../services/MessageService";

const GoogleCallback = () =>{
    const {checkAuth, login} = useUser();
    const navigate = useNavigate();
    useEffect( () => {
        const authenticate = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            
            if (code) {
              const data = await loginWithGoogle(code); // Asegúrate de que el token se guarde antes de continuar
              const token =  data.token;
              setToken(token);
              if (checkAuth()) {
                connectWebSocket();
                navigate("/home");
              }
            }
          };
      
          authenticate();
    },[])
    return (
        <h1>
            Login... Please Wait...
        </h1>
    )
}

export default GoogleCallback;