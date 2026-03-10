import { Appointment } from './models/index.js';
import { Op, literal } from 'sequelize';

// Function that automatically cancels appointments with less than 12 hours remaining
export const autoCancelAppointments = async () => {
  try {
    await Appointment.update(
      {
        status: 'Cancelled',
        cancellationDate: literal('NOW()'),
      },
      {
        where: {
          confirmationDate: null,
          cancellationDate: null,
          dateTime: {
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
  