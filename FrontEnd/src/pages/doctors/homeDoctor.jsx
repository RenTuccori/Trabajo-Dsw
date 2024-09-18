import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';


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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {!idDoctor ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600">Ingrese sus credenciales</p>
            <div className="space-y-4">
              <p className='text'>Ingrese su DNI</p>
              <input
                type="text"
                value={dni}
                onChange={handleDniChange}
                placeholder="DNI"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <p className='text'>Ingrese su Contraseña</p>
              <input
                type="password"
                value={contra}
                onChange={handleContraChange}
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!dni || !contra}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Verificar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver
            </button>
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
                Turnos por Fecha
              </button>
              <button
                onClick={() => navigate('turnoshist')}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Historial Turnos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeDoctor;
