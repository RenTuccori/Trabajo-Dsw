import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearEspecialidad() {
  const navigate = useNavigate();
  const {
    especialidades,
    crearEspecialidad,
    ObtenerEspecialidadesDisponibles,
    borrarEspecialidad,
  } = useAdministracion();
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');

  // Obtener especialidades al cargar el componente
  useEffect(() => {
    ObtenerEspecialidadesDisponibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva especialidad
  const handleCrearEspecialidad = async (e) => {
    e.preventDefault();
    if (nombreEspecialidad.trim() !== '') {
      try {
        await crearEspecialidad({ nombre: nombreEspecialidad });
        setNombreEspecialidad(''); // Reiniciar el campo de texto
        window.notifySuccess('¡Especialidad creada con éxito!');
        ObtenerEspecialidadesDisponibles(); // Actualizar la lista después de crear una especialidad
      } catch (error) {
        window.notifyError('Error al crear la especialidad');
        console.error('Error al crear especialidad:', error);
      }
    }
  };

  const handleBorrarEspecialidad = async (idEspecialidad) => {
    const result = await window.confirmDialog(
      '¿Está seguro?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await borrarEspecialidad(idEspecialidad);
        window.notifySuccess('¡Especialidad eliminada con éxito!');
        ObtenerEspecialidadesDisponibles(); // Actualizar la lista después de borrar una especialidad
      } catch (error) {
        window.notifyError('Error al eliminar la especialidad');
        console.error('Error al borrar especialidad:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva especialidad
        </h2>

        <form onSubmit={handleCrearEspecialidad} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la especialidad"
            value={nombreEspecialidad}
            onChange={(e) => setNombreEspecialidad(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear especialidad
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Especialidades creadas
        </h3>
        <ul className="space-y-2">
          {especialidades.length > 0 ? (
            especialidades.map((especialidad) => (
              <li
                key={especialidad.idEspecialidad}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{especialidad.nombre}</strong>
                </span>
                <button
                  onClick={() =>
                    handleBorrarEspecialidad(especialidad.idEspecialidad)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay especialidades creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
