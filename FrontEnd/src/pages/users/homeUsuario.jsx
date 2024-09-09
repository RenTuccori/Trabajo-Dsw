// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { usePacientes} from '../../context/paciente/PacientesProvider.jsx';
import { useState,useEffect } from 'react';
import '../../estilos/home.css';

function HomeUsuario() {
  const navigate = useNavigate();
  const {dni, login, comprobarToken } = usePacientes();
  const [dniform, setDni] = useState('');
  const [fecha, setFecha] = useState('');

  const handleLogin = async () => {
    await login({ dni: dniform, fechaNacimiento: fecha });
  }
  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handleFechaChange = (event) => {
    setFecha(event.target.value);
  };

  useEffect(() => {
    comprobarToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      {!dni ? (
        <div className="form">
          <div className="input-group">
            <p className='text'>Ingrese su DNI</p>
            <input
              type="text"
              value={dniform}
              onChange={handleDniChange}
              placeholder="DNI"
              className="dni-input"
            />
            <p className='text'>Ingrese su Fecha</p>
            <input
              type="date"
              value={fecha}
              onChange={handleFechaChange}
              placeholder="Fecha Nacimiento"
              className="fecha-input"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!dniform || !fecha}
            className="verify-button"
          >
            Verificar
          </button>
          <button 
            onClick={() => navigate('/paciente/datospersonales')}
          >Registrarse</button>
        </div>
      ) : (
        <div className="home-container">
          <button onClick={() => navigate('/paciente/sacarturno')}>Sacar un Turno</button>
          <button onClick={() => navigate('/paciente/verturnos')}>Ver mis turnos</button>
          <button onClick={() => navigate('/paciente/editardatospersonales')}>Modificar datos personales</button>
          <button onClick={() => navigate('/')}>Volver a inicio</button>
        </div>
      )}
    </div>
  );
}
export default HomeUsuario;

