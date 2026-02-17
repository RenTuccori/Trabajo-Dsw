import Select from 'react-select';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export function SacarTurno() {
  const navigate = useNavigate();
  const {
    locations,
    specialties,
    doctors,
    fetchLocations,
    fetchSpecialties,
    fetchDoctors,
    dates,
    fetchAvailableDates,
    schedules,
    fetchAvailableSchedules,
    setDateAndTime,
    setIdDoctor,
    setIdSpecialty,
    setIdLocation,
    setStatus,
    setCancellationDate,
    setConfirmationDate,
  } = usePacientes();
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [formatedFecha, setFormatedFecha] = useState(null);

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#1e40af' : '#374151', // Adjust colors to align with the style
      color: '#ffffff', // White text
      padding: '10px', // Spacing
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white', // White background for select
      borderColor: '#1e40af', // Border color
      borderRadius: '0.375rem', // Rounded borders (Tailwind: rounded-md)
      boxShadow: '0 0 0 1px rgba(29, 78, 216, 0.1)', // Subtle shadow
      padding: '5px', // Spacing
    }),
    menu: (provided) => ({
      ...provided,
      border: '0.1rem solid #1e40af', // Menu border
      borderRadius: '0.375rem', // Rounded borders
      marginTop: '4px', // Top spacing
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e40af', // Selected value color
    }),
  };

  const handleSedeChange = async (selectedOption) => {
    setSelectedSede(selectedOption);
    setSelectedEspecialidad(null);
    setSelectedDoctor(null);
    if (selectedOption) {
      fetchSpecialties({ idSede: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedEspecialidad(selectedOption);
    setSelectedDoctor(null);
    if (selectedSede && selectedOption) {
      fetchDoctors({
        idSede: selectedSede.value,
        idEspecialidad: selectedOption.value,
      });
    }
  };

  const handleDoctorChange = async (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setSelectedFecha(null);
    if (selectedSede && selectedOption && selectedEspecialidad) {
      fetchAvailableDates({ selectedOption, selectedEspecialidad, selectedSede });
    }
  };

  /* const isDateAvailable = (date) => {
        const result = dates.some(f =>
            f.getFullYear() === date.getFullYear() &&
            f.getMonth() === date.getMonth() &&
            f.getDate() === (date.getDate() - 1)
        );
        return result;
    };


    const handleFechaChange = async (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months start from 0
        const day = (date.getDate()).toString().padStart(2, '0');
        date = `${year}-${month}-${day}`;
        setSelectedFecha(date);
        setSelectedHorario(null);
        if (selectedSede && date && selectedEspecialidad && selectedDoctor) {
            fetchAvailableSchedules({ selectedDoctor, selectedEspecialidad, selectedSede, date });
        }
    };*/

  const isDateAvailable = (date) => {
    // Ensure time is set to 00:00 to avoid invisible offsets
    date.setHours(0, 0, 0, 0);

    return dates.some((f) => {
      f.setHours(0, 0, 0, 0); // Ensure same time in comparison dates
      return (
        f.getFullYear() === date.getFullYear() &&
        f.getMonth() === date.getMonth() &&
        f.getDate() === date.getDate()
      );
    });
  };
  const handleFechaChange = async (date) => {
    // Ensure selected date time is set to 00:00 to avoid offsets
    date.setHours(0, 0, 0, 0);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months start from 0
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setFormatedFecha(formattedDate);
    setSelectedFecha(date); // Keep the Date object for DatePicker
    setSelectedHorario(null);

    if (
      selectedSede &&
      formattedDate &&
      selectedEspecialidad &&
      selectedDoctor
    ) {
      await fetchAvailableSchedules({
        selectedDoctor,
        selectedEspecialidad,
        selectedSede,
        date: formattedDate,
      });
    }
  };

  const handleHorarioChange = (selectedOption) => {
    setSelectedHorario(selectedOption);
    setDateAndTime(`${formatedFecha} ${selectedOption.value}`);
    setIdDoctor(selectedDoctor.value);
    setIdSpecialty(selectedEspecialidad.value);
    setIdLocation(selectedSede.value);
    setStatus('Pendiente');
    setCancellationDate(null);
    setConfirmationDate(null);
  };

  return (
    <form className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-lg">Sede</p>
          <Select
            className="react-select"
            options={(locations || []).map((sede) => ({
              value: sede.idSede,
              label: sede.nombre,
            }))}
            onChange={handleSedeChange}
            value={selectedSede}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Especialidad</p>
          <Select
            className="react-select"
            options={(specialties || []).map((especialidad) => ({
              value: especialidad.idEspecialidad,
              label: especialidad.nombre,
            }))}
            onChange={handleEspecilidadChange}
            value={selectedEspecialidad}
            isDisabled={!selectedSede}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Doctores</p>
          <Select
            className="react-select"
            options={(doctors || []).map((doctor) => ({
              value: doctor.idDoctor,
              label: doctor.fullName,
            }))}
            value={selectedDoctor}
            onChange={handleDoctorChange}
            isDisabled={!selectedEspecialidad}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Fecha</p>
          <DatePicker
            selected={selectedFecha}
            onChange={handleFechaChange}
            filterDate={isDateAvailable}
            placeholderText="Selecciona una fecha"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            disabled={!selectedDoctor} // Disable if no doctor is selected
            dateFormat="yyyy-MM-dd" // Consistent format
          />
          <p className="text-center text-gray-600 text-lg">Horario</p>
          <Select
            className="react-select"
            options={(schedules || []).map((horario) => ({
              value: horario.hora_inicio,
              label: horario.hora_inicio,
            }))}
            onChange={handleHorarioChange}
            value={selectedHorario}
            isDisabled={!selectedFecha}
            styles={customStyles}
          />
        </div>
        <button
          type="button"
          disabled={!selectedHorario}
          onClick={() => navigate('/paciente/confirmacionturno')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Continuar
        </button>
        <button
          type="button"
          onClick={() => navigate('/paciente')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
      </div>
    </form>
  );
}
