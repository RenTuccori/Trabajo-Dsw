import { pool } from './db.js'; // Asegúrate de importar tu conexión a la base de datos

// Función que cancela automáticamente los turnos con menos de 12 horas
export const autoCancelTurnos = async () => {
    try {
      const [result] = await pool.query(`
        UPDATE turnos tur
        SET tur.estado = 'Cancelado', 
            tur.fechaCancelacion = NOW()
        WHERE tur.fechaConfirmacion IS NULL 
          AND tur.fechaCancelacion IS NULL 
          AND TIMESTAMPDIFF(HOUR, NOW(), tur.fechaYHora) <= 12;
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
  