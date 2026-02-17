import { Turno, Paciente, Usuario } from './models/index.js';
import { Op, literal } from 'sequelize';
import { sendEmail } from './controllers/email.controllers.js';

let isSendingEmails = false;

export const sendReminderEmails = async () => {
  if (isSendingEmails) {
    return;
  }

  isSendingEmails = true;

  try {
    const turnos = await Turno.findAll({
      attributes: ['idTurno'],
      include: [{
        model: Paciente,
        as: 'paciente',
        attributes: [],
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['email'],
        }],
      }],
      where: {
        fechaConfirmacion: null,
        fechaCancelacion: null,
        fechaYHora: {
          [Op.between]: [
            literal('DATE_ADD(NOW(), INTERVAL 24 HOUR)'),
            literal('DATE_ADD(NOW(), INTERVAL 36 HOUR)'),
          ],
        },
        mail: null,
      },
      raw: true,
      nest: true,
    });

    for (const turno of turnos) {
      const email = turno.paciente?.usuario?.email;
      if (!email) continue;

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

      await sendEmail({ body: mailBody }, { json: () => {} });

      await Turno.update({ mail: 1 }, { where: { idTurno: turno.idTurno } });
    }
  } catch (error) {
    // Error silenciado
  } finally {
    isSendingEmails = false;
  }
};

export const startAutoReminderEmails = () => {
  sendReminderEmails();
  setInterval(() => {
    sendReminderEmails();
  }, 30 * 30 * 1000);
};
