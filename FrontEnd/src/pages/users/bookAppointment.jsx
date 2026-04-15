import Select from 'react-select';
import { usePatients } from '../../context/patients/PatientsProvider';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export function BookAppointment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    locations,
    specialties,
    doctors,
    getLocations,
    getSpecialties,
    getDoctors,
    dates,
    getDates,
    schedules,
    getSchedules,
    setDateAndTime,
    setDoctorId,
    setSpecialtyId,
    setLocationId,
    setStatus,
    setCancellationDate,
    setConfirmationDate,
  } = usePatients();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  }, [specialties]);

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

  const handleLocationChange = async (selectedOption) => {
    setSelectedLocation(selectedOption);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    
    // Configurar el locationId cuando se selecciona la localidad
    if (selectedOption) {
      setLocationId(selectedOption.value);
    }
    
    if (selectedOption) {
      await getSpecialties({ locationId: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedSpecialty(selectedOption);
    setSelectedDoctor(null);
    
    // Configurar el specialtyId cuando se selecciona la especialidad
    if (selectedOption) {
      setSpecialtyId(selectedOption.value);
    }
    
    if (selectedLocation && selectedOption) {
      console.log('📞 FRONTEND - Obteniendo doctores para localidad y especialidad:', {
        locationId: selectedLocation.value,
        specialtyId: selectedOption.value
      });
      await getDoctors({
        locationId: selectedLocation.value,
        specialtyId: selectedOption.value,
      });
    }
  };

  const handleDoctorChange = async (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setSelectedDate(null);
    
    // Configurar el doctorId cuando se selecciona el doctor
    if (selectedOption) {
      setDoctorId(selectedOption.value);
    }
    
    if (selectedLocation && selectedOption && selectedSpecialty) {
      await getDates({ selectedOption, selectedSpecialty, selectedLocation });
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
        if (selectedLocation && date && selectedSpecialty && selectedDoctor) {
            getSchedules({ selectedDoctor, selectedSpecialty, selectedLocation, date });
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
      selectedLocation &&
      formattedDate &&
      selectedSpecialty &&
      selectedDoctor
    ) {
      await getSchedules({
        selectedDoctor,
        selectedSpecialty,
        selectedLocation,
        date: formattedDate,
      });
    }
  };

  const handleHorarioChange = (selectedOption) => {
    setSelectedSchedule(selectedOption);
    setDateAndTime(`${formattedDate} ${selectedOption.value}`);
    setDoctorId(selectedDoctor.value);
    setSpecialtyId(selectedSpecialty.value);
    setLocationId(selectedLocation.value);
    setStatus('Pending');
    setCancellationDate(null);
    setConfirmationDate(null);
  };

  return (
    <form className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-lg">{t('labels.location', { defaultValue: 'Localidad' })}</p>
          <Select
            className="react-select"
            options={(locations || []).map((location) => {
              return {
                value: location.id || location.locationId || location.idSite,
                label: t(`locations.${location.name}`, { defaultValue: location.name }),
              };
            })}
            onChange={handleLocationChange}
            value={selectedLocation}
            styles={customStyles}
            placeholder="Seleccionar..."
          />
          <p className="text-center text-gray-600 text-lg">{t('labels.specialty', { defaultValue: 'Especialidad' })}</p>
          <Select
            className="react-select"
            options={(specialties || []).map((especialidad) => {
              return {
                value: especialidad.id || especialidad.specialtyId || especialidad.idSpecialty,
                label: t(`specialties.${especialidad.name}`, { defaultValue: especialidad.name }),
              };
            })}
            onChange={handleEspecilidadChange}
            value={selectedSpecialty}
            isDisabled={!selectedLocation}
            styles={customStyles}
            placeholder="Seleccionar..."
          />
          <p className="text-center text-gray-600 text-lg">{t('labels.doctors', { defaultValue: 'Doctores' })}</p>
          <Select
            className="react-select"
            options={(doctors || []).map((doctor) => {
              return {
                value: doctor.doctorId || doctor.idDoctor,
                label: doctor.fullName || doctor.nombreyapellido,
              };
            })}
            value={selectedDoctor}
            onChange={handleDoctorChange}
            isDisabled={!selectedSpecialty}
            styles={customStyles}
            placeholder="Seleccionar..."
          />
          <p className="text-center text-gray-600 text-lg">{t('labels.date', { defaultValue: 'Fecha' })}</p>
          <div className="w-full react-datepicker-wrapper-custom">
            <DatePicker
              selected={selectedDate}
              onChange={handleFechaChange}
              filterDate={isDateAvailable}
              placeholderText="Seleccionar..."
              className="w-full border border-[#1e40af] rounded-[0.375rem] px-[8px] py-[8px] shadow-[0_0_0_1px_rgba(29,78,216,0.1)] focus:outline-none text-[#1e40af] placeholder-[#a0aabf] bg-white box-border h-[46px] leading-tight"
              disabled={!selectedDoctor} // Deshabilitar si no hay doctor seleccionado
              dateFormat="yyyy-MM-dd" // Formato consistente
            />
          </div>
          <style jsx="true">{`
            .react-datepicker-wrapper-custom .react-datepicker-wrapper {
              display: block;
              width: 100%;
            }
          `}</style>
          <p className="text-center text-gray-600 text-lg">{t('labels.time', { defaultValue: 'Horario' })}</p>
          <Select
            className="react-select"
            options={(schedules || []).map((horario) => ({
              value: horario.startTime,
              label: horario.startTime,
            }))}
            onChange={handleHorarioChange}
            value={selectedSchedule}
            isDisabled={!selectedDate}
            styles={customStyles}
            placeholder="Seleccionar..."
          />
        </div>
        <button
          type="button"
          disabled={!selectedSchedule}
          onClick={() => navigate('/patient/appointmentConfirmation')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {t('labels.continue', { defaultValue: 'Continuar' })}
        </button>
        <button
          type="button"
          onClick={() => navigate('/patient')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t('labels.back', { defaultValue: 'Volver' })}
        </button>
      </div>
    </form>
  );
}



