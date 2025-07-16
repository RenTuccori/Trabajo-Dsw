import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administration/AdministrationProvider.jsx';

export function CreateVenue() {
  const navigate = useNavigate();
  const { venues, createNewVenue, getVenues, deleteVenue } =
    useAdministracion();
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');

  // Obtener venues al cargar el componente
  useEffect(() => {
    getVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva sede
  const handlecreateVenue = async (e) => {
    e.preventDefault();
    if (venueName.trim() !== '' && venueAddress.trim() !== '') {
      try {
        await createNewVenue({ name: venueName, address: venueAddress });
        setVenueName(''); // Reiniciar el campo de texto
        setVenueAddress('');
        window.notifySuccess('¡Sede creada con éxito!'); // Mostrar mensaje de éxito
        getVenues(); // Actualizar la lista después de crear una sede
      } catch (error) {
        window.notifyError('Error al crear la sede'); // Mostrar mensaje de error
        console.error('Error al crear sede:', error);
      }
    }
  };

  const handleBorrarSede = async (venueId) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta sede?'
    );

    if (result.isConfirmed) {
      try {
        await deleteVenue(venueId);
        window.notifySuccess('¡Sede eliminada con éxito!'); // Mostrar mensaje de éxito
        getVenues(); // Actualizar la lista después de borrar una sede
      } catch (error) {
        window.notifyError('Error al eliminar la sede'); // Mostrar mensaje de error
        console.error('Error al borrar sede:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva sede
        </h2>

        <form onSubmit={handlecreateVenue} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la sede"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Dirección de la sede"
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear sede
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
          Sedes creadas
        </h3>
        <ul className="space-y-2">
          {venues.length > 0 ? (
            venues.map((sede) => (
              <li
                key={sede.idSite}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{sede.name}</strong> - {sede.address}
                </span>
                <button
                  onClick={() => handleBorrarSede(sede.idSite)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay venues creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
