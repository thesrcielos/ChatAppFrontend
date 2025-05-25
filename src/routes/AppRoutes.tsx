import { Routes, Route } from "react-router-dom";
import Login from "../components/Login.js";
import GoogleCallback from "../components/GoogleCallback.js";
import SignUp from "../components/SignUp.js";
import ChatApp from "../components/Chat.js";
import {PrivateRoute} from './PrivateRoute.jsx';

const AppRoutes = () =>{
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/google/callback" element={<GoogleCallback/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route element={<PrivateRoute/>}>
                <Route path="/home" element={<ChatApp/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;