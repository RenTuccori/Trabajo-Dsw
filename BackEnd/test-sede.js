import { Sede } from './models/index.js';

// Test direct access to sede
async function testSede() {
  try {
    console.log('🧪 Testing direct database access...');
    
    const sede = await Sede.findByPk(2);

    if (!sede) {
      console.log('❌ Sede not found in database');
      return;
    }

    console.log('✅ Sede found in database:', {
      id: sede.idSede,
      nombre: sede.nombre,
      direccion: sede.direccion,
      estado: sede.estado
    });

  } catch (error) {
    console.error('❌ Error testing sede:', error.message);
  }

  process.exit(0);
}

testSede();
