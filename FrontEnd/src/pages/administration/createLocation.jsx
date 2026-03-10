import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateLocation() {
  const navigate = useNavigate();
  const { locations, createNewLocation, getLocations, deleteLocation } =
    useAdministration();
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');

  // Obtener locations al cargar el componente
  useEffect(() => {
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva location
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    if (locationName.trim() !== '' && locationAddress.trim() !== '') {
      try {
        await createNewLocation({ name: locationName, address: locationAddress });
        setLocationName(''); // Reiniciar el campo de texto
        setLocationAddress('');
        window.notifySuccess('¡Sede creada con éxito!'); // Mostrar mensaje de éxito
        getLocations(); // Actualizar la lista después de crear una sede
      } catch (error) {
        window.notifyError('Error al crear la sede'); // Mostrar mensaje de error
        console.error('Error al crear sede:', error);
      }
    }
  };

  const handleDeleteLocation = async (locationId) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta sede?'
    );

    if (result.isConfirmed) {
      try {
        await deleteLocation(locationId);
        window.notifySuccess('¡Sede eliminada con éxito!'); // Mostrar mensaje de éxito
        getLocations(); // Actualizar la lista después de borrar una sede
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

        <form onSubmit={handleCreateLocation} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la sede"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Dirección de la sede"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
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
          {locations.length > 0 ? (
            locations.map((location) => (
              <li
                key={location.idSite}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{location.name}</strong> - {location.address}
                </span>
                <button
                  onClick={() => handleDeleteLocation(location.idSite)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay locations creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
