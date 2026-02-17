import { Turno } from './models/index.js';
import { Op, literal } from 'sequelize';

// Function that automatically cancels appointments with less than 12 hours remaining
export const autoCancelAppointments = async () => {
  try {
    await Turno.update(
      {
        estado: 'Cancelado',
        fechaCancelacion: literal('NOW()'),
      },
      {
        where: {
          fechaConfirmacion: null,
          fechaCancelacion: null,
          fechaYHora: {
            [Op.lte]: literal('DATE_ADD(NOW(), INTERVAL 12 HOUR)'),
          },
        },
      }
    );
  } catch (error) {
    // Error silenced
  }
};

export const startAutoCancelAppointments = () => {
  // Run immediately on startup
  autoCancelAppointments();

  // Run every 30 minutes
  setInterval(autoCancelAppointments, 30 * 60 * 1000); // 30 minutes
};
  