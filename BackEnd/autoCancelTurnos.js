import { Turno } from './models/index.js';
import { Op } from 'sequelize';

// Función que cancela automáticamente los turnos con menos de 12 horas
const autoCancelTurnos = async () => {
  try {
    const [updatedCount] = await Turno.update({
      estado: 'Cancelado',
      fechaCancelacion: new Date()
    }, {
      where: {
        fechaConfirmacion: null,
        fechaCancelacion: null,
        fechaYHora: {
          [Op.lte]: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 horas desde ahora
        }
      }
    });

    console.log(`✅ Turnos cancelados automáticamente: ${updatedCount}`);
  } catch (error) {
    console.error('Error al cancelar turnos:', error);
  }
};

export const startAutoCancelTurnos = () => {
  // Ejecutar cada 30 minutos
  setInterval(autoCancelTurnos, 30 * 60 * 1000);
  console.log('✅ Cancelación automática de turnos iniciada');
};
