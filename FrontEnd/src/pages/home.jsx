// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function Home() {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <div className="home-container">
      <h1>¡Bienvenido al Sanatorio UTN!</h1>
      <p>Por favor, selecciona tu rol para continuar:</p>
      <button className='botonInicio' onClick={() => navigate('/doctor')}>Soy doctor</button>
      <button className='botonInicio' onClick={() => navigate('/paciente')}>Soy paciente</button>
    </div>
  );
}

export default Home;
