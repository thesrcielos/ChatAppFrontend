import { useEffect } from "react"
import { loginWithGoogle, isAuthenticated } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () =>{
    const navigate = useNavigate();
    useEffect( () => {
        const authenticate = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            
            if (code) {
              await loginWithGoogle(code); // Asegúrate de que el token se guarde antes de continuar
              if (isAuthenticated()) {
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