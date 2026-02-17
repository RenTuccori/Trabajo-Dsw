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
    const appointments = await Turno.findAll({
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

    for (const appointment of appointments) {
      const email = appointment.paciente?.usuario?.email;
      if (!email) continue;

      const mailBody = {
        to: email,
        subject: 'Appointment Confirmation Reminder',
        html: `
          <p>Dear patient,</p>
          <p>We remind you that you have an appointment pending confirmation. Please confirm or cancel your appointment within the next few hours. Otherwise, the appointment will be automatically cancelled.</p>
          <p>Thank you,</p>
          <p>Sanatorio UTN</p>
        `,
      };

      await sendEmail({ body: mailBody }, { json: () => {} });

      await Turno.update({ mail: 1 }, { where: { idTurno: appointment.idTurno } });
    }
  } catch (error) {
    // Error silenced
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
