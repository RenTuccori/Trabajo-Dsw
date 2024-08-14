// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Sanatorio UTN</h1>
      <button onClick={() => navigate('/sacarturno')}>Sacar un Turno</button>
      <button onClick={() => navigate('/')}>Ver mis turnos</button>
      <button onClick={() => navigate('/')}>Modificar datos personales</button>
    </div>
  );
}

export default Home;
