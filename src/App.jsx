import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css'
import AppRoutes from './AppRoutes';

function App() {
  return (
      <Router>
        <Routes>
          <Route path='/*' element={<AppRoutes/>}/>
        </Routes>
      </Router>
  );
}

export default App
