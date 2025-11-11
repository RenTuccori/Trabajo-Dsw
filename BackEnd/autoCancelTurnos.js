import { pool } from './db.js'; // Asegúrate de importar tu conexión a la base de datos

// Función que cancela automáticamente los turnos con menos de 12 horas
export const autoCancelTurnos = async () => {
    try {
      const [result] = await pool.query(`
        UPDATE appointments tur
        SET tur.status = 'Cancelado', 
            tur.cancellation_date = NOW()
        WHERE tur.confirmation_date IS NULL 
          AND tur.cancellation_date IS NULL 
          AND TIMESTAMPDIFF(HOUR, NOW(), tur.date_time) <= 12;
      `);
      console.log(`Se han cancelado ${result.affectedRows} turnos.`);
    } catch (error) {
      console.error('Error al cancelar turnos:', error);
    }
  };
  
  export const startAutoCancelTurnos = () => {
    console.log('Iniciando cancelación automática de turnos...');
    
    // Ejecutar inmediatamente al inicio
    autoCancelTurnos();
  
    // Ejecutar cada 30 minutos
    setInterval(autoCancelTurnos, 30 * 60 * 1000); // 30 minutos
  };
  