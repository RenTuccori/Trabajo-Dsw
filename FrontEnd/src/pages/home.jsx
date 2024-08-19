// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function Home() {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <div className="home-container">
      <button onClick={() => navigate('/doctor')}>Doctor</button>
      <button onClick={() => navigate('/paciente')}>Paciente</button>

    </div>
  );
}

export default Home;
