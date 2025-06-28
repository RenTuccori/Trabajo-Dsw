import { Doctor, Usuario, ObraSocial, Turno, Paciente, Especialidad, Sede, SedeDocEsp, HorarioDisponible } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getDoctorById = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const doctor = await Doctor.findByPk(idDoctor, {
      attributes: { exclude: ['contra'] }, // No devolver contraseña
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Refactorizar getDoctors que aún usa SQL directo:
export const getDoctors = async (req, res) => {
  try {
    const { idSede, idEspecialidad } = req.body;
    
    console.log('🔍 getDoctors llamado con:', { idSede, idEspecialidad });

    if (!idSede || !idEspecialidad) {
      console.log('❌ Faltan parámetros requeridos');
      return res.status(400).json({
        message: 'idSede e idEspecialidad son requeridos'
      });
    }

    // Primero, verificar qué datos hay en las tablas
    console.log('🔍 Verificando datos existentes...');
    
    const totalDoctores = await Doctor.count({ where: { estado: 'Habilitado' } });
    console.log('📊 Total doctores habilitados:', totalDoctores);
    
    const totalSedeDocEsp = await SedeDocEsp.count({ where: { estado: 'Habilitado' } });
    console.log('📊 Total SedeDocEsp habilitados:', totalSedeDocEsp);
    
    const sedeDocEspEspecificos = await SedeDocEsp.count({ 
      where: { 
        idSede: parseInt(idSede),
        idEspecialidad: parseInt(idEspecialidad),
        estado: 'Habilitado' 
      } 
    });
    console.log('📊 SedeDocEsp para idSede', idSede, 'e idEspecialidad', idEspecialidad, ':', sedeDocEspEspecificos);

    const doctores = await Doctor.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuario'
      }, {
        model: SedeDocEsp,
        as: 'sedeDocEsp',
        where: {
          idSede: parseInt(idSede),
          idEspecialidad: parseInt(idEspecialidad),
          estado: 'Habilitado'
        },
        include: [{
          model: Sede,
          as: 'sede'
        }, {
          model: Especialidad,
          as: 'especialidad'
        }]
      }]
    });

    console.log('🔍 Doctores encontrados:', doctores.length);

    if (doctores.length === 0) {
      console.log('ℹ️ No hay doctores para esta especialidad - devolviendo array vacío');
      return res.status(200).json([]); // Cambiar de 404 a 200 con array vacío
    }

    // Formatear respuesta como en la versión original
    const resultado = doctores.map(doctor => ({
      idDoctor: doctor.idDoctor,
      nombreyapellido: `${doctor.usuario.nombre} ${doctor.usuario.apellido}`
    }));

    console.log('✅ Resultado formateado:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en getDoctors:', error.message);
    console.error('❌ Stack trace:', error.stack);
    return res.status(500).json({ message: error.message });
  }
};

