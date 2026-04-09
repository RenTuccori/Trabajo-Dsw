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

  const handleConfirmAppointment = async (appointment) => {
    const result = await window.confirmDialog(
      'Confirm Appointment',
      'Are you sure you want to confirm this appointment?'
    );

    if (result.isConfirmed) {
      try {
        // Usar idAppointment si appointmentId no existe
        const appointmentId =
          appointment.appointmentId || appointment.idAppointment;

        await confirmAppointment({ appointmentId });
        window.notifySuccess('Appointment confirmed successfully!'); 
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1 style="color: #1c4e80; text-align: center;">Your appointment has been confirmed successfully!</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Location:</strong> ${t(`locations.${appointment.location}`)}</p>
                        <p><strong>Address:</strong> ${
                          appointment.address
                        }</p>
                        <p><strong>Specialty:</strong> ${
                          t(`specialties.${appointment.specialty}`)
                        }</p>
                        <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                          appointment.dateTime
                        )}</p>
                        <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                        <p><strong>DNI Paciente:</strong> ${appointment.nationalId}</p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p>See you soon, thank you for trusting us!</p>
                        <p>Sanatorio UTN</p>
                    </footer>
                    </div>
                    `;

        // Send confirmation email
        sendEmailFunction({
          to: userEmail, // Pass the recipient
          subject: 'Appointment Confirmed',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error confirming appointment');
      }
    }
  };

  const handleCancelAppointment = async (appointment) => {
    const result = await window.confirmDialog(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?'
    );

    if (result.isConfirmed) {
      try {
        // Usar idAppointment si appointmentId no existe
        const appointmentId =
          appointment.appointmentId || appointment.idAppointment;

        await cancelAppointment({ appointmentId });
        window.notifySuccess('Appointment cancelled successfully!'); 
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">Your appointment has been cancelled successfully!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Location:</strong> ${t(`locations.${appointment.location}`)}</p>
                    <p><strong>Address:</strong> ${appointment.address}</p>
                    <p><strong>Specialty:</strong> ${
                      t(`specialties.${appointment.specialty}`)
                    }</p>
                    <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                      appointment.dateTime
                    )}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <p><strong>DNI Paciente:</strong> ${appointment.nationalId}</p>
                </div>
                <footer style="text-align: center; margin-top: 20px;">
                    <p>See you soon, thank you for trusting us!</p>
                    <p>Sanatorio UTN</p>
                </footer>
                </div>
                `;

        // Send confirmation email
        sendEmailFunction({
          to: userEmail, // Pass the recipient
          subject: 'Appointment Cancelled',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error cancelling appointment');
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
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">My Appointments</h1>
        <button
          onClick={() => navigate('/patient')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
        {loadingAppointments ? (
          <p className="text-center text-gray-600">Loading appointments...</p>
        ) : appointmentsError ? (
          <p className="text-center text-red-600">{appointmentsError}</p>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
            >
              <p>
                <strong>Location:</strong> {t(`locations.${appointment.location}`)}
              </p>
              <p>
                <strong>Address:</strong> {appointment.address}
              </p>
              <p>
                <strong>Specialty:</strong> {t(`specialties.${appointment.specialty}`)}
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
              <p>
                <strong>Estado:</strong> {t(`statuses.${appointment.status}`)}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => handleConfirmAppointment(appointment)}
                  disabled={
                    appointment.status === 'Confirmed' ||
                    appointment.status === 'Cancelled'
                  }
                >
                  Confirmar
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleCancelAppointment(appointment)}
                  disabled={
                    appointment.status === 'Cancelled' ||
                    appointment.status === 'Confirmed'
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No appointments to display</p>
        )}
      </div>
    </div>
  );
}
