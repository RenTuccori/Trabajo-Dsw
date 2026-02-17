import { Turno } from './models/index.js';
import { Op, literal } from 'sequelize';

// Función que cancela automáticamente los turnos con menos de 12 horas
export const autoCancelTurnos = async () => {
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
    // Error silenciado
  }
};

export const startAutoCancelTurnos = () => {
  // Ejecutar inmediatamente al inicio
  autoCancelTurnos();

  // Ejecutar cada 30 minutos
  setInterval(autoCancelTurnos, 30 * 60 * 1000); // 30 minutos
};
  