// Refactorizar getAvailableDoctors:
export const getAvailableDoctors = async (req, res) => {
  try {
    const { idSede } = req.body;

    const doctores = await Doctor.findAll({
      where: {
        estado: 'Habilitado',
        '$sedeDocEsp.idDoctor$': null // Doctores que NO están en esta sede
      },
      include: [{
        model: Usuario,
        as: 'usuario'
      }, {
        model: SedeDocEsp,
        as: 'sedeDocEsp',
        where: { idSede },
        required: false // LEFT JOIN para encontrar los que NO están
      }]
    });

    if (doctores.length === 0) {
      return res.status(404).json({
        message: 'No hay doctores disponibles para esta especialidad fuera de esta sede'
      });
    }

    // Formatear respuesta
    const resultado = doctores.map(doctor => ({
      idDoctor: doctor.idDoctor,
      nombreyapellido: `${doctor.usuario.nombre} ${doctor.usuario.apellido}`
    }));

    res.json(resultado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctores = async (req, res) => {
  try {
    console.log('🔍 Backend: getDoctores llamado');
    
    const doctores = await Doctor.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    console.log(`✅ Backend: Se encontraron ${doctores.length} doctores`);
    
    // Siempre devolvemos un estado 200, incluso si no hay doctores 
    // para evitar errores 404 en el frontend y mantener consistencia
    if (doctores.length === 0) {
      console.log('ℹ️ Backend: No hay doctores cargados, devolviendo array vacío');
      return res.status(200).json([]);
    }

    // Formateamos los datos para mostrarlos mejor en la interfaz de admin
    const formattedDoctores = doctores.map(doctor => ({
      idDoctor: doctor.idDoctor,
      duracionTurno: doctor.duracionTurno,
      nombreyapellido: doctor.usuario ? `${doctor.usuario.nombre} ${doctor.usuario.apellido}` : 'Sin nombre',
      dni: doctor.usuario?.dni,
      email: doctor.usuario?.email,
      telefono: doctor.usuario?.telefono
    }));

    console.log('✅ Backend: Datos de doctores enviados correctamente');
    res.json(formattedDoctores);
  } catch (error) {
    console.error('❌ Backend: Error en getDoctores:', error.message);
    console.error('❌ Stack trace:', error.stack);
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    const doctor = await Doctor.findOne({
      where: { dni },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }, {
        model: Turno,
        as: 'turnos',
        include: [{
          model: Paciente,
          as: 'paciente',
          include: [{
            model: Usuario,
            as: 'usuario'
          }]
        }, {
          model: Especialidad,
          as: 'especialidad'
        }, {
          model: Sede,
          as: 'sede'
        }]
      }, {
        model: HorarioDisponible,
        as: 'horarios',
        include: [{
          model: Sede,
          as: 'sede'
        }]
      }]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorLogin = async (req, res) => {
  try {
    const { dni, contra } = req.body;

    const doctor = await Doctor.findOne({
      where: { dni },
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(contra, doctor.contra);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        idDoctor: doctor.idDoctor,
        dni: doctor.usuario.dni,
        nombre: doctor.usuario.nombre,
        apellido: doctor.usuario.apellido,
        rol: 'D',
      },
      'CLAVE_SUPER_SEGURISIMA',
      { expiresIn: '1h' }
    );

    res.json(token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { dni, duracionTurno, contra } = req.body;

    console.log('🔍 Datos recibidos para crear doctor:', { dni, duracionTurno, contra: '***' });

    // Validar datos de entrada
    if (!dni || !duracionTurno || !contra) {
      return res.status(400).json({ 
        message: 'DNI, duración del turno y contraseña son requeridos' 
      });
    }

    // Convertir duracionTurno a número y validar
    const duracionNum = parseInt(duracionTurno);
    if (isNaN(duracionNum) || duracionNum < 15 || duracionNum > 180) {
      return res.status(400).json({ 
        message: 'La duración del turno debe ser un número entre 15 y 180 minutos' 
      });
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el doctor ya existe (incluyendo deshabilitados)
    const doctorExistente = await Doctor.findOne({ where: { dni } });
    
    if (doctorExistente) {
      if (doctorExistente.estado === 'Habilitado') {
        return res.status(400).json({ message: 'El doctor ya existe y está habilitado' });
      } else {
        // Si existe pero está deshabilitado, rehabilitarlo
        console.log('🔄 Rehabilitando doctor existente con DNI:', dni);
        
        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(contra, 10);
        
        await Doctor.update({
          duracionTurno: duracionNum,
          contra: hashedPassword,
          estado: 'Habilitado'
        }, {
          where: { dni }
        });

        // Retornar el doctor rehabilitado
        const doctorRehabilitado = await Doctor.findByPk(doctorExistente.idDoctor, {
          attributes: { exclude: ['contra'] },
          include: [{
            model: Usuario,
            as: 'usuario',
            include: [{
              model: ObraSocial,
              as: 'obraSocial'
            }]
          }]
        });

        console.log('✅ Doctor rehabilitado exitosamente:', doctorRehabilitado.idDoctor);
        return res.json(doctorRehabilitado);
      }
}

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contra, 10);

    console.log('✅ Creando nuevo doctor con duracionTurno:', duracionNum);

    const nuevoDoctor = await Doctor.create({
      dni: parseInt(dni),
      duracionTurno: duracionNum,
      contra: hashedPassword,
      estado: 'Habilitado'
    });

    // Retornar sin la contraseña
    const doctorCompleto = await Doctor.findByPk(nuevoDoctor.idDoctor, {
      attributes: { exclude: ['contra'] },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    console.log('✅ Doctor creado exitosamente:', doctorCompleto.idDoctor);
    res.json(doctorCompleto);
  } catch (error) {
    console.error('❌ Error al crear doctor:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error de restricción única en la base de datos'
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        message: `Error de validación: ${messages.join(', ')}`
      });
    }
    
    return res.status(500).json({ 
      message: `Error interno del servidor: ${error.message}` 
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { duracionTurno, contra, estado } = req.body;

    const updateData = { duracionTurno, estado };

    // Solo actualizar contraseña si se proporciona
    if (contra) {
      updateData.contra = await bcrypt.hash(contra, 10);
    }

    const [updatedRowsCount] = await Doctor.update(
      updateData,
      { where: { idDoctor: idDoctor } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    res.json({ message: 'Doctor actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    // Soft delete
    const [updatedRowsCount] = await Doctor.update(
      { estado: 'Deshabilitado' },
      { where: { idDoctor: idDoctor } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    res.json({ message: 'Doctor deshabilitado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Nuevas funciones específicas para doctores
export const getDoctoresByEspecialidad = async (req, res) => {
  try {
    const { idEspecialidad } = req.params;

    const doctores = await Doctor.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuario'
      }],
      // Buscar a través de la tabla intermedia SedeDocEsp
      where: {
        '$sedeDocEsp.idEspecialidad$': idEspecialidad
      },
      include: [{
        model: SedeDocEsp,
        as: 'sedeDocEsp',
        include: [{
          model: Especialidad,
          as: 'especialidad'
        }, {
          model: Sede,
          as: 'sede'
        }]
      }]
    });

    res.json(doctores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctoresBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    const doctores = await Doctor.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuario'
      }],
      where: {
        '$sedeDocEsp.idSede$': idSede
      },
      include: [{
        model: SedeDocEsp,
        as: 'sedeDocEsp',
        include: [{
          model: Especialidad,
          as: 'especialidad'
        }, {
          model: Sede,
          as: 'sede'
        }]
      }]
    });

    res.json(doctores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
