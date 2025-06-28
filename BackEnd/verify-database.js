import sequelize from './db.js';

const verifyDatabase = async () => {
  try {
    console.log('🔍 Verificando base de datos del sistema médico...\n');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.\n');
    
    // Verificar conteos básicos
    console.log('📊 RESUMEN DE DATOS:');
    console.log('=' .repeat(50));
    
    const [obras] = await sequelize.query('SELECT COUNT(*) as count FROM obrasociales');
    console.log(`📋 Obras sociales: ${obras[0].count}`);
    
    const [sedes] = await sequelize.query('SELECT COUNT(*) as count FROM sedes');
    console.log(`🏥 Sedes: ${sedes[0].count}`);
    
    const [especialidades] = await sequelize.query('SELECT COUNT(*) as count FROM especialidades');
    console.log(`🩺 Especialidades: ${especialidades[0].count}`);
    
    const [fechas] = await sequelize.query('SELECT COUNT(*) as count FROM fechas');
    console.log(`📅 Fechas disponibles: ${fechas[0].count}`);
    
    const [usuarios] = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
    console.log(`👥 Usuarios: ${usuarios[0].count}`);
    
    const [doctores] = await sequelize.query('SELECT COUNT(*) as count FROM doctores');
    console.log(`👨‍⚕️ Doctores: ${doctores[0].count}`);
    
    const [pacientes] = await sequelize.query('SELECT COUNT(*) as count FROM pacientes');
    console.log(`🤒 Pacientes: ${pacientes[0].count}`);
    
    const [admin] = await sequelize.query('SELECT COUNT(*) as count FROM admin');
    console.log(`🔐 Administradores: ${admin[0].count}`);
    
    const [relaciones] = await sequelize.query('SELECT COUNT(*) as count FROM sededoctoresp');
    console.log(`🔗 Relaciones sede-doctor-especialidad: ${relaciones[0].count}`);
    
    const [horarios] = await sequelize.query('SELECT COUNT(*) as count FROM horarios_disponibles');
    console.log(`⏰ Horarios disponibles: ${horarios[0].count}`);
    
    const [turnos] = await sequelize.query('SELECT COUNT(*) as count FROM turnos');
    console.log(`📋 Turnos: ${turnos[0].count}`);
    
    const [estudios] = await sequelize.query('SELECT COUNT(*) as count FROM estudios');
    console.log(`📄 Estudios médicos: ${estudios[0].count}`);
    
    // Verificar distribución de turnos por estado
    console.log('\n📊 DISTRIBUCIÓN DE TURNOS POR ESTADO:');
    console.log('=' .repeat(50));
    const [estadosTurnos] = await sequelize.query(`
      SELECT estado, COUNT(*) as cantidad 
      FROM turnos 
      GROUP BY estado 
      ORDER BY cantidad DESC
    `);
    
    estadosTurnos.forEach(estado => {
      console.log(`   ${estado.estado}: ${estado.cantidad} turnos`);
    });
    
    // Verificar doctores por especialidad
    console.log('\n👨‍⚕️ DOCTORES POR ESPECIALIDAD:');
    console.log('=' .repeat(50));
    const [doctoresPorEsp] = await sequelize.query(`
      SELECT e.nombre as especialidad, COUNT(DISTINCT sde.idDoctor) as cantidad_doctores
      FROM especialidades e
      LEFT JOIN sededoctoresp sde ON e.idEspecialidad = sde.idEspecialidad
      GROUP BY e.idEspecialidad, e.nombre
      ORDER BY cantidad_doctores DESC
    `);
    
    doctoresPorEsp.forEach(esp => {
      console.log(`   ${esp.especialidad}: ${esp.cantidad_doctores} doctor(es)`);
    });
    
    // Verificar rango de fechas disponibles
    console.log('\n📅 RANGO DE FECHAS DISPONIBLES:');
    console.log('=' .repeat(50));
    const [rangoFechas] = await sequelize.query(`
      SELECT MIN(fechas) as fecha_inicio, MAX(fechas) as fecha_fin
      FROM fechas
    `);
    
    if (rangoFechas[0].fecha_inicio && rangoFechas[0].fecha_fin) {
      console.log(`   Desde: ${rangoFechas[0].fecha_inicio}`);
      console.log(`   Hasta: ${rangoFechas[0].fecha_fin}`);
    }
    
    // Verificar algunas consultas importantes
    console.log('\n🔍 VERIFICACIONES DE INTEGRIDAD:');
    console.log('=' .repeat(50));
    
    // Verificar que todos los doctores tengan al menos una relación sede-especialidad
    const [doctoresSinRelacion] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM doctores d
      LEFT JOIN sededoctoresp sde ON d.idDoctor = sde.idDoctor
      WHERE sde.idDoctor IS NULL
    `);
    console.log(`   Doctores sin asignación de sede/especialidad: ${doctoresSinRelacion[0].count}`);
    
    // Verificar que todos los pacientes sean usuarios válidos
    const [pacientesSinUsuario] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM pacientes p
      LEFT JOIN usuarios u ON p.dni = u.dni
      WHERE u.dni IS NULL
    `);
    console.log(`   Pacientes sin datos de usuario: ${pacientesSinUsuario[0].count}`);
    
    // Verificar turnos futuros vs pasados
    const [turnosFuturos] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM turnos
      WHERE fechaYHora > NOW()
    `);
    
    const [turnosPasados] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM turnos
      WHERE fechaYHora <= NOW()
    `);
    
    console.log(`   Turnos futuros: ${turnosFuturos[0].count}`);
    console.log(`   Turnos pasados: ${turnosPasados[0].count}`);
    
    console.log('\n🎉 ¡Base de datos verificada exitosamente!');
    console.log('\n💡 CREDENCIALES DE ACCESO:');
    console.log('=' .repeat(50));
    console.log('🔐 Administrador:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    console.log('\n👨‍⚕️ Doctores (todos con password: password123):');
    console.log('   Dr. Carlos Rodríguez (Cardiología): DNI 12345678');
    console.log('   Dra. María González (Neurología): DNI 23456789');
    console.log('   Dr. Juan López (Traumatología): DNI 34567890');
    console.log('   Dra. Ana Martínez (Pediatría): DNI 45678901');
    console.log('   Dr. Roberto Silva (Ginecología): DNI 56789012');
    console.log('   + 5 doctores más...');
    console.log('\n👤 Pacientes de ejemplo:');
    console.log('   Laura Fernández: DNI 87654321');
    console.log('   Diego Pérez: DNI 76543210');
    console.log('   Sofía Torres: DNI 65432109');
    console.log('   + 12 pacientes más...');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    console.error('💡 Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
};

verifyDatabase();
