// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import '../estilos/home.css';

function HomeDoctor() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button onClick={() => navigate('/turnosdoctor')}>Ver mis turnos</button>
    </div>
  );
}

export default HomeDoctor;
