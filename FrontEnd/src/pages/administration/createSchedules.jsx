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
      console.log('cargando schedules');
      cargarHorarios();
    } else {
      window.notifyError('Faltan datos para cargar schedules');
    }
  }, [locationId, specialtyId, doctorId]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      console.log('Horarios doctor:', doctorSchedules);
      const nuevosHorarios = diasSemana.map((dayOption) => {
        const dayValue = dayOption.value;
        const horarioExistente = doctorSchedules.find(
          (horario) => normalizeDay(horario.dia) === normalizeDay(dayValue)
        );
        console.log('Horario existente:', horarioExistente);
        return {
          dia: dayValue,
          hora_inicio: horarioExistente ? horarioExistente.hora_inicio : '',
          hora_fin: horarioExistente ? horarioExistente.hora_fin : '',
        };
      });
      setSchedules(nuevosHorarios);
      console.log('Horarios cargados:', nuevosHorarios);
    }
  }, [doctorSchedules]);

  const handleInputChange = (index, field, value) => {
    const nuevosHorarios = [...schedules];
    nuevosHorarios[index][field] = value; // field puede ser 'hora_inicio' o 'hora_fin'
    console.log('Nuevo horario:', nuevosHorarios[index]);
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
        for (const horario of horariosValidos) {
          const horarioExistente = doctorSchedules.find(
            (h) => normalizeDay(h.dia) === normalizeDay(horario.dia)
          );

          if (horarioExistente) {
            // Usar PUT si el horario ya existe
            console.log('Actualizando horario:', horario);
            await updateSchedules({
              locationId,
              doctorId,
              specialtyId,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              status: 'Available',
            });
          } else {
            // Usar POST si el horario no existe
            console.log('Creando horario:', horario);
            console.log(
              'datos:',
              horario.dia,
              horario.hora_inicio,
              horario.hora_fin
            );
            await createSchedules({
              locationId,
              doctorId,
              specialtyId,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              status: 'Available',
            });
          }
        }
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

          {/* Ingreso de nuevos schedules, con los schedules existentes ya pre-rellenados */}
          {diasSemana.map((dayOption, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1/4">
                {dayOption.label}
              </span>
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora inicio"
                value={schedules[index]?.hora_inicio || ''}
                onChange={(e) =>
                  handleInputChange(index, 'hora_inicio', e.target.value)
                } // Asegurarse de que sea 'hora_inicio'
              />
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora fin"
                value={schedules[index]?.hora_fin || ''}
                onChange={(e) =>
                  handleInputChange(index, 'hora_fin', e.target.value)
                } // Asegurarse de que sea 'hora_fin'
              />
            </div>
          ))}

          <button
            onClick={agregarHorariosDisponibles}
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



