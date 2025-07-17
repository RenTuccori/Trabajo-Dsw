import { pool } from './db.js'; // Asegúrate de que esté correctamente importada la conexión a tu base de datos
import { sendEmail } from './controllers/email.controllers.js'; // Importa el controlador para enviar correos

let isSendingEmails = false; // Variable para evitar ejecución simultánea

export const sendReminderEmails = async () => {
  if (isSendingEmails) {
    return; // If already sending emails, do not continue.
  }

  isSendingEmails = true; // Indicate that the sending process is in progress

  try {
    const [rows] = await pool.query(`
      SELECT tur.idAppointment, usu.email
      FROM appointments tur
      INNER JOIN patients pac ON pac.idPatient = tur.idPatient
      INNER JOIN users usu ON usu.dni = pac.dni
      WHERE tur.confirmationDate IS NULL 
        AND tur.cancellationDate IS NULL 
        AND TIMESTAMPDIFF(HOUR, NOW(), tur.dateTime) BETWEEN 24 AND 36
        AND tur.email IS NULL; -- Only select appointments where the email field is NULL
    `);

    if (rows.length > 0) {
      for (const { idAppointment, email } of rows) {
        const mailBody = {
          to: email,
          subject: 'Appointment Confirmation Reminder',
          html: `
            <p>Dear patient,</p>
            <p>We remind you that you have a pending appointment confirmation. Please confirm or cancel your appointment within the next few hours. Otherwise, the appointment will be automatically cancelled.</p>
            <p>Thank you,</p>
            <p>UTN Medical Center</p>
          `,
        };

        // Call the sendEmail function to send the email
        await sendEmail({ body: mailBody }, { json: () => {} });

        // Update the `email` field to 1 after sending the email
        await pool.query(
          `
          UPDATE appointments
          SET email = 1
          WHERE idAppointment = ?;
        `,
          [idAppointment]
        );
      }
    } else {
    }
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
  } finally {
    isSendingEmails = false; // Indicate that the sending process has finished
  }
};

export const startAutoReminderEmails = () => {
  // Execute immediately on startup
  sendReminderEmails();

  // Execute every 30 minutes
  setInterval(() => {
    sendReminderEmails();
  }, 30 * 30 * 1000);
};
