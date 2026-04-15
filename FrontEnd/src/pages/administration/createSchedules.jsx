import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateSchedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationId, specialtyId, doctorId, locationName, specialtyName, doctorFullName } = location.state || {};

  const diasSemana = [
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
    diasSemana.map((dayOption) => ({ dia: dayOption.value, hora_inicio: '', hora_fin: '' }))
  );

  const normalizeDay = (value) =>
    (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Comprobar token y cargar los schedules del doctor
  useEffect(() => {
    const cargarHorarios = async () => {
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
      cargarHorarios();
    } else {
      window.notifyError('Faltan datos para cargar schedules');
    }
  }, [locationId, specialtyId, doctorId]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      const nuevosHorarios = [];
      
      diasSemana.forEach((dayOption) => {
        const dayValue = dayOption.value;
        const horariosDelDia = doctorSchedules.filter(
          (horario) => normalizeDay(horario.dia) === normalizeDay(dayValue)
        );
        
        if (horariosDelDia.length > 0) {
          // Si el doctor tiene horarios en este día, los agregamos todos
          horariosDelDia.forEach(h => {
            nuevosHorarios.push({
              dia: dayValue,
              hora_inicio: h.hora_inicio,
              hora_fin: h.hora_fin,
            });
          });
        } else {
          // Si no tiene horarios en este día, agregamos uno vacío por defecto para que sea visible
          nuevosHorarios.push({
            dia: dayValue,
            hora_inicio: '',
            hora_fin: '',
          });
        }
      });
      
      setSchedules(nuevosHorarios);
    }
  }, [doctorSchedules]);

  const agregarFilaDia = (diaValor) => {
    const nuevosHorarios = [...schedules];
    // Encontrar el último índice donde aparece este día para insertarlo debajo
    const lastIndex = nuevosHorarios.map(s => s.dia).lastIndexOf(diaValor);
    
    // Si lo encontró, lo insertamos justo después
    if (lastIndex !== -1) {
      nuevosHorarios.splice(lastIndex + 1, 0, { dia: diaValor, hora_inicio: '', hora_fin: '' });
    } else {
      nuevosHorarios.push({ dia: diaValor, hora_inicio: '', hora_fin: '' });
    }
    setSchedules(nuevosHorarios);
  };

  const eliminarFila = (index) => {
    const diaActual = schedules[index].dia;
    // Chequeamos cuántas filas hay para este día
    const filasDeEsteDia = schedules.filter(s => s.dia === diaActual);
    
    const nuevosHorarios = [...schedules];
    
    if (filasDeEsteDia.length === 1) {
      // Si es la única fila, en vez de borrarla entera, solo le limpiamos la hora
      // así el usuario siempre ve la fila del día
      nuevosHorarios[index].hora_inicio = '';
      nuevosHorarios[index].hora_fin = '';
    } else {
      // Si hay más de una fila para ese día, la borramos sin problema
      nuevosHorarios.splice(index, 1);
    }
    setSchedules(nuevosHorarios);
  };

  const handleInputChange = (index, field, value) => {
    const nuevosHorarios = [...schedules];
    nuevosHorarios[index][field] = value; // field puede ser 'hora_inicio' o 'hora_fin'
    setSchedules(nuevosHorarios);
  };
  const agregarHorariosDisponibles = async () => {
    // Filtramos los que tienen al menos un input lleno
    const horariosConDatos = schedules.filter(
      (horario) => horario.hora_inicio || horario.hora_fin
    );

    // Verificamos que todos los que tienen datos, estén completos y correctos
    for (const horario of horariosConDatos) {
      // 1. Que ambos campos estén presentes
      if (!horario.hora_inicio || !horario.hora_fin) {
        window.notifyError(`Para el día ${horario.dia} debe completar hora de inicio y fin, o dejar ambos vacíos.`);
        return;
      }
      
      // 2. Que la hora de inicio sea menor a la hora de fin
      const inicio = new Date(`2000-01-01T${horario.hora_inicio}`);
      const fin = new Date(`2000-01-01T${horario.hora_fin}`);
      
      if (inicio >= fin) {
        // Encontramos el nombre en español para mostrar el error más lindo
        const diaNombre = diasSemana.find(d => d.value === horario.dia)?.label || horario.dia;
        window.notifyError(`En el día ${diaNombre}: la hora de inicio (${horario.hora_inicio}) debe ser menor a la hora de fin (${horario.hora_fin}).`);
        return;
      }
    }

    // 3. Verificamos que no se solapen horarios en el mismo día
    const horariosPorDia = horariosConDatos.reduce((acc, curr) => {
      if (!acc[curr.dia]) acc[curr.dia] = [];
      acc[curr.dia].push(curr);
      return acc;
    }, {});

    for (const dia in horariosPorDia) {
      const turnosDia = horariosPorDia[dia];
      if (turnosDia.length > 1) {
        for (let i = 0; i < turnosDia.length; i++) {
          for (let j = i + 1; j < turnosDia.length; j++) {
            const inicio1 = new Date(`2000-01-01T${turnosDia[i].hora_inicio}`);
            const fin1 = new Date(`2000-01-01T${turnosDia[i].hora_fin}`);
            const inicio2 = new Date(`2000-01-01T${turnosDia[j].hora_inicio}`);
            const fin2 = new Date(`2000-01-01T${turnosDia[j].hora_fin}`);

            // Condición de solapamiento: inicio1 < fin2 && fin1 > inicio2
            if (inicio1 < fin2 && fin1 > inicio2) {
              const diaNombre = diasSemana.find(d => d.value === dia)?.label || dia;
              window.notifyError(`En el día ${diaNombre} hay horarios superpuestos: ${turnosDia[i].hora_inicio}-${turnosDia[i].hora_fin} y ${turnosDia[j].hora_inicio}-${turnosDia[j].hora_fin}.`);
              return;
            }
          }
        }
      }
    }

    // Ya validados lógicamente, me quedo solo con los asignados
    const horariosValidos = horariosConDatos.filter(
      (horario) => horario.hora_inicio && horario.hora_fin
    );

    if (horariosValidos.length === 0) {
      window.notifyError('Debes ingresar al menos un horario válido completo.');
      return;
    }

    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas confirmar los schedules ingresados?'
    );

    if (result.isConfirmed) {
      try {
        
        const payloadSchedules = horariosValidos.map(h => ({
          day: h.dia,
          startTime: h.hora_inicio,
          endTime: h.hora_fin,
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
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/createCombination')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Crear horarios</h2>
        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            Sede: {locationName || locationId}, Especialidad: {specialtyName || specialtyId}, Doctor: {doctorFullName || doctorId}
          </h3>

          {/* Ingreso de nuevos schedules agrupados por día */}
          <div className="space-y-6">
            {diasSemana.map((dayOption) => {
              // Obtenemos los horarios correspondientes a este día conservando el índice original para evitar problemas
              const horariosDelDia = schedules
                .map((s, index) => ({ ...s, originalIndex: index }))
                .filter((s) => s.dia === dayOption.value);

              if (horariosDelDia.length === 0) return null;

              return (
                <div key={dayOption.value} className="bg-brand-50/30 border border-brand-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-900">{dayOption.label}</h4>
                    <button
                      onClick={() => agregarFilaDia(dayOption.value)}
                      className="text-sm px-3 py-1 bg-brand-100 text-brand-700 rounded-2xl hover:bg-brand-200 font-medium transition-colors"
                    >
                      + Agregar turno
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {horariosDelDia.map((horario) => (
                      <div key={horario.originalIndex} className="flex items-center space-x-3">
                        <input
                          type="time"
                          className="input flex-1 !py-2 text-sm"
                          value={horario.hora_inicio || ''}
                          onChange={(e) =>
                            handleInputChange(horario.originalIndex, 'hora_inicio', e.target.value)
                          }
                        />
                        <span className="text-gray-500 font-medium">a</span>
                        <input
                          type="time"
                          className="input flex-1 !py-2 text-sm"
                          value={horario.hora_fin || ''}
                          onChange={(e) =>
                            handleInputChange(horario.originalIndex, 'hora_fin', e.target.value)
                          }
                        />
                        <button
                          onClick={() => eliminarFila(horario.originalIndex)}
                          className="ml-auto w-8 h-8 rounded-full bg-coral-100 text-coral-500 hover:bg-coral-200 flex items-center justify-center font-bold flex-shrink-0"
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
            onClick={agregarHorariosDisponibles}
            className="btn-primary"
          >
            Confirmar horarios
          </button>
        </div>
      </div>
    </div>
  );
}



