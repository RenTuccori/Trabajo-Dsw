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
      SELECT usu.email
      FROM turnos tur
      INNER JOIN pacientes pac ON pac.idPaciente = tur.idPaciente
      INNER JOIN usuarios usu ON usu.dni = pac.dni
      WHERE tur.fechaConfirmacion IS NULL 
        AND tur.fechaCancelacion IS NULL 
        AND TIMESTAMPDIFF(HOUR, NOW(), tur.fechaYHora) BETWEEN 24 AND 36;
    `);

    if (rows.length > 0) {
      for (const { email } of rows) {
        const mailBody = {
          to: email,
          subject: 'Recordatorio de Confirmación de Turno',
          html: `
            <p>Estimado paciente,</p>
            <p>Le recordamos que tiene un turno pendiente de confirmación. Por favor, confirme o cancele su turno dentro de las próximas 36 horas. De lo contrario, el turno será cancelado automáticamente.</p>
            <p>Gracias,</p>
            <p>Sanatorio UTN</p>
          `,
        };

        // Llamar a la función sendEmail para enviar el correo
        await sendEmail({ body: mailBody }, { json: () => {} });
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
  }, 30 * 60 * 1000); // 30 minutos
};
