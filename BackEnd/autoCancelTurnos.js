import { pool } from './db.js'; // Asegúrate de importar tu conexión a la base de datos

// Function that automatically cancels appointments with less than 12 hours
export const autoCancelTurnos = async () => {
  try {
    const [result] = await pool.query(`
        UPDATE appointments tur
        SET tur.status = 'Cancelado', 
            tur.cancellationDate = NOW()
        WHERE tur.confirmationDate IS NULL 
          AND tur.cancellationDate IS NULL 
          AND TIMESTAMPDIFF(HOUR, NOW(), tur.dateTime) <= 12;
      `);
  } catch (error) {
    console.error('Error cancelling appointments:', error);
  }
};

export const startAutoCancelTurnos = () => {
  // Execute immediately on startup
  autoCancelTurnos();

  // Execute every 30 minutes
  setInterval(autoCancelTurnos, 30 * 60 * 1000); // 30 minutes
};
