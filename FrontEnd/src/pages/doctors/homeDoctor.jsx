import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';
import { USER_TYPES } from '../../constants/userTypes.js';

function HomeDoctor() {
  const { idDoctor, login, comprobarToken, nombreUsuario, apellidoUsuario } =
    useAuth();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle login with success toast
  const handleLogin = async () => {
    try {
      await login({ identifier: dni, credential: password, userType: USER_TYPES.DOCTOR });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      window.notifyError('Error al iniciar sesión');
    }
  };

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    comprobarToken(USER_TYPES.DOCTOR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 space-y-5 animate-slide-up">
        {!idDoctor ? (
          <div className="space-y-4">
            <p className="section-title text-center text-lg">
              Ingrese sus datos
            </p>
            <div className="space-y-4">
              <p className="label text-center">
                Ingrese su DNI
              </p>
              <input
                type="text"
                value={dni}
                onChange={handleDniChange}
                placeholder="DNI"
                className="input"
              />
              <p className="label text-center">
                Ingrese su contraseña
              </p>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
                className="input"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!dni || !password}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verificar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Bienvenido Dr/Dra {nombreUsuario} {apellidoUsuario}
              </h2>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate('turnoshoy')}
                className="btn-primary"
              >
                Turnos de hoy
              </button>
              <button
                onClick={() => navigate('turnosfecha')}
                className="btn-primary"
              >
                Turnos por fecha
              </button>
              <button
                onClick={() => navigate('turnoshist')}
                className="btn-primary"
              >
                Historial de turnos
              </button>
              <button
                onClick={() => navigate('estudios')}
                className="btn-primary"
              >
                Gestión de estudios
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="btn-secondary"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeDoctor;
