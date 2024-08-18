import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../api/doctores.api'; 
import '../estilos/home.css';
import '../estilos/white-text.css';

function HomeDoctor() {
  const [dniDoctor, setDniDoctor] = useState('');
  const [contraseña, setContra] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleDniChange = (event) => {
    setDniDoctor(event.target.value);
  };

  const handleContraChange = (event) => {
    setContra(event.target.value);
  };

  const handleVerificarDoctor = async () => {
    try {
      const response = await verifyDoctor({ dni: dniDoctor, contra: contraseña });

      if (response.data && response.data.idDoctor) {
        console.log('Doctor verificado con ID:', response.data.idDoctor);
        setIsVerified(true);
        localStorage.setItem('idDoctor', response.data.idDoctor);
        setErrorMessage(''); // Limpiar el mensaje de error
      } else {
        setErrorMessage('Doctor no encontrado');
      }
    } catch (error) {
      console.error('Error al verificar el doctor:', error);
      setErrorMessage('Doctor no encontrado');
    }
  };

  return (
    <div className="home-container">
      {!isVerified ? (
        <div className="form">
          <div className="input-group">
            <p className='text'>Ingrese su DNI</p>
            <input
              type="text"
              value={dniDoctor}
              onChange={handleDniChange}
              placeholder="DNI"
              className="dni-input"
            />
            <p className='text'>Ingrese su Contraseña</p>
            <input
              type="password"
              value={contraseña}
              onChange={handleContraChange}
              placeholder="Contraseña"
              className="contra-input"
            />
          </div>
          <button
            onClick={handleVerificarDoctor}
            disabled={!dniDoctor || !contraseña}
            className="verify-button"
          >
            Verificar
          </button>
          {errorMessage && <p className="text">{errorMessage}</p>} {/* Mostrar mensaje de error */}
        </div>
      ) : (
        <div className="home-container">
          <button onClick={() => navigate('/turnoshoy')}>Turnos de hoy</button>
          <button onClick={() => navigate('/')}>Turnos por Fecha</button>
          <button onClick={() => navigate('/turnoshist')}>Historial Turnos</button>
        </div>

      )}
    </div>
  );
}

export default HomeDoctor;

