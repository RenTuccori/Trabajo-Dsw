import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmin } from '../../api/admin.api'; 
import '../../estilos/sacarturno.css';

function HomeAdmin() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContra] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el idDoctor ya existe en localStorage al cargar el componente
    const idAdmin = localStorage.getItem('idAdmin');
    if (idAdmin) {
      setIsVerified(true);
    }
  }, []);

  const handleUsuarioChange = (event) => {
    setUsuario(event.target.value);
  };

  const handleContraChange = (event) => {
    setContra(event.target.value);
  };

  const handleVerificarAdmin = async () => {
    try {
      const response = await getAdmin({ usuario: usuario, contra: contraseña });

      if (response.data && response.data.idAdmin) {
        console.log('Admin verificado con ID:', response.data.idAdmin);
        setIsVerified(true);
        localStorage.setItem('idAdmin', response.data.idAdmin);
        setErrorMessage('');
      } else {
        setErrorMessage('Admin no encontrado');
      }
    } catch (error) {
      console.error('Error al verificar el admin:', error);
      setErrorMessage('Admin no encontrado');
    }
  };

  return (
    <div className="home-container">
      {!isVerified ? (
        <div className="form">
          <div className="input-group">
            <p className='text'>Ingrese su usuario</p>
            <input
              type="text"
              value={usuario}
              onChange={handleUsuarioChange}
              placeholder="Usuario"
              className="usario-input"
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
            onClick={handleVerificarAdmin}
            disabled={!usuario || !contraseña}
            className="verify-button"
          >
            Verificar
          </button>
          {errorMessage && <p className="text">{errorMessage}</p>}
        </div>
      ) : (
        <div className="home-container">
          <button onClick={() => navigate('/')}>Sedes</button>
          <button onClick={() => navigate('/')}>Especialidades</button>
          <button onClick={() => navigate('/')}>Doctores</button>
          <button onClick={() => navigate('/')}>Asignar combinacion</button>
          <button onClick={() => navigate('/')}>Obras Sociales</button>
          <button onClick={() => navigate('/')}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default HomeAdmin;
