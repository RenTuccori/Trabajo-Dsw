import Select from 'react-select';
import { usePacientes } from '../../context/patients/PatientsProvider';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export function bookAppointment() {
  const navigate = useNavigate();
  const {
    venues,
    specialties,
    doctors,
    getVenues,
    getSpecialties,
    getDoctors,
    dates,
    getDates,
    schedules,
    getSchedules,
    setDateAndTime,
    setDoctorId,
    setSpecialtyId,
    setVenueId,
    setStatus,
    setCancellationDate,
    setConfirmationDate,
  } = usePacientes();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    getVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#1e40af' : '#374151', // Ajusta los colores para que se alineen con el estilo
      color: '#ffffff', // Texto blanco
      padding: '10px', // Espaciado
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Fondo blanco del select
      borderColor: '#1e40af', // Color del borde
      borderRadius: '0.375rem', // Bordes redondeados (Tailwind: rounded-md)
      boxShadow: '0 0 0 1px rgba(29, 78, 216, 0.1)', // Sombra sutil
      padding: '5px', // Espaciado
    }),
    menu: (provided) => ({
      ...provided,
      border: '0.1rem solid #1e40af', // Borde del menú
      borderRadius: '0.375rem', // Bordes redondeados
      marginTop: '4px', // Espaciado superior
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e40af', // Color del valor seleccionado
    }),
  };

  const handleSedeChange = async (selectedOption) => {
    setSelectedVenue(selectedOption);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    if (selectedOption) {
      getSpecialties({ venueId: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedSpecialty(selectedOption);
    setSelectedDoctor(null);
    if (selectedVenue && selectedOption) {
      getDoctors({
        venueId: selectedVenue.value,
        specialtyId: selectedOption.value,
      });
    }
  };

  const handleDoctorChange = async (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setSelectedDate(null);
    if (selectedVenue && selectedOption && selectedSpecialty) {
      getDates({ selectedOption, selectedSpecialty, selectedVenue });
      console.log(dates);
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
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
        const day = (date.getDate()).toString().padStart(2, '0');
        date = `${year}-${month}-${day}`;
        setSelectedDate(date);
        setSelectedSchedule(null);
        if (selectedVenue && date && selectedSpecialty && selectedDoctor) {
            getSchedules({ selectedDoctor, selectedSpecialty, selectedVenue, date });
        }
    };*/

  const isDateAvailable = (date) => {
    // Aseguramos que la hora esté en 00:00 para evitar desfases invisibles
    date.setHours(0, 0, 0, 0);

    return dates.some((f) => {
      f.setHours(0, 0, 0, 0); // Aseguramos la misma hora en las dates de comparación
      return (
        f.getFullYear() === date.getFullYear() &&
        f.getMonth() === date.getMonth() &&
        f.getDate() === date.getDate()
      );
    });
  };
  const handleFechaChange = async (date) => {
    // Aseguramos que la hora de la fecha seleccionada esté en 00:00 para evitar desfases
    date.setHours(0, 0, 0, 0);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setFormattedDate(formattedDate);
    setSelectedDate(date); // Aquí mantenemos el objeto Date para el DatePicker
    setSelectedSchedule(null);

    if (
      selectedVenue &&
      formattedDate &&
      selectedSpecialty &&
      selectedDoctor
    ) {
      await getSchedules({
        selectedDoctor,
        selectedSpecialty,
        selectedVenue,
        date: formattedDate,
      });
    }
  };

  const handleHorarioChange = (selectedOption) => {
    setSelectedSchedule(selectedOption);
    setDateAndTime(`${formattedDate} ${selectedOption.value}`);
    console.log(`${formattedDate} ${selectedOption.value}`);
    setDoctorId(selectedDoctor.value);
    setSpecialtyId(selectedSpecialty.value);
    setVenueId(selectedVenue.value);
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
            options={(venues || []).map((sede) => ({
              value: sede.venueId,
              label: sede.name,
            }))}
            onChange={handleSedeChange}
            value={selectedVenue}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Especialidad</p>
          <Select
            className="react-select"
            options={(specialties || []).map((especialidad) => ({
              value: especialidad.specialtyId,
              label: especialidad.name,
            }))}
            onChange={handleEspecilidadChange}
            value={selectedSpecialty}
            isDisabled={!selectedVenue}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Doctores</p>
          <Select
            className="react-select"
            options={(doctors || []).map((doctor) => ({
              value: doctor.doctorId,
              label: doctor.nombreyapellido,
            }))}
            value={selectedDoctor}
            onChange={handleDoctorChange}
            isDisabled={!selectedSpecialty}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Fecha</p>
          <DatePicker
            selected={selectedDate}
            onChange={handleFechaChange}
            filterDate={isDateAvailable}
            placeholderText="Selecciona una fecha"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            disabled={!selectedDoctor} // Deshabilitar si no hay doctor seleccionado
            dateFormat="yyyy-MM-dd" // Formato consistente
          />
          <p className="text-center text-gray-600 text-lg">Horario</p>
          <Select
            className="react-select"
            options={(schedules || []).map((horario) => ({
              value: horario.hora_inicio,
              label: horario.hora_inicio,
            }))}
            onChange={handleHorarioChange}
            value={selectedSchedule}
            isDisabled={!selectedDate}
            styles={customStyles}
          />
        </div>
        <button
          type="button"
          disabled={!selectedSchedule}
          onClick={() => navigate('/patient/appointmentConfirmation')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Continuar
        </button>
        <button
          type="button"
          onClick={() => navigate('/patient')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
      </div>
    </form>
  );
}



