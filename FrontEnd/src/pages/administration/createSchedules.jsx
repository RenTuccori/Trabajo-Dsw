import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateSchedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationId, specialtyId, doctorId, locationName, specialtyName, doctorFullName } = location.state || {};

  const weekDays = [
    { label: 'Lunes', value: 'Monday' },
    { label: 'Martes', value: 'Tuesday' },
    { label: 'Miércoles', value: 'Wednesday' },
    { label: 'Jueves', value: 'Thursday' },
    { label: 'Viernes', value: 'Friday' },
  ];
  const {
    getDoctorSchedules,
    createSchedules,
    replaceSchedules,
    doctorSchedules,
    updateSchedules,
  } = useAdministration();
  const [schedules, setSchedules] = useState(
    weekDays.map((dayOption) => ({ day: dayOption.value, startTime: '', endTime: '' }))
  );

  const normalizeDay = (value) =>
    (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Comprobar token y cargar los schedules del doctor
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        await getDoctorSchedules({ locationId, specialtyId, doctorId });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          window.notifyError(
            'No schedules found for this doctor. You can create new ones.'
          );
        } else {
          window.notifyError('Error loading schedules');
        }
      }
    };

    if (locationId && specialtyId && doctorId) {
      loadSchedules();
    } else {
      window.notifyError('Faltan datos para cargar los horarios');
    }
  }, [locationId, specialtyId, doctorId]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      const newSchedules = [];
      
      weekDays.forEach((dayOption) => {
        const dayValue = dayOption.value;
        const schedulesForDay = doctorSchedules.filter(
          (sched) => normalizeDay(sched.day) === normalizeDay(dayValue)
        );
        
        if (schedulesForDay.length > 0) {
          schedulesForDay.forEach(h => {
            newSchedules.push({
              day: dayValue,
              startTime: h.startTime,
              endTime: h.endTime,
            });
          });
        } else {
          newSchedules.push({
            day: dayValue,
            startTime: '',
            endTime: '',
          });
        }
      });
      
      setSchedules(newSchedules);
    }
  }, [doctorSchedules]);

  const addRowForDay = (dayValue) => {
    const newSchedules = [...schedules];
    const lastIndex = newSchedules.map(s => s.day).lastIndexOf(dayValue);
    
    if (lastIndex !== -1) {
      newSchedules.splice(lastIndex + 1, 0, { day: dayValue, startTime: '', endTime: '' });
    } else {
      newSchedules.push({ day: dayValue, startTime: '', endTime: '' });
    }
    setSchedules(newSchedules);
  };

  const eliminarFila = (index) => {
    const currentDay = schedules[index].day;
    const rowsForDay = schedules.filter(s => s.day === currentDay);
    
    const newSchedules = [...schedules];
    
    if (rowsForDay.length === 1) {
      newSchedules[index].startTime = '';
      newSchedules[index].endTime = '';
    } else {
      newSchedules.splice(index, 1);
    }
    setSchedules(newSchedules);
  };

  const handleInputChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value; // field can be 'startTime' or 'endTime'
    setSchedules(newSchedules);
  };
  const saveSchedules = async () => {
    const schedulesWithData = schedules.filter(
      (sched) => sched.startTime || sched.endTime
    );

    for (const sched of schedulesWithData) {
      if (!sched.startTime || !sched.endTime) {
        window.notifyError(`Para ${sched.day} debe completar tanto la hora de inicio como la de fin, o dejar ambas vacías.`);
        return;
      }
      
      const start = new Date(`2000-01-01T${sched.startTime}`);
      const end = new Date(`2000-01-01T${sched.endTime}`);
      
      if (start >= end) {
        const dayName = weekDays.find(d => d.value === sched.day)?.label || sched.day;
        window.notifyError(`On ${dayName}: start time (${sched.startTime}) must be earlier than end time (${sched.endTime}).`);
        return;
      }
    }

    const schedulesByDay = schedulesWithData.reduce((acc, curr) => {
      if (!acc[curr.day]) acc[curr.day] = [];
      acc[curr.day].push(curr);
      return acc;
    }, {});

    for (const day in schedulesByDay) {
      const daySchedules = schedulesByDay[day];
      if (daySchedules.length > 1) {
        for (let i = 0; i < daySchedules.length; i++) {
          for (let j = i + 1; j < daySchedules.length; j++) {
            const start1 = new Date(`2000-01-01T${daySchedules[i].startTime}`);
            const end1 = new Date(`2000-01-01T${daySchedules[i].endTime}`);
            const start2 = new Date(`2000-01-01T${daySchedules[j].startTime}`);
            const end2 = new Date(`2000-01-01T${daySchedules[j].endTime}`);

            if (start1 < end2 && end1 > start2) {
              const dayName = weekDays.find(d => d.value === day)?.label || day;
              window.notifyError(`On ${dayName} there are overlapping schedules: ${daySchedules[i].startTime}-${daySchedules[i].endTime} and ${daySchedules[j].startTime}-${daySchedules[j].endTime}.`);
              return;
            }
          }
        }
      }
    }

    const validSchedules = schedulesWithData.filter(
      (sched) => sched.startTime && sched.endTime
    );

    if (validSchedules.length === 0) {
      window.notifyError('Debe ingresar al menos un horario completo válido.');
      return;
    }

    const result = await window.confirmDialog(
      '¿Está seguro?',
      '¿Desea confirmar los horarios ingresados?'
    );

    if (result.isConfirmed) {
      try {
        
        const payloadSchedules = validSchedules.map(h => ({
          day: h.day,
          startTime: h.startTime,
          endTime: h.endTime,
          status: 'Available'
        }));

        await replaceSchedules({
          locationId,
          doctorId,
          specialtyId,
          schedules: payloadSchedules
        });

        window.notifySuccess('Schedules saved successfully');
        navigate('/admin/createCombination');
      } catch (error) {
        window.notifyError('Error saving schedules.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Crear horarios</h2>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium">
            Localidad: {locationName || locationId}, Especialidad: {specialtyName || specialtyId}, Médico: {doctorFullName || doctorId}
          </h3>

          {/* Schedule input grouped by day */}
          <div className="space-y-6">
            {weekDays.map((dayOption) => {
              const schedulesForDay = schedules
                .map((s, index) => ({ ...s, originalIndex: index }))
                .filter((s) => s.day === dayOption.value);

              if (schedulesForDay.length === 0) return null;

              return (
                <div key={dayOption.value} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-700">{dayOption.label}</h4>
                    <button
                      onClick={() => addRowForDay(dayOption.value)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 font-medium transition-colors"
                    >
                      + Agregar franja
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {schedulesForDay.map((sched) => (
                      <div key={sched.originalIndex} className="flex items-center space-x-3">
                        <input
                          type="time"
                          className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                          value={sched.startTime || ''}
                          onChange={(e) =>
                            handleInputChange(sched.originalIndex, 'startTime', e.target.value)
                          }
                        />
                        <span className="text-gray-500 font-medium">a</span>
                        <input
                          type="time"
                          className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                          value={sched.endTime || ''}
                          onChange={(e) =>
                            handleInputChange(sched.originalIndex, 'endTime', e.target.value)
                          }
                        />
                        <button
                          onClick={() => eliminarFila(sched.originalIndex)}
                          className="ml-auto w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center font-bold flex-shrink-0"
                          title="Clear/Remove this time range"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={saveSchedules}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar horarios
          </button>

          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/admin/createCombination')}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}



