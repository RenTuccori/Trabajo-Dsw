import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateSchedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationId, specialtyId, doctorId, locationName, specialtyName, doctorFullName } = location.state || {};

  const daysOfWeek = [
    { label: 'Lunes', value: 'Monday' },
    { label: 'Martes', value: 'Tuesday' },
    { label: 'Miercoles', value: 'Wednesday' },
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
    daysOfWeek.map((dayOption) => ({ day: dayOption.value, startTime: '', endTime: '' }))
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
          // Manejo específico para el error 404
          window.notifyError(
            'No se encontraron schedules para este doctor. Puedes crear nuevos schedules.'
          );
        } else {
          // Manejo para otros tipos de errores
          window.notifyError('Error al cargar los schedules');
        }
      }
    };

    if (locationId && specialtyId && doctorId) {
      console.log('cargando schedules');
      loadSchedules();
    } else {
      window.notifyError('Faltan datos para cargar schedules');
    }
  }, [locationId, specialtyId, doctorId]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      console.log('Horarios doctor:', doctorSchedules);
      const newSchedules = [];
      
      daysOfWeek.forEach((dayOption) => {
        const dayValue = dayOption.value;
        const schedulesForDay = doctorSchedules.filter(
          (schedule) => normalizeDay(schedule.day) === normalizeDay(dayValue)
        );
        
        if (schedulesForDay.length > 0) {
          // Si el doctor tiene horarios en este día, los agregamos todos
          schedulesForDay.forEach(s => {
            newSchedules.push({
              day: dayValue,
              startTime: s.startTime,
              endTime: s.endTime,
            });
          });
        } else {
          // Si no tiene horarios en este día, agregamos uno vacío por defecto para que sea visible
          newSchedules.push({
            day: dayValue,
            startTime: '',
            endTime: '',
          });
        }
      });
      
      setSchedules(newSchedules);
      console.log('Horarios cargados:', newSchedules);
    }
  }, [doctorSchedules]);

  const addRowForDay = (dayValue) => {
    const newSchedules = [...schedules];
    // Encontrar el último índice donde aparece este día para insertarlo debajo
    const lastIndex = newSchedules.map(s => s.day).lastIndexOf(dayValue);
    
    // Si lo encontró, lo insertamos justo después
    if (lastIndex !== -1) {
      newSchedules.splice(lastIndex + 1, 0, { day: dayValue, startTime: '', endTime: '' });
    } else {
      newSchedules.push({ day: dayValue, startTime: '', endTime: '' });
    }
    setSchedules(newSchedules);
  };

  const deleteRow = (index) => {
    const currentDay = schedules[index].day;
    // Chequeamos cuántas filas hay para este día
    const rowsForThisDay = schedules.filter(s => s.day === currentDay);
    
    const newSchedules = [...schedules];
    
    if (rowsForThisDay.length === 1) {
      // Si es la única fila, en vez de borrarla entera, solo le limpiamos la hora
      // así el usuario siempre ve la fila del día
      newSchedules[index].startTime = '';
      newSchedules[index].endTime = '';
    } else {
      // Si hay más de una fila para ese día, la borramos sin problema
      newSchedules.splice(index, 1);
    }
    setSchedules(newSchedules);
  };

  const handleInputChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value; // field puede ser 'startTime' o 'endTime'
    console.log('Nuevo horario:', newSchedules[index]);
    setSchedules(newSchedules);
  };
  const saveSchedules = async () => {
    // Filtramos los que tienen al menos un input lleno
    const schedulesWithData = schedules.filter(
      (schedule) => schedule.startTime || schedule.endTime
    );

    // Verificamos que todos los que tienen datos, estén completos y correctos
    for (const schedule of schedulesWithData) {
      // 1. Que ambos campos estén presentes
      if (!schedule.startTime || !schedule.endTime) {
        window.notifyError(`Para el día ${schedule.day} debe completar hora de inicio y fin, o dejar ambos vacíos.`);
        return;
      }
      
      // 2. Que la hora de inicio sea menor a la hora de fin
      const inicio = new Date(`2000-01-01T${schedule.startTime}`);
      const fin = new Date(`2000-01-01T${schedule.endTime}`);
      
      if (inicio >= fin) {
        // Encontramos el nombre en español para mostrar el error más lindo
        const dayName = daysOfWeek.find(d => d.value === schedule.day)?.label || schedule.day;
        window.notifyError(`En el día ${dayName}: la hora de inicio (${schedule.startTime}) debe ser menor a la hora de fin (${schedule.endTime}).`);
        return;
      }
    }

    // 3. Verificamos que no se solapen horarios en el mismo día
    const schedulesByDay = schedulesWithData.reduce((acc, curr) => {
      if (!acc[curr.day]) acc[curr.day] = [];
      acc[curr.day].push(curr);
      return acc;
    }, {});

    for (const day in schedulesByDay) {
      const dayShifts = schedulesByDay[day];
      if (dayShifts.length > 1) {
        for (let i = 0; i < dayShifts.length; i++) {
          for (let j = i + 1; j < dayShifts.length; j++) {
            const start1 = new Date(`2000-01-01T${dayShifts[i].startTime}`);
            const end1 = new Date(`2000-01-01T${dayShifts[i].endTime}`);
            const start2 = new Date(`2000-01-01T${dayShifts[j].startTime}`);
            const end2 = new Date(`2000-01-01T${dayShifts[j].endTime}`);

            // Condición de solapamiento: start1 < end2 && end1 > start2
            if (start1 < end2 && end1 > start2) {
              const dayName = daysOfWeek.find(d => d.value === day)?.label || day;
              window.notifyError(`En el día ${dayName} hay horarios superpuestos: ${dayShifts[i].startTime}-${dayShifts[i].endTime} y ${dayShifts[j].startTime}-${dayShifts[j].endTime}.`);
              return;
            }
          }
        }
      }
    }

    // Ya validados lógicamente, me quedo solo con los asignados
    const validSchedules = schedulesWithData.filter(
      (schedule) => schedule.startTime && schedule.endTime
    );

    if (validSchedules.length === 0) {
      window.notifyError('Debes ingresar al menos un horario válido completo.');
      return;
    }

    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas confirmar los schedules ingresados?'
    );

    if (result.isConfirmed) {
      try {
        console.log('Reemplazando todos los horarios con:', validSchedules);
        
        const payloadSchedules = validSchedules.map(schedule => ({
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          status: 'Available'
        }));

        await replaceSchedules({
          locationId,
          doctorId,
          specialtyId,
          schedules: payloadSchedules
        });

        window.notifySuccess('Horarios guardados exitosamente');
        navigate('/admin/createCombination');
      } catch (error) {
        window.notifyError('Error al guardar los schedules.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Crear horarios</h2>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium">
            Sede: {locationName || locationId}, Especialidad: {specialtyName || specialtyId}, Doctor: {doctorFullName || doctorId}
          </h3>

          {/* Ingreso de nuevos schedules agrupados por día */}
          <div className="space-y-6">
            {daysOfWeek.map((dayOption) => {
              // Obtenemos los horarios correspondientes a este día conservando el índice original para evitar problemas
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
                      + Agregar turno
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {schedulesForDay.map((schedule) => (
                      <div key={schedule.originalIndex} className="flex items-center space-x-3">
                        <input
                          type="time"
                          className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                          value={schedule.startTime || ''}
                          onChange={(e) =>
                            handleInputChange(schedule.originalIndex, 'startTime', e.target.value)
                          }
                        />
                        <span className="text-gray-500 font-medium">a</span>
                        <input
                          type="time"
                          className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                          value={schedule.endTime || ''}
                          onChange={(e) =>
                            handleInputChange(schedule.originalIndex, 'endTime', e.target.value)
                          }
                        />
                        <button
                          onClick={() => deleteRow(schedule.originalIndex)}
                          className="ml-auto w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center font-bold flex-shrink-0"
                          title="Limpiar/Eliminar este rango horario"
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



