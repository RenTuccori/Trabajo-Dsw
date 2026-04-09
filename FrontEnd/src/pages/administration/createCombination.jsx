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

  const handleSpecialtyChange = async (selectedOption) => {
    setSelectedSpecialty(selectedOption);
    setSelectedDoctor(null);

    if (selectedLocation && selectedOption) {
      await getDoctors();
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  const confirmCombination = async () => {
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

  const handleDeleteCombination = async (locationId, doctorId, specialtyId) => {
    const result = await window.confirmDialog(
      'Are you sure?',
      'Do you want to delete this combination?'
    );

    if (result.isConfirmed) {
      try {
        await deleteLocationSpecialtyDoctor({ locationId, doctorId, specialtyId });
        window.notifySuccess('¡Combinación eliminada con éxito!');
        getCombinations();
      } catch (error) {
        window.notifyError('Error al eliminar la combinación');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Formulario para crear combinations */}
        <form className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center mb-4 space-x-2">
            <h2 className="text-xl font-semibold">Asignar Combinación</h2>
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="text-blue-600 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-blue-200">
                ?
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 text-center font-normal">
                Esta sección es para asociar una localidad con un médico y su especialidad.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>

          {/* Location selection */}
          <div className="space-y-2">
            <label className="text-gray-700">Localidad</label>
            <Select
              className="select"
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
              styles={customStyles}
            />
          </div>

          {/* Specialty selection */}
          <div className="space-y-2">
            <label className="text-gray-700">Especialidad</label>
            <Select
              className="select"
              options={
                Array.isArray(specialties)
                  ? specialties.map((specialty) => ({
                      value: specialty.id,
                      label: t(`specialties.${specialty.name}`, { defaultValue: specialty.name }),
                    }))
                  : []
              }
              onChange={handleSpecialtyChange}
              value={selectedSpecialty}
              isDisabled={!selectedLocation}
              styles={customStyles}
            />
          </div>

          {/* Doctor selection */}
          <div className="space-y-2">
            <label className="text-gray-700">Médico</label>
            <Select
              className="select"
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
              styles={customStyles}
            />
          </div>

          {/* Confirm button */}
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!selectedDoctor}
            onClick={confirmCombination}
          >
            Confirmar
          </button>

          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/admin')}
          >
            Volver
          </button>
        </form>

        {/* Separador */}
        <hr className="my-4 border-gray-300" />

        {/* Combinations list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Asignar Combinación
          </h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar combinación..."
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {combinations &&
              combinations
                .filter((combination) => {
                  const searchTerm = searchFilter.toLowerCase();
                  const locName = t(`locations.${combination.locationName}`, { defaultValue: combination.locationName }).toLowerCase();
                  const specName = t(`specialties.${combination.specialtyName}`, { defaultValue: combination.specialtyName }).toLowerCase();
                  const docFullName = `${combination.doctorName} ${combination.doctorLastName}`.toLowerCase();
                  
                  return locName.includes(searchTerm) || specName.includes(searchTerm) || docFullName.includes(searchTerm);
                })
                .map((combination) => (
                  <li
                    key={`${combination.locationId}-${combination.specialtyId}-${combination.doctorId}`}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-md"
                  >
                    <span className="text-sm text-gray-700">
                      <strong>{t(`locations.${combination.locationName}`, { defaultValue: combination.locationName })}</strong> - {t(`specialties.${combination.specialtyName}`, { defaultValue: combination.specialtyName })} <br/>
                      <span className="text-gray-500">Doc: {combination.doctorName} {combination.doctorLastName}</span>
                    </span>
                    <div className="flex space-x-4">
                      {/* Delete button */}
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          handleDeleteCombination(
                            combination.locationId,
                            combination.doctorId,
                            combination.specialtyId
                          )
                        }
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Eliminar combinación">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Add/Edit schedules button */}
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          const data = {
                            locationId: combination.locationId,
                            specialtyId: combination.specialtyId,
                            doctorId: combination.doctorId,
                            locationName: combination.locationName,
                            specialtyName: combination.specialtyName,
                            doctorFullName: `${combination.doctorName} ${combination.doctorLastName}`,
                          };
                          navigate('/admin/createSchedules', { state: data });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Agregar / Editar horarios">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
            {combinations && combinations.length === 0 && (
              <li className="text-center text-gray-500 py-4">No hay combinaciones asignadas aún.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}



