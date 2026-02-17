import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function CrearCombinacion() {
  const navigate = useNavigate();
  const {
    locations,
    specialties,
    doctors,
    fetchLocations,
    fetchAllSpecialties,
    fetchDoctors,
    createNewCombination,
    removeCombination,
    combinations, // Assumes you have a combinations list in your context
    fetchCombinations, // Assumes you have a function to fetch combinations
  } = useAdministracion();

  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchLocations();
    fetchCombinations(); // Load combinations when the component mounts
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
    setSelectedSede(selectedOption);
    setSelectedEspecialidad(null);
    setSelectedDoctor(null);

    if (selectedOption) {
      await fetchAllSpecialties({ idSede: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedEspecialidad(selectedOption);
    setSelectedDoctor(null);

    if (selectedSede && selectedOption) {
      await fetchDoctors();
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  const confirmarCombinacion = async () => {
    if (selectedSede && selectedEspecialidad && selectedDoctor) {
      const result = await window.confirmDialog(
        '¿Está seguro?',
        'Esta acción no se puede deshacer.'
      );

      if (result.isConfirmed) {
        try {
          await createNewCombination({
            idSede: selectedSede.value,
            idEspecialidad: selectedEspecialidad.value,
            idDoctor: selectedDoctor.value,
          });

          window.notifySuccess('¡Combinación creada con éxito!');
          // Refresh combinations after creation
          fetchCombinations();
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

  const handleDeleteCombinacion = async (idSede, idDoctor, idEspecialidad) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta combinación?'
    );

    if (result.isConfirmed) {
      try {
        await removeCombination({ idSede, idDoctor, idEspecialidad });
        window.notifySuccess('¡Combinación eliminada con éxito!');
        // Refresh combinations after deletion
        fetchCombinations();
      } catch (error) {
        window.notifySuccess('Error al eliminar la combinación');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Form to create combinations */}
        <form className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Asignar Combinación</h2>

          {/* Location selection */}
          <div className="space-y-2">
            <label className="text-gray-700">Sede</label>
            <Select
              className="select"
              options={
                Array.isArray(locations)
                  ? locations.map((sede) => ({
                      value: sede.idSede,
                      label: sede.nombre,
                    }))
                  : []
              }
              onChange={handleSedeChange}
              value={selectedSede}
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
                  ? specialties.map((especialidad) => ({
                      value: especialidad.idEspecialidad,
                      label: especialidad.nombre,
                    }))
                  : []
              }
              onChange={handleEspecilidadChange}
              value={selectedEspecialidad}
              isDisabled={!selectedSede}
              styles={customStyles}
            />
          </div>

          {/* Doctor selection */}
          <div className="space-y-2">
            <label className="text-gray-700">Doctor</label>
            <Select
              className="select"
              options={
                Array.isArray(doctors)
                  ? doctors.map((doctor) => ({
                      value: doctor.idDoctor,
                      label: doctor.fullName,
                    }))
                  : []
              }
              onChange={handleDoctorChange}
              value={selectedDoctor}
              isDisabled={!selectedEspecialidad}
              styles={customStyles}
            />
          </div>

          {/* Button to confirm the assignment */}
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

        {/* Separator */}
        <hr className="my-4 border-gray-300" />

        {/* Combinations list */}
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
                  <span>{`Sede: ${combinacion.locationName}, Especialidad: ${combinacion.specialtyName}, Doctor: ${combinacion.doctorName} ${combinacion.doctorLastName}`}</span>
                  <div className="flex space-x-4">
                    {/* Delete button */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>
                        handleDeleteCombinacion(
                          combinacion.idSede,
                          combinacion.idDoctor,
                          combinacion.idEspecialidad
                        )
                      }
                    >
                      Eliminar
                    </button>

                    {/* Add schedules button */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        const data = {
                          idSede: combinacion.idSede,
                          idEspecialidad: combinacion.idEspecialidad,
                          idDoctor: combinacion.idDoctor,
                          nombreSede: combinacion.locationName,
                          nombreEspecialidad: combinacion.specialtyName,
                          nombreDoctor: combinacion.doctorName,
                          apellidoDoctor: combinacion.doctorLastName,
                        };
                        navigate(`/admin/horarios`, { state: data });
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
