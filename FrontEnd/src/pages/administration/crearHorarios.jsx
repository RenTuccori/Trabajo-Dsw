import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearHorarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idSede, idEspecialidad, idDoctor, nombreSede, nombreEspecialidad, nombreDoctor, apellidoDoctor } = location.state || {};

  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  const {
    fetchSchedulesByDoctor,
    createNewSchedule,
    doctorSchedules,
    updateScheduleData,
  } = useAdministracion();
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia) => ({ dia, hora_inicio: '', hora_fin: '' })) // Initialize with weekdays
  );

  // Check token and load doctor's schedules
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        await fetchSchedulesByDoctor({ idSede, idEspecialidad, idDoctor });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Specific handling for 404 error
          window.notifyError(
            'No se encontraron horarios para este doctor. Puedes crear nuevos horarios.'
          );
        } else {
          // Handling for other error types
          window.notifyError('Error al cargar los horarios');
        }
      }
    };

    if (idSede && idEspecialidad && idDoctor) {
      cargarHorarios();
    } else {
      window.notifyError('Faltan datos para cargar horarios');
    }
  }, [idSede, idEspecialidad, idDoctor]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      const nuevosHorarios = diasSemana.map((dia) => {
        const horarioExistente = doctorSchedules.find(
          (horario) => horario.dia === dia // Compare both values
        );
        return {
          dia,
          hora_inicio: horarioExistente ? horarioExistente.hora_inicio : '',
          hora_fin: horarioExistente ? horarioExistente.hora_fin : '',
        };
      });
      setHorarios(nuevosHorarios);
    }
  }, [doctorSchedules]);

  const handleInputChange = (index, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value; // field can be 'hora_inicio' or 'hora_fin'
    setHorarios(nuevosHorarios);
  };
  const agregarHorariosDisponibles = async () => {
    const horariosValidos = horarios.filter(
      (horario) => horario.hora_inicio && horario.hora_fin
    );

    if (horariosValidos.length === 0) {
      window.notifyError('Debes ingresar al menos un horario válido.');
      return;
    }

    const result = await window.confirmDialog(
      '¿Estás seguro?',
      '¿Deseas confirmar los horarios ingresados?'
    );

    if (result.isConfirmed) {
      try {
        for (const horario of horariosValidos) {
          const horarioExistente = doctorSchedules.find(
            (h) => h.dia === horario.dia
          );

          if (horarioExistente) {
            // Use PUT if the schedule already exists
            await updateScheduleData({
              idSede,
              idDoctor,
              idEspecialidad,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              estado: 'Habilitado',
            });
          } else {
            // Use POST if the schedule doesn't exist
            await createNewSchedule({
              idSede,
              idDoctor,
              idEspecialidad,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              estado: 'Habilitado',
            });
          }
        }
        window.notifySuccess('Horarios guardados exitosamente');
        navigate('/admin/combinacion');
      } catch (error) {
        window.notifyError('Error al guardar los horarios.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Crear horarios</h2>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium">
            Sede: {nombreSede || idSede}, Especialidad: {nombreEspecialidad || idEspecialidad}, Doctor: {nombreDoctor || idDoctor} {apellidoDoctor || ''}
          </h3>

          {/* New schedule input, with existing schedules pre-filled */}
          {diasSemana.map((dia, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1/4">
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </span>
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora inicio"
                value={horarios[index]?.hora_inicio || ''}
                onChange={(e) =>
                  handleInputChange(index, 'hora_inicio', e.target.value)
                } // Ensure it is 'hora_inicio'
              />
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora fin"
                value={horarios[index]?.hora_fin || ''}
                onChange={(e) =>
                  handleInputChange(index, 'hora_fin', e.target.value)
                } // Ensure it is 'hora_fin'
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
            onClick={() => navigate('/admin/combinacion')}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
