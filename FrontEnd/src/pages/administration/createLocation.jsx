import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';
import AddressAutocomplete from '../../components/AddressAutocomplete';

export function CreateLocation() {
  const navigate = useNavigate();
  const { locations, createNewLocation, getLocations, deleteLocation, updateLocation } =
    useAdministration();
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingAddress, setEditingAddress] = useState('');

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
        window.notifySuccess('¡Sede eliminada con éxito!');
        getLocations();
      } catch (error) {
        window.notifyError('Error al eliminar la sede');
        console.error('Error al borrar sede:', error);
      }
    }
  };

  const handleUpdateLocation = async (locationId) => {
    if (editingName.trim() === '') {
      window.notifyError('El nombre no puede estar vacío');
      return;
    }
    try {
      await updateLocation({ locationId, name: editingName, address: editingAddress });
      window.notifySuccess('¡Sede actualizada con éxito!');
      setEditingId(null);
      setEditingName('');
      setEditingAddress('');
      getLocations();
    } catch (error) {
      window.notifyError('Error al actualizar la sede');
      console.error('Error al actualizar sede:', error);
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
                className="glass-list-item flex justify-between items-center gap-4"
              >
                {editingId === location.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="input"
                      placeholder="Nombre"
                      autoFocus
                    />
                    <AddressAutocomplete
                      initialValue={editingAddress}
                      onChange={(value) => setEditingAddress(value)}
                      onSelect={(data) => setEditingAddress(data.address)}
                    />
                  </div>
                ) : (
                  <span>
                    <strong>{location.name}</strong> - {location.address}
                  </span>
                )}
                <div className="flex gap-2 flex-shrink-0">
                  {editingId === location.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateLocation(location.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditingName(''); setEditingAddress(''); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(location.id); setEditingName(location.name); setEditingAddress(location.address); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-500 hover:bg-coral-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
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
