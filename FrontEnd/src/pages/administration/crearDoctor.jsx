import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { toast } from 'react-toastify'; // Importa toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify

export function CrearDoctor() {
  const navigate = useNavigate();
  const { doctores, CreaDoctor, ObtenerDoctores, ObtenerPacienteDni, crearUsuario, usuario } = useAdministracion();
  const [dni, setDni] = useState('');
  const [duracionTurno, setDuracionTurno] = useState('');
  const [contra, setContra] = useState('');
  const [usuarioExistente, setUsuarioExistente] = useState(false);

  // Obtener doctores al cargar el componente
  useEffect(() => {
    ObtenerDoctores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verificar si el usuario existe por su DNI
  const handleBuscarDNI = async (e) => {
    e.preventDefault();
    if (dni.trim() !== '') {
      try {
        await ObtenerPacienteDni();
        if (usuario) {
          setUsuarioExistente(true); // El usuario existe, mostrar los campos adicionales
          toast.success('Usuario encontrado, continúe con los siguientes pasos.');
        } else {
          // Si no existe el usuario, crearlo primero
          await crearUsuario({ dni });
          setUsuarioExistente(true); // Después de crear el usuario, permitir continuar
          toast.success('Usuario creado, continúe con los siguientes pasos.');
        }
      } catch (error) {
        toast.error('Error al buscar o crear el usuario');
        console.error('Error al buscar/crear usuario:', error);
      }
    } else {
      toast.error('Ingrese un DNI válido');
    }
  };

  // Manejar la creación del doctor con la duración del turno y la contraseña
  const handleCrearDoctor = async (e) => {
    e.preventDefault();
    if (duracionTurno.trim() !== '' && contra.trim() !== '') {
      try {
        await CreaDoctor({ dni, duracionTurno, contra });
        setDni('');
        setDuracionTurno('');
        setContra('');
        toast.success('¡Doctor creado con éxito!');
        ObtenerDoctores();
        navigate('/admin'); // Redirigir al admin después de crear el doctor
      } catch (error) {
        toast.error('Error al crear el doctor');
        console.error('Error al crear doctor:', error);
      }
    } else {
      toast.error('Complete todos los campos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Crear Nuevo Doctor</h2>

        {/* Formulario para buscar o crear usuario por DNI */}
        {!usuarioExistente && (
          <form onSubmit={handleBuscarDNI} className="space-y-4">
            <input
              type="text"
              placeholder="DNI del doctor"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar/Crear Usuario
            </button>
          </form>
        )}

        {/* Formulario adicional solo si el usuario ya existe o se creó */}
        {usuarioExistente && (
          <form onSubmit={handleCrearDoctor} className="space-y-4">
            <input
              type="text"
              placeholder="Duración del turno (en minutos)"
              value={duracionTurno}
              onChange={(e) => setDuracionTurno(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contra}
              onChange={(e) => setContra(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Doctor
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">Doctores Creados</h3>
        <ul className="space-y-2">
          {doctores.length > 0 ? (
            doctores.map((doctor) => (
              <li key={doctor.idDoctor} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span>
                  <strong>{doctor.nombreyapellido}</strong>
                </span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay doctores creados aún.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
