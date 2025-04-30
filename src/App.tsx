import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import AppRoutes from './routes/AppRoutes';
import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from './services/UserContext';

function App() {
  return (
      <HeroUIProvider>
        <UserProvider>
          <Router>
            <Routes>          
                <Route path='/*' element={<AppRoutes/>}/>
            </Routes>
            <ForceRedirect/>
          </Router>
        </UserProvider>
      </HeroUIProvider>
  );
}

function ForceRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {    
    const isCallbackRoute = location.pathname.startsWith('/google/callback') 
      || location.pathname.startsWith('/signup') || location.pathname.startsWith('/'); 
    if (!isCallbackRoute) {
      navigate('/');
    }
  }, []);

  return null;
}

export default App