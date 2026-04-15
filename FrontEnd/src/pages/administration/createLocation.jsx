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
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Crear nueva sede</h2>
        </div>
        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-5">

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

        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Sedes creadas
        </h3>
        <ul className="space-y-2">
          {locations.length > 0 ? (
            locations.map((location) => (
              <li
                key={location.id}
                className="list-item flex justify-between items-center gap-4"
              >
                <span>
                  <strong>{location.name}</strong> - {location.address}
                </span>
                <button
                  onClick={() => handleDeleteLocation(location.id)}
                  className="text-coral-500 hover:text-coral-600 font-medium text-sm flex-shrink-0"
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
    </div>
  );
}
