import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administration/AdministrationProvider.jsx';

export function CreateSchedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { venueId, specialtyId, doctorId } = location.state || {};

  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  const {
    getDoctorSchedules,
    createSchedules,
    doctorSchedules,
    updateSchedules,
  } = useAdministracion();
  const [schedules, setSchedules] = useState(
    diasSemana.map((dia) => ({ dia, hora_inicio: '', hora_fin: '' })) // Inicializar con días de la semana
  );

  // Comprobar token y cargar los schedules del doctor
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        await getDoctorSchedules({ venueId, specialtyId, doctorId });
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

    if (venueId && specialtyId && doctorId) {
      console.log('cargando schedules');
      cargarHorarios();
    } else {
      window.notifyError('Faltan datos para cargar schedules');
    }
  }, [venueId, specialtyId, doctorId]);

  useEffect(() => {
    if (doctorSchedules && doctorSchedules.length > 0) {
      console.log('Horarios doctor:', doctorSchedules);
      const nuevosHorarios = diasSemana.map((dia) => {
        const horarioExistente = doctorSchedules.find(
          (horario) => horario.dia === dia // Convertir ambos a minúsculas
        );
        console.log('Horario existente:', horarioExistente);
        return {
          dia,
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
    const horariosValidos = schedules.filter(
      (horario) => horario.hora_inicio && horario.hora_fin
    );

    if (horariosValidos.length === 0) {
      window.notifyError('Debes ingresar al menos un horario válido.');
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
            (h) => h.dia === horario.dia
          );

          if (horarioExistente) {
            // Usar PUT si el horario ya existe
            console.log('Actualizando horario:', horario);
            await updateSchedules({
              venueId,
              doctorId,
              specialtyId,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              status: 'Habilitado',
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
              venueId,
              doctorId,
              specialtyId,
              dia: horario.dia,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              status: 'Habilitado',
            });
          }
        }
        window.notifySuccess('Horarios guardados exitosamente');
        navigate('/admin/combinacion');
      } catch (error) {
        window.notifyError('Error al guardar los schedules.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Crear schedules</h2>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium">
            Sede: {venueId}, Especialidad: {specialtyId}, Doctor: {doctorId}
          </h3>

          {/* Ingreso de nuevos schedules, con los schedules existentes ya pre-rellenados */}
          {diasSemana.map((dia, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1/4">
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
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
            Confirmar schedules
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



