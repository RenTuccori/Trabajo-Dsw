// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Navbar from './components/navbar';
import { AdministracionRoutes } from './routes/administracion.routes.jsx';
import { DoctoresRoutes } from './routes/doctores.routes.jsx';
import { PacientesRoutes } from './routes/pacientes.routes.jsx'; 

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paciente/*" element={<PacientesRoutes />} />
          <Route path="/doctor/*" element={<DoctoresRoutes />} />
          <Route path="/admin/*" element={<AdministracionRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
