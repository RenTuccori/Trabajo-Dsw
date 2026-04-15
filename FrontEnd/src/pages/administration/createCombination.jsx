import Select from 'react-select';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateCombination() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    locations,
    specialties,
    doctors,
    getLocations,
    getAvailableSpecialties,
    getDoctors,
    createLocationSpecialtyDoctor,
    deleteLocationSpecialtyDoctor,
    combinations, 
    getCombinations, 
  } = useAdministration();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    getLocations();
    getCombinations(); // Carga las combinations al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#5368e0' : '#2a2e45',
      color: '#ffffff',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      color: '#5368e0',
      borderRadius: '5px',
      border: '2px solid #5368e0',
      padding: '5px',
    }),
    menu: (provided) => ({
      ...provided,
      border: '0.1rem solid white',
      borderRadius: '5px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2a2e45',
    }),
  };

  const handleLocationChange = async (selectedOption) => {
    setSelectedLocation(selectedOption);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);

    if (selectedOption) {
      await getAvailableSpecialties({ locationId: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedSpecialty(selectedOption);
    setSelectedDoctor(null);

    if (selectedLocation && selectedOption) {
      await getDoctors();
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  const confirmarCombinacion = async () => {
    if (selectedLocation && selectedSpecialty && selectedDoctor) {
      const result = await window.confirmDialog(
        '¿Está seguro?',
        'Esta acción no se puede deshacer.'
      );

      if (result.isConfirmed) {
        try {
          await createLocationSpecialtyDoctor({
            locationId: selectedLocation.value,
            specialtyId: selectedSpecialty.value,
            doctorId: selectedDoctor.value,
          });

          window.notifySuccess('¡Combinación creada con éxito!');
          // Refresca las combinations después de la creación
          getCombinations();
        } catch (error) {
          if (error.response && error.response.status === 400) {
            window.notifyError(error.response.data.message);
          } else {
            window.notifyError('Error al crear la combinación');
          }
        }
      }
    }
  };

  const handleDeleteCombinacion = async (locationId, doctorId, specialtyId) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta combinación?'
    );

    if (result.isConfirmed) {
      try {
        await deleteLocationSpecialtyDoctor({ locationId, doctorId, specialtyId });
        window.notifySuccess('¡Combinación eliminada con éxito!');
        // Refresca las combinations después de la eliminación
        getCombinations();
      } catch (error) {
        window.notifySuccess('Error al eliminar la combinación');
      }
    }
  };

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Asignar Combinación</h2>
        </div>
        {/* Formulario para crear combinations */}
        <form className="glass-solid rounded-2xl p-6 lg:p-8 space-y-4">

          {/* Selección de Locality */}
          <div className="space-y-2">
            <label className="label">Localidad</label>
            <Select
              className="react-select"
              options={
                Array.isArray(locations)
                  ? locations.map((location) => ({
                      value: location.id,
                      label: t(`locations.${location.name}`, { defaultValue: location.name }),
                    }))
                  : []
              }
              onChange={handleLocationChange}
              value={selectedLocation}
            />
          </div>

          {/* Selección de Especialidad */}
          <div className="space-y-2">
            <label className="label">Especialidad</label>
            <Select
              className="react-select"
              options={
                Array.isArray(specialties)
                  ? specialties.map((especialidad) => ({
                      value: especialidad.id,
                      label: t(`specialties.${especialidad.name}`, { defaultValue: especialidad.name }),
                    }))
                  : []
              }
              onChange={handleEspecilidadChange}
              value={selectedSpecialty}
              isDisabled={!selectedLocation}
            />
          </div>

          {/* Selección de Doctor */}
          <div className="space-y-2">
            <label className="label">Doctor</label>
            <Select
              className="react-select"
              options={
                Array.isArray(doctors)
                  ? doctors.map((doctor) => ({
                      value: doctor.doctorId,
                      label: doctor.fullName,
                    }))
                  : []
              }
              onChange={handleDoctorChange}
              value={selectedDoctor}
              isDisabled={!selectedSpecialty}
            />
          </div>

          {/* Botón para confirmar la asignación */}
          <button
            className="btn-primary"
            disabled={!selectedDoctor}
            onClick={confirmarCombinacion}
          >
            Confirmar
          </button>
        </form>


        {/* Lista de combinations */}
        <div className="glass-solid rounded-2xl p-6 lg:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Combinaciones Asignadas
          </h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar combinación..."
              className="input"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {combinations &&
              combinations
                .filter((combinacion) => {
                  const searchTerm = searchFilter.toLowerCase();
                  const locName = t(`locations.${combinacion.locationName}`, { defaultValue: combinacion.locationName }).toLowerCase();
                  const specName = t(`specialties.${combinacion.specialtyName}`, { defaultValue: combinacion.specialtyName }).toLowerCase();
                  const docFullName = `${combinacion.doctorName} ${combinacion.doctorLastName}`.toLowerCase();
                  
                  return locName.includes(searchTerm) || specName.includes(searchTerm) || docFullName.includes(searchTerm);
                })
                .map((combinacion) => (
                  <li
                    key={`${combinacion.locationId}-${combinacion.specialtyId}-${combinacion.doctorId}`}
                    className="glass-list-item flex justify-between items-center gap-4"
                  >
                    <span className="text-sm text-gray-700">
                      <strong>{t(`locations.${combinacion.locationName}`, { defaultValue: combinacion.locationName })}</strong> - {t(`specialties.${combinacion.specialtyName}`, { defaultValue: combinacion.specialtyName })} <br/>
                      <span className="text-gray-500">Doc: {combinacion.doctorName} {combinacion.doctorLastName}</span>
                    </span>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-500 hover:bg-coral-100 transition-colors"
                        onClick={() =>
                          handleDeleteCombinacion(
                            combinacion.locationId,
                            combinacion.doctorId,
                            combinacion.specialtyId
                          )
                        }
                      >
                        Eliminar
                      </button>
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                        onClick={() => {
                          const data = {
                            locationId: combinacion.locationId,
                            specialtyId: combinacion.specialtyId,
                            doctorId: combinacion.doctorId,
                            locationName: combinacion.locationName,
                            specialtyName: combinacion.specialtyName,
                            doctorFullName: `${combinacion.doctorName} ${combinacion.doctorLastName}`,
                          };
                          navigate('/admin/createSchedules', { state: data });
                        }}
                      >
                        Horarios
                      </button>
                    </div>
                  </li>
                ))}
            {combinations && combinations.length === 0 && (
              <li className="text-center text-gray-500 py-4">No hay combinaciones asignadas.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}



