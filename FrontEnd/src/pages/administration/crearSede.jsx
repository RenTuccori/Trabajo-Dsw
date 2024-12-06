import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify
import { notifySuccess, notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';

export function CrearSede() {
  const navigate = useNavigate();
  const { sedes, crearNuevaSede, ObtenerSedes, borrarSede } =
    useAdministracion();
  const [nombreSede, setNombreSede] = useState('');
  const [direccionSede, setDireccionSede] = useState('');

  // Obtener sedes al cargar el componente
  useEffect(() => {
    ObtenerSedes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva sede
  const handleCrearSede = async (e) => {
    e.preventDefault();
    if (nombreSede.trim() !== '' && direccionSede.trim() !== '') {
      try {
        await crearNuevaSede({ nombre: nombreSede, direccion: direccionSede });
        setNombreSede(''); // Reiniciar el campo de texto
        setDireccionSede('');
        notifySuccess('¡Sede creada con éxito!'); // Mostrar mensaje de éxito
        ObtenerSedes(); // Actualizar la lista después de crear una sede
      } catch (error) {
        notifyError('Error al crear la sede'); // Mostrar mensaje de error
        console.error('Error al crear sede:', error);
      }
    }
  };

  const handleBorrarSede = async (idSede) => {
    const result = await confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta sede?'
    );

    if (result.isConfirmed) {
      try {
        await borrarSede(idSede);
        notifySuccess('¡Sede eliminada con éxito!'); // Mostrar mensaje de éxito
        ObtenerSedes(); // Actualizar la lista después de borrar una sede
      } catch (error) {
        notifyError('Error al eliminar la sede'); // Mostrar mensaje de error
        console.error('Error al borrar sede:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear Nueva Sede
        </h2>

        <form onSubmit={handleCrearSede} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la sede"
            value={nombreSede}
            onChange={(e) => setNombreSede(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Dirección de la sede"
            value={direccionSede}
            onChange={(e) => setDireccionSede(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Sede
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
          Sedes Creadas
        </h3>
        <ul className="space-y-2">
          {sedes.length > 0 ? (
            sedes.map((sede) => (
              <li
                key={sede.idSede}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{sede.nombre}</strong> - {sede.direccion}
                </span>
                <button
                  onClick={() => handleBorrarSede(sede.idSede)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay sedes creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
