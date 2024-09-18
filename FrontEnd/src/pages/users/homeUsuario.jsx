// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider.jsx';
import { useState, useEffect } from 'react';

function HomeUsuario() {
  const navigate = useNavigate();
  const { dni, login, comprobarToken } = usePacientes();
  const [dniform, setDni] = useState('');
  const [fecha, setFecha] = useState('');

  const handleLogin = async () => {
    await login({ dni: dniform, fechaNacimiento: fecha });
  };
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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      {/* Fondo de imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('../src/components/fondo.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-0"></div>

      {/* Contenido */}
      <div className="relative z-10 bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {!dni ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-lg">Ingrese su DNI</p>
            <input
              type="text"
              value={dniform}
              onChange={handleDniChange}
              placeholder="DNI"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
            <p className="text-center text-gray-600 text-lg">
              Ingrese su fecha de nacimiento
            </p>
            <input
              type="date"
              value={fecha}
              onChange={handleFechaChange}
              placeholder="Fecha Nacimiento"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={!dniform || !fecha}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Verificar
              </button>
              <button
                onClick={() => navigate('/paciente/datospersonales')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Registrarse
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/paciente/sacarturno')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sacar un Turno
            </button>
            <button
              onClick={() => navigate('/paciente/verturnos')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver mis turnos
            </button>
            <button
              onClick={() => navigate('/paciente/editardatospersonales')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modificar datos personales
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver a inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeUsuario;
