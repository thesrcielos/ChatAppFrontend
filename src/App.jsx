import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css'
import AppRoutes from './AppRoutes';
import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from './services/UserContext.jsx';
function App() {
  return (
      <HeroUIProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path='/*' element={<AppRoutes/>}/>
            </Routes>
          </Router>
        </UserProvider>
      </HeroUIProvider>
  );
}

export default App