import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { toast } from 'react-toastify'; // Importa toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify

export function CrearEspecialidad() {
  const navigate = useNavigate();
  const { crearEspecialidad } = useAdministracion();
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');

  useEffect(() => {
    // ObtenerEspecialidades();
  }, []);

  const handleCrearEspecialidad = async (e) => {
    e.preventDefault();
    if (nombreEspecialidad.trim() !== '') {
      try {
        await crearEspecialidad({ nombre: nombreEspecialidad });
        setNombreEspecialidad(''); // Reiniciar el campo de texto
        toast.success('Especialidad creada con éxito'); // Mostrar el mensaje de éxito
        // ObtenerEspecialidades();
      } catch (error) {
        toast.error('Error al crear la especialidad'); // Mostrar mensaje de error
        console.error('Error al crear especialidad:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Crear Especialidad</h2>

        <form onSubmit={handleCrearEspecialidad} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-gray-700">Nombre de la Especialidad:</label>
            <input
              type="text"
              id="nombre"
              value={nombreEspecialidad}
              onChange={(e) => setNombreEspecialidad(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}
