import { pool } from './db.js'; // Asegúrate de importar tu conexión a la base de datos

// Función que cancela automáticamente los appointments con menos de 12 horas
export const autoCancelTurnos = async () => {
    try {
      const [result] = await pool.query(`
        UPDATE appointments tur
        SET tur.estado = 'Cancelado', 
            tur.fechaCancelacion = NOW()
        WHERE tur.fechaConfirmacion IS NULL 
          AND tur.fechaCancelacion IS NULL 
          AND TIMESTAMPDIFF(HOUR, NOW(), tur.fechaYHora) <= 12;
      `);
      console.log(`Se han cancelled ${result.affectedRows} appointments.`);
    } catch (error) {
      console.error('Error al cancelar appointments:', error);
    }
  };
  
  export const startAutoCancelTurnos = () => {
    console.log('Iniciando cancelación automática de appointments...');
    
    // Ejecutar inmediatamente al inicio
    autoCancelTurnos();
  
    // Ejecutar cada 30 minutos
    setInterval(autoCancelTurnos, 30 * 60 * 1000); // 30 minutos
  };
  