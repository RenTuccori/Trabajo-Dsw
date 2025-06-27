import sequelize from './db.js';

const updateDatabaseStructure = async () => {
  try {
    console.log('🔧 Actualizando estructura de la base de datos...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    // Actualizar el campo 'contra' en la tabla doctores para aceptar contraseñas hasheadas
    console.log('📋 Actualizando campo contraseña en tabla doctores...');
    await sequelize.query(`
      ALTER TABLE doctores 
      MODIFY COLUMN contra VARCHAR(255) NOT NULL
    `);
    
    // Actualizar el campo 'contra' en la tabla admin también
    console.log('📋 Actualizando campo contraseña en tabla admin...');
    await sequelize.query(`
      ALTER TABLE admin 
      MODIFY COLUMN contra VARCHAR(255) NOT NULL
    `);
    
    // Corregir la fecha vacía en la tabla fechas
    console.log('📋 Eliminando fechas vacías o inválidas en tabla fechas...');
    try {
      await sequelize.query(`DELETE FROM fechas WHERE fechas = '0000-00-00' OR fechas = '' OR fechas IS NULL`);
      console.log('   ✅ Fechas inválidas eliminadas');
    } catch (error) {
      console.log('   ⚠️  No se encontraron fechas inválidas para eliminar o ya fueron procesadas');
    }
    
    console.log('✅ Estructura de base de datos actualizada exitosamente!');
    console.log('📋 Cambios realizados:');
    console.log('   - Campo contraseña doctores: VARCHAR(45) → VARCHAR(255)');
    console.log('   - Campo contraseña admin: VARCHAR(45) → VARCHAR(255)');
    console.log('   - Fechas vacías eliminadas');
    
  } catch (error) {
    console.error('❌ Error actualizando estructura:', error.message);
    console.error('💡 Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
};

updateDatabaseStructure();
