import { Appointment, Patient, User } from './models/index.js';
import { Op, literal } from 'sequelize';
import { sendEmail } from './controllers/email.controllers.js';

let isSendingEmails = false;

export const sendReminderEmails = async () => {
  if (isSendingEmails) {
    return;
  }

  isSendingEmails = true;

  try {
    const appointments = await Appointment.findAll({
      attributes: ['id'],
      include: [{
        model: Patient,
        as: 'patient',
        attributes: [],
        include: [{
          model: User,
          as: 'user',
          attributes: ['email'],
        }],
      }],
      where: {
        confirmationDate: null,
        cancellationDate: null,
        dateTime: {
          [Op.between]: [
            literal('DATE_ADD(NOW(), INTERVAL 24 HOUR)'),
            literal('DATE_ADD(NOW(), INTERVAL 36 HOUR)'),
          ],
        },
        hasSentReminder: null,
      },
      raw: true,
      nest: true,
    });

    for (const appointment of appointments) {
      const email = appointment.patient?.user?.email;
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

      await Appointment.update({ hasSentReminder: 1 }, { where: { id: appointment.id } });
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
