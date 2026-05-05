import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/patients/PatientsProvider.jsx';
import { useTranslation } from 'react-i18next';

export function PatientAppointments() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    getPatientAppointments,
    confirmAppointment,
    cancelAppointment,
    appointments,
    sendEmailFunction,
    userEmail,
    loadingAppointments,
    appointmentsError,
    getUserByDniFunction,
  } = usePatients();

  useEffect(() => {
    getUserByDniFunction();
    getPatientAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmarTurno = async (appointment) => {
    const result = await window.confirmDialog(
      'Confirmar Turno',
      '¿Estás seguro que deseas confirmar este turno?'
    );

    if (result.isConfirmed) {
      try {
        const appointmentId = appointment.appointmentId;

        await confirmAppointment({ appointmentId });
        window.notifySuccess('¡Turno confirmado con éxito!'); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido confirmado con éxito!</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Sede:</strong> ${t(`locations.${appointment.location}`)}</p>
                        <p><strong>Dirección:</strong> ${
                          appointment.address
                        }</p>
                        <p><strong>Especialidad:</strong> ${
                          t(`specialties.${appointment.specialty}`)
                        }</p>
                        <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                          appointment.dateTime
                        )}</p>
                        <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                        <p><strong>DNI Paciente:</strong> ${appointment.nationalId}</p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                        <p>Sanatorio UTN</p>
                    </footer>
                    </div>
                    `;

        // Llamar a la función para mandar el correo
        sendEmailFunction({
          to: userEmail, // Asegúrate de pasar el destinatario como tal
          subject: 'Turno Confirmado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al confirmar el turno');
      }
    }
  };

  const handleCancelarTurno = async (appointment) => {
    const result = await window.confirmDialog(
      'Cancelar Turno',
      '¿Estás seguro que deseas cancelar este turno?'
    );

    if (result.isConfirmed) {
      try {
        const appointmentId = appointment.appointmentId;

        await cancelAppointment({ appointmentId });
        window.notifySuccess('¡Turno cancelado con éxito!'); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido cancelado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Sede:</strong> ${t(`locations.${appointment.location}`)}</p>
                    <p><strong>Dirección:</strong> ${appointment.address}</p>
                    <p><strong>Especialidad:</strong> ${
                      t(`specialties.${appointment.specialty}`)
                    }</p>
                    <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                      appointment.dateTime
                    )}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <p><strong>DNI Paciente:</strong> ${appointment.nationalId}</p>
                </div>
                <footer style="text-align: center; margin-top: 20px;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
                </div>
                `;

        // Llamar a la función para mandar el correo
        sendEmailFunction({
          to: userEmail, // Asegúrate de pasar el destinatario como tal
          subject: 'Turno Cancelado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al cancelar el turno');
      }
    }
  };

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit' };

    const fecha = date.toLocaleDateString('es-ES', opcionesFecha);
    const hora = date.toLocaleTimeString('es-ES', opcionesHora);

    return `${fecha} a las ${hora}`; // Retorna la fecha y hora en un solo string
  };

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Mis turnos</h1>
            <p className="text-gray-500 text-sm mt-1">Gestioná tus consultas médicas</p>
          </div>
          <button onClick={() => navigate('/patient')} className="btn-ghost">← Volver</button>
        </div>
        {loadingAppointments ? (
          <div className="glass-solid rounded-2xl p-8 text-center"><p className="text-gray-600">Cargando turnos...</p></div>
        ) : appointmentsError ? (
          <div className="glass-solid rounded-2xl p-8 text-center"><p className="text-red-600">{appointmentsError}</p></div>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="glass-solid rounded-2xl p-6 space-y-2 mb-4"
            >
              <p>
                <strong>Sede:</strong> {t(`locations.${appointment.location}`)}
              </p>
              <p>
                <strong>Dirección:</strong> {appointment.address}
              </p>
              <p>
                <strong>Especialidad:</strong> {t(`specialties.${appointment.specialty}`)}
              </p>
              <p>
                <strong>Fecha y Hora:</strong>{' '}
                {formatFechaHora(appointment.dateTime)}
              </p>
              <p>
                <strong>Doctor:</strong> {appointment.doctor}
              </p>
              <p>
                <strong>DNI Paciente:</strong> {appointment.nationalId}
              </p>
              <div className="flex items-center gap-2"><strong className="text-gray-600">Estado:</strong><span className={`badge ${appointment.status === 'Confirmed' ? 'badge-confirmed' : appointment.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'}`}>{t(`statuses.${appointment.status}`)}</span></div>
              <div className="flex space-x-2 mt-4">
                <button
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleConfirmarTurno(appointment)}
                  disabled={
                    appointment.status === 'Confirmed' ||
                    appointment.status === 'Cancelled'
                  }
                >
                  Confirmar
                </button>
                <button
                  className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleCancelarTurno(appointment)}
                  disabled={
                    appointment.status === 'Cancelled' ||
                    appointment.status === 'Confirmed'
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-solid rounded-2xl p-8 text-center"><p className="text-gray-600">No hay turnos para mostrar</p></div>
        )}
      </div>
    </div>
  );
}
