import { Turno, Paciente, Usuario } from './models/index.js';
import { Op } from 'sequelize';
import { sendTurnoReminder } from './controllers/email.controllers.js';

const sendReminderEmails = async () => {
  try {
    const turnos = await Turno.findAll({
      where: {
        fechaConfirmacion: null,
        fechaCancelacion: null,
        mail: null,
        fechaYHora: {
          [Op.between]: [
            new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            new Date(Date.now() + 36 * 60 * 60 * 1000)  // 36 horas
          ]
        }
      },
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }]
    });

    for (const turno of turnos) {
      if (turno.paciente?.usuario?.email) {
        await sendTurnoReminder(turno.paciente.usuario.email, turno);
        
        // Marcar como enviado
        await Turno.update(
          { mail: new Date() },
          { where: { idTurno: turno.idTurno } }
        );
      }
    }

    console.log(`✅ Recordatorios enviados: ${turnos.length}`);
  } catch (error) {
    console.error('Error al enviar recordatorios:', error);
  }
};

export const startAutoReminderEmails = () => {
  // Ejecutar cada hora
  setInterval(sendReminderEmails, 60 * 60 * 1000);
  console.log('✅ Recordatorios automáticos iniciados');
};
