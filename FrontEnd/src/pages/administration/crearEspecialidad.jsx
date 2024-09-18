import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearEspecialidad() {
  const navigate = useNavigate();
  const { crearEspecialidad } = useAdministracion();
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); // Nuevo estado para mensaje de éxito

  useEffect(() => {
    // ObtenerEspecialidades();
  }, []);

  const handleCrearEspecialidad = async (e) => {
    e.preventDefault();
    if (nombreEspecialidad.trim() !== '') {
      await crearEspecialidad({ nombre: nombreEspecialidad });
      setNombreEspecialidad(''); // Reiniciar el campo de texto
      setMensajeExito('Especialidad creada con éxito'); // Establecer el mensaje de éxito
      setTimeout(() => setMensajeExito(''), 3000); // Ocultar el mensaje después de 3 segundos
      // ObtenerEspecialidades();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Crear Especialidad</h2>

        {/* Mostrar el mensaje de éxito si existe */}
        {mensajeExito && (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center">
            {mensajeExito}
          </div>
        )}

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
