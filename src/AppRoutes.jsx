import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import GoogleCallback from "./components/GoogleCallback";
import SignUp from "./components/SignUp";
import ChatApp from "./components/Chat";

const AppRoutes = () =>{
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/home" element={<ChatApp/>}/>
            <Route path="/google/callback" element={<GoogleCallback/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Routes>
    );
}

export default AppRoutes;