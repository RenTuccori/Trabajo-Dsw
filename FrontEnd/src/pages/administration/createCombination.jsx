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
                Esta sección es para asociar una sede con un doctor y su respectiva especialidad.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>

          {/* Selección de Locality */}
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

          {/* Selección de Especialidad */}
          <div className="space-y-2">
            <label className="text-gray-700">Especialidad</label>
            <Select
              className="select"
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
              styles={customStyles}
            />
          </div>

          {/* Selección de Doctor */}
          <div className="space-y-2">
            <label className="text-gray-700">Doctor</label>
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

          {/* Botón para confirmar la asignación */}
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!selectedDoctor}
            onClick={confirmarCombinacion}
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

        {/* Lista de combinations */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Combinaciones Asignadas
          </h2>
          <ul className="space-y-2 bg-white rounded-lg shadow-md p-4">
            {combinations &&
              combinations.map((combinacion) => (
                <li
                  key={`${combinacion.locationId}-${combinacion.specialtyId}-${combinacion.doctorId}`}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>{`Localidad: ${t(`locations.${combinacion.locationName}`, { defaultValue: combinacion.locationName })}, Especialidad: ${t(`specialties.${combinacion.specialtyName}`, { defaultValue: combinacion.specialtyName })}, Doctor: ${combinacion.doctorName} ${combinacion.doctorLastName}`}</span>
                  <div className="flex space-x-4">
                    {/* Botón de Eliminar */}
                    <button
                      className="text-red-600 hover:text-red-800"
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

                    {/* Botón de Agregar Horarios */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        const data = {
                          locationId: combinacion.locationId,
                          specialtyId: combinacion.specialtyId,
                          doctorId: combinacion.doctorId,
                          locationName: combinacion.locationName,
                          specialtyName: combinacion.specialtyName,
                          doctorFullName: `${combinacion.doctorName} ${combinacion.doctorLastName}`,
                        };
                        console.log(
                          'Datos a enviar para agregar schedules:',
                          data
                        ); // Log de los datos que se envían
                        navigate('/admin/createSchedules', { state: data });
                      }}
                    >
                      Agregar horarios
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}



