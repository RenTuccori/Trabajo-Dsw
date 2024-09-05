import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

function HomeDoctor() {
  const { idDoctor, login, comprobarToken } = useDoctores();
  const [dni, setDni] = useState('');
  const [contra, setContra] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    await login({ dni, contra });
  };

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handleContraChange = (event) => {
    setContra(event.target.value);
  };

  useEffect(() => {
    comprobarToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="home-container">
      {!idDoctor ? (
        <div className="form">
          <div className="input-group">
            <p className='text'>Ingrese su DNI</p>
            <input
              type="text"
              value={dni}
              onChange={handleDniChange}
              placeholder="DNI"
              className="dni-input"
            />
            <p className='text'>Ingrese su Contraseña</p>
            <input
              type="password"
              value={contra}
              onChange={handleContraChange}
              placeholder="Contraseña"
              className="contra-input"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!dni || !contra}
            className="verify-button"
          >
            Verificar
          </button>
        </div>
      ) : (
        <div className="home-container">
          <button onClick={() => navigate('turnoshoy')}>Turnos de hoy</button>
          <button onClick={() => navigate('turnosfecha')}>Turnos por Fecha</button>
          <button onClick={() => navigate('turnoshist')}>Historial Turnos</button>
          <button onClick={() => navigate('/')}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default HomeDoctor;
