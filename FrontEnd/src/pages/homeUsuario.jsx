// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function HomeUsuario() {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <div className="home-container">
      <button onClick={() => navigate('/sacarturno')}>Sacar un Turno</button>
      <button onClick={() => navigate('/')}>Ver mis turnos</button>
      <button onClick={() => navigate('/')}>Modificar datos personales</button>
      <button onClick={() => navigate('/')}>Volver a inicio</button>
    </div>
  );
}

export default HomeUsuario;
