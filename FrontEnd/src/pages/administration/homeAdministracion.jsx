import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';

function HomeAdministracion() {
  const { login, idAdmin, comprobarToken } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [contra, setContra] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    comprobarToken('A');
  }, [comprobarToken]);

  const handleLogin = async () => {
    try {
      await login({ identifier: usuario, credential: contra, userType: 'A' });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      window.notifyError('Error: Usuario o contraseña incorrectos');
    }
  };

  const handleUsuarioChange = (event) => setUsuario(event.target.value);
  const handleContraChange = (event) => setContra(event.target.value);

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-blue-800">
          Ingrese su usuario
        </p>
        <input
          type="text"
          value={usuario}
          onChange={handleUsuarioChange}
          placeholder="Usuario"
          className="w-full border border-gray-300 rounded-lg py-2 px-4"
        />
        <p className="text-lg font-semibold text-blue-800">
          Ingrese su Contraseña
        </p>
        <input
          type="password"
          value={contra}
          onChange={handleContraChange}
          placeholder="Contraseña"
          className="w-full border border-gray-300 rounded-lg py-2 px-4"
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={!usuario || !contra}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Verificar
      </button>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Menú Principal
      </h2>
      <button
        onClick={() => navigate('/admin/crearSede')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sedes
      </button>
      <button
        onClick={() => navigate('/admin/crearEsp')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Especialidades
      </button>
      <button
        onClick={() => navigate('/admin/crearDoc')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Doctores
      </button>
      <button
        onClick={() => navigate('/admin/combinacion')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Asignar combinación
      </button>
      <button
        onClick={() => navigate('/admin/crearOS')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Obras Sociales
      </button>
      <button
        onClick={() => {
          navigate('/');
          localStorage.removeItem('token');
        }}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {!idAdmin ? renderLoginForm() : renderMenu()}
      </div>
    </div>
  );
}

export default HomeAdministracion;
