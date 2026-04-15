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
    <form className="page-bg p-6 lg:p-10 flex items-center justify-center min-h-[80vh]">
      <div className="glass-solid p-8 lg:p-10 rounded-3xl shadow-glass animate-slide-up w-full max-w-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Sacar turno</h1>
        <p className="text-gray-500 text-sm mb-6">Completá cada paso para agendar tu consulta</p>
        <div className="space-y-4">
          <label className="label">{t('labels.location', { defaultValue: 'Localidad' })}</label>
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
            placeholder="Seleccionar..."
          />
          <label className="label">{t('labels.specialty', { defaultValue: 'Especialidad' })}</label>
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
            placeholder="Seleccionar..."
          />
          <label className="label">{t('labels.doctors', { defaultValue: 'Doctores' })}</label>
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
            placeholder="Seleccionar..."
          />
          <label className="label">{t('labels.date', { defaultValue: 'Fecha' })}</label>
          <div className="w-full">
            <DatePicker
              selected={selectedDate}
              onChange={handleFechaChange}
              filterDate={isDateAvailable}
              placeholderText="Seleccionar..."
              className="input w-full"
              disabled={!selectedDoctor}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <label className="label">{t('labels.time', { defaultValue: 'Horario' })}</label>
          <Select
            className="react-select"
            options={(schedules || []).map((horario) => ({
              value: horario.startTime,
              label: horario.startTime,
            }))}
            onChange={handleHorarioChange}
            value={selectedSchedule}
            isDisabled={!selectedDate}
            placeholder="Seleccionar..."
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/patient')}
            className="btn-secondary flex-1"
          >
            {t('labels.back', { defaultValue: 'Volver' })}
          </button>
          <button
            type="button"
            disabled={!selectedSchedule}
            onClick={() => navigate('/patient/appointmentConfirmation')}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('labels.continue', { defaultValue: 'Continuar' })}
          </button>
        </div>
      </div>
    </form>
  );
}



