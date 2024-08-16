// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function HomeUsuario() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button onClick={() => navigate('/sacarturno')}>Sacar un Turno</button>
      <button onClick={() => navigate('/')}>Ver mis turnos</button>
      <button onClick={() => navigate('/')}>Modificar datos personales</button>
    </div>
  );
}

export default HomeUsuario;
