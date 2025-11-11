import { pool } from './db.js'; // Asegúrate de que esté correctamente importada la conexión a tu base de datos
import { sendEmail } from './controllers/email.controllers.js'; // Importa el controlador para enviar correos

let isSendingEmails = false; // Variable para evitar ejecución simultánea

export const sendReminderEmails = async () => {
  if (isSendingEmails) {
    console.log('El envío de correos ya está en curso. Se omite esta ejecución.');
    return; // Si ya está enviando correos, no continúa.
  }

  isSendingEmails = true; // Indicar que está en proceso de envío

  try {
    const [rows] = await pool.query(`
      SELECT tur.id, usu.email
      FROM appointments tur
      INNER JOIN patients pac ON pac.id = tur.patient_id
      INNER JOIN users usu ON usu.national_id = pac.national_id
      WHERE tur.confirmation_date IS NULL 
        AND tur.cancellation_date IS NULL 
        AND TIMESTAMPDIFF(HOUR, NOW(), tur.date_time) BETWEEN 24 AND 36
        AND tur.email_sent IS NULL; -- Solo selecciona turnos donde el campo email es NULL
    `);

    if (rows.length > 0) {
      for (const { id, email } of rows) {
        const mailBody = {
          to: email,
          subject: 'Recordatorio de Confirmación de Turno',
          html: `
            <p>Estimado paciente,</p>
            <p>Le recordamos que tiene un turno pendiente de confirmación. Por favor, confirme o cancele su turno dentro de las próximas horas. De lo contrario, el turno será cancelado automáticamente.</p>
            <p>Gracias,</p>
            <p>Sanatorio UTN</p>
          `,
        };

        // Llamar a la función sendEmail para enviar el correo
        await sendEmail({ body: mailBody }, { json: () => {} });

        // Actualizar el campo `email` a 1 después de enviar el correo
        await pool.query(`
          UPDATE appointments
          SET email_sent = 1
          WHERE id = ?;
        `, [id]);
      }
      console.log(`Se han enviado recordatorios a ${rows.length} pacientes.`);
    } else {
      console.log('No hay turnos pendientes para recordar en este momento.');
    }
  } catch (error) {
    console.error('Error al enviar recordatorios de turnos:', error);
  } finally {
    isSendingEmails = false; // Indicar que ha terminado el proceso de envío
  }
};

export const startAutoReminderEmails = () => {
  console.log('Iniciando recordatorio automático de correos...');

  // Ejecutar inmediatamente al inicio
  sendReminderEmails();

  // Ejecutar cada 30 minutos
  setInterval(() => {
    sendReminderEmails();
  }, 30 * 30 * 1000);
};
