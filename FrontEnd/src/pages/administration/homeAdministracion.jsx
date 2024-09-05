import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

function HomeAdmin() {
  const { idAdmin, login, comprobarToken } = useAdministracion();
  const [usuario, setUsuario] = useState('');
  const [contra, setContra] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    await login({ usuario, contra });
  };

  const handleUsuarioChange = (event) => {
    setUsuario(event.target.value);
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
      {!idAdmin ? (
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
              value={contra}
              onChange={handleContraChange}
              placeholder="Contraseña"
              className="contra-input"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!usuario || !contra}
            className="verify-button"
          >
            Verificar
          </button>

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
