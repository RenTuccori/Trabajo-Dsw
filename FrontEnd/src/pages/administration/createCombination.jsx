import Select from 'react-select';
import { useAdministracion } from '../../context/administration/AdministrationProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function createCombination() {
  const navigate = useNavigate();
  const {
    venues,
    specialties,
    doctors,
    getVenues,
    getAvailableSpecialties,
    getDoctors,
    createVenueSpecialtyDoctor,
    deleteVenueSpecialtyDoctor,
    combinations, // Asume que tienes una lista de combinations en tu contexto
    getCombinations, // Asume que tienes una función para obtener combinations
  } = useAdministracion();

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    getVenues();
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

  const handleSedeChange = async (selectedOption) => {
    setSelectedVenue(selectedOption);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);

    if (selectedOption) {
      await getAvailableSpecialties({ venueId: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedSpecialty(selectedOption);
    setSelectedDoctor(null);

    if (selectedVenue && selectedOption) {
      await getDoctors();
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  const confirmarCombinacion = async () => {
    if (selectedVenue && selectedSpecialty && selectedDoctor) {
      const result = await window.confirmDialog(
        '¿Está seguro?',
        'Esta acción no se puede deshacer.'
      );

      if (result.isConfirmed) {
        try {
          await createVenueSpecialtyDoctor({
            venueId: selectedVenue.value,
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

  const handleDeleteCombinacion = async (venueId, doctorId, specialtyId) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta combinación?'
    );

    if (result.isConfirmed) {
      try {
        await deleteVenueSpecialtyDoctor({ venueId, doctorId, specialtyId });
        window.notifySuccess('¡Combinación eliminada con éxito!');
        // Refresca las combinations después de la eliminación
        getCombinations();
      } catch (error) {
        window.notifySuccess('Error al eliminar la combinación');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Formulario para crear combinations */}
        <form className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Asignar Combinación</h2>

          {/* Selección de Sede */}
          <div className="space-y-2">
            <label className="text-gray-700">Sede</label>
            <Select
              className="select"
              options={
                Array.isArray(venues)
                  ? venues.map((sede) => ({
                      value: sede.venueId,
                      label: sede.name,
                    }))
                  : []
              }
              onChange={handleSedeChange}
              value={selectedVenue}
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
                      value: especialidad.specialtyId,
                      label: especialidad.name,
                    }))
                  : []
              }
              onChange={handleEspecilidadChange}
              value={selectedSpecialty}
              isDisabled={!selectedVenue}
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
                      label: doctor.nombreyapellido,
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
              combinations.map((combinacion, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>{`Sede: ${combinacion.venueName}, Especialidad: ${combinacion.specialtyName}, Doctor: ${combinacion.doctorName} ${combinacion.doctorLastName}`}</span>
                  <div className="flex space-x-4">
                    {/* Botón de Eliminar */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>
                        handleDeleteCombinacion(
                          combinacion.venueId,
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
                          venueId: combinacion.venueId,
                          specialtyId: combinacion.specialtyId,
                          doctorId: combinacion.doctorId,
                        };
                        console.log(
                          'Datos a enviar para agregar schedules:',
                          data
                        ); // Log de los datos que se envían
                        navigate(`/admin/schedules`, { state: data });
                      }}
                    >
                      Agregar schedules
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



