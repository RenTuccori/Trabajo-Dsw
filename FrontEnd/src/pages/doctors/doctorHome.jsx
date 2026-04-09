import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';

function DoctorHome() {
  const { doctorId, login, comprobarToken, nombreUsuario, apellidoUsuario } =
    useAuth();
  const [dni, setDni] = useState('');
  const [password, setContra] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Manejo del login con toast de éxito
  const handleLogin = async () => {
    try {
      await login({ identifier: dni, credential: password, userType: 'Doctor' });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      console.error('Error al iniciar sesión', error);

      // Usar el toast de error global
      window.notifyError('Error al iniciar sesión');
    }
  };

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handleContraChange = (event) => {
    setContra(event.target.value);
  };

  useEffect(() => {
    comprobarToken('Doctor');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && dni && password) {
      handleLogin();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      {/* Fondo de imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/src/components/fondo2.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-0"></div>

      {/* Contenido */}
      <div className="relative z-10 bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          {doctorId && nombreUsuario && apellidoUsuario
            ? `Bienvenido/a Dr/Dra ${nombreUsuario} ${apellidoUsuario}`
            : 'Portal de Médicos'}
        </h1>

        {!doctorId ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-lg">Ingrese su DNI</p>
            <input
              type="text"
              value={dni}
              onChange={handleDniChange}
              onKeyDown={handleKeyDown}
              placeholder="DNI"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
            <p className="text-center text-gray-600 text-lg">
              Ingrese su contraseña
            </p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleContraChange}
                onKeyDown={handleKeyDown}
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
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
            <button
              onClick={() => navigate('todayAppointments')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Turnos de hoy
            </button>
            <button
              onClick={() => navigate('appointmentsByDate')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Turnos por fecha
            </button>
            <button
              onClick={() => navigate('appointmentHistory')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Historial de turnos
            </button>
            <button
              onClick={() => navigate('uploadStudy')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gestión de estudios
            </button>
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

export default DoctorHome;



