import sequelize from './db.js';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  try {
    console.log('🔧 Creando usuario administrador...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    // Hash de la contraseña del admin
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    
    // Verificar si ya existe un admin con este usuario
    const [existingAdmin] = await sequelize.query('SELECT usuario FROM admin WHERE usuario = ?', {
      replacements: ['admin']
    });
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  El administrador "admin" ya existe.');
      console.log('🔄 Actualizando contraseña...');
      
      await sequelize.query(`
        UPDATE admin 
        SET contra = ?
        WHERE usuario = 'admin'
      `, {
        replacements: [adminPasswordHash]
      });
      console.log('✅ Contraseña de administrador actualizada.');
    } else {
      // Crear el administrador
      await sequelize.query(`
        INSERT INTO admin (usuario, contra)
        VALUES (?, ?)
      `, {
        replacements: ['admin', adminPasswordHash]
      });
      console.log('✅ Usuario administrador creado exitosamente.');
    }
    
    console.log('\n🎉 ¡Administrador configurado!');
    console.log('💡 Credenciales de administrador:');
    console.log('   📧 Usuario: admin');
    console.log('   🔐 Contraseña: admin123');
    console.log('   🏥 Rol: Administrador del sistema');
    console.log('');
    console.log('🔧 El administrador puede:');
    console.log('   - Gestionar doctores y pacientes');
    console.log('   - Administrar sedes y especialidades');
    console.log('   - Supervisar obras sociales');
    console.log('   - Acceder a reportes del sistema');
    
  } catch (error) {
    console.error('❌ Error creando administrador:', error.message);
    console.error('💡 Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
