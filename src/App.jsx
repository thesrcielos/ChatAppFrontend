import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css'
import AppRoutes from './AppRoutes';
import { HeroUIProvider } from "@heroui/react";
function App() {
  return (
      <HeroUIProvider>
        <Router>
          <Routes>
            <Route path='/*' element={<AppRoutes/>}/>
          </Routes>
        </Router>
      </HeroUIProvider>
  );
}

export default App
