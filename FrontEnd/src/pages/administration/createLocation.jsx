import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';
import AddressAutocomplete from '../../components/AddressAutocomplete';

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
    if (locationName.trim() === '') {
      window.notifyError('Debes ingresar un nombre para la sede.');
      return;
    }
    
    // Validación más estricta para asegurar que el texto tenga un patrón de "Calle 123"
    // Buscamos que haya letras (la calle) seguidas en alguna parte por un número (la altura)
    const hasStreetAndNumber = /[a-zA-Z]+.*\s\d+/.test(locationAddress);
    
    if (!locationAddress.trim() || !hasStreetAndNumber) {
      window.notifyError('Debes especificar obligatoriamente una calle y su numeración para continuar.');
      return;
    }

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
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva sede
        </h2>

        <form onSubmit={handleCreateLocation} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la sede"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="input"
          />
          <AddressAutocomplete
            initialValue={locationAddress}
            onChange={(value) => setLocationAddress(value)}
            onSelect={(data) => setLocationAddress(data.address)}
          />
          <button
            type="submit"
            className="btn-primary"
          >
            Crear sede
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="btn-secondary mt-4"
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
                key={location.id}
                className="list-item flex justify-between items-center"
              >
                <span>
                  <strong>{location.name}</strong> - {location.address}
                </span>
                <button
                  onClick={() => handleDeleteLocation(location.id)}
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
