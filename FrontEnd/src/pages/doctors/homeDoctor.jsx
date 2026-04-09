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
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {!idDoctor ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-lg font-bold">
              Ingrese sus datos
            </p>
            <div className="space-y-4">
              <p className="text-center text-gray-600 text-lg">
                Ingrese su DNI
              </p>
              <input
                type="text"
                value={dni}
                onChange={handleDniChange}
                placeholder="DNI"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <p className="text-center text-gray-600 text-lg">
                Ingrese su contraseña
              </p>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!dni || !password}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Turnos de hoy
              </button>
              <button
                onClick={() => navigate('turnosfecha')}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Turnos por fecha
              </button>
              <button
                onClick={() => navigate('turnoshist')}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Historial de turnos
              </button>
              <button
                onClick={() => navigate('estudios')}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gestión de estudios
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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
