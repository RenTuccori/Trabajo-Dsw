// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';

function HomeUsuario() {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <div className="form">
      <button onClick={() => navigate('/sacarturno')}>Sacar un Turno</button>
      <button onClick={() => navigate('/verturnos')}>Ver mis turnos</button>
      <button onClick={() => navigate('/editardatospersonales')}>Modificar datos personales</button>
      <button onClick={() => navigate('/')}>Volver a inicio</button>
    </div>
  );
}

export default HomeUsuario;
