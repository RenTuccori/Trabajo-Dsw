import jwt from "jsonwebtoken";
import { 
  Admin, 
  Usuario, 
  ObraSocial, 
  SedeDocEsp, 
  HorarioDisponible, 
  Sede, 
  Especialidad, 
  Doctor 
} from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export const getAdmin = async (req, res) => {
  try {
    const { usuario, contra } = req.body;
    
    // Buscar admin por usuario
    const admin = await Admin.findOne({
      where: { usuario: usuario }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(contra, admin.contra);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        idAdmin: admin.idAdmin, 
        usuario: admin.usuario,
        rol: "A" 
      }, 
      "CLAVE_SUPER_SEGURISIMA", 
      { expiresIn: "30m" }
    );
    
    res.json(token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSeEspDoc = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;

    // Verificar si la combinación ya existe
    const existente = await SedeDocEsp.findOne({
      where: { idSede, idEspecialidad, idDoctor }
    });

    if (existente) {
      if (existente.estado === 'Habilitado') {
        return res.status(200).json({ message: 'La combinación ya está habilitada.' });
      } else {
        // Rehabilitar
        await SedeDocEsp.update(
          { estado: 'Habilitado' },
          { where: { idSede, idEspecialidad, idDoctor } }
        );
        return res.status(200).json({ message: 'La combinación se habilitó exitosamente.' });
      }
    }

    // Crear nueva combinación
    const nuevaCombinacion = await SedeDocEsp.create({
      idSede,
      idEspecialidad,
      idDoctor,
      estado: 'Habilitado'
    });

    res.status(201).json({
      message: 'Asignación creada con éxito.',
      combinacion: nuevaCombinacion
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteSeEspDoc = async (req, res) => {
  try {
    const { idSede, idDoctor, idEspecialidad } = req.body;

    const [updatedRowsCount] = await SedeDocEsp.update(
      { estado: 'Deshabilitado' },
      { where: { idSede, idDoctor, idEspecialidad } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada.' });
    }

    res.json({ message: 'Asignación deshabilitada con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCombinaciones = async (req, res) => {
  try {
    console.log('🔍 Obteniendo combinaciones...');
    
    const combinaciones = await SedeDocEsp.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Sede,
        as: 'sede'
      }, {
        model: Especialidad,
        as: 'especialidad'
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      order: [
        [{ model: Sede, as: 'sede' }, 'nombre'],
        [{ model: Especialidad, as: 'especialidad' }, 'nombre'],
        [{ model: Doctor, as: 'doctor' }, { model: Usuario, as: 'usuario' }, 'apellido']
      ]
    });

    console.log('✅ Combinaciones encontradas:', combinaciones.length);

    if (combinaciones.length === 0) {
      return res.status(200).json([]); // Devolver array vacío en lugar de 404
    }

    // Formatear los datos para el frontend
    const combinacionesFormateadas = combinaciones.map(comb => ({
      idSede: comb.idSede,
      idEspecialidad: comb.idEspecialidad,
      idDoctor: comb.idDoctor,
      nombreSede: comb.sede?.nombre || 'N/A',
      nombreEspecialidad: comb.especialidad?.nombre || 'N/A',
      nombreDoctor: comb.doctor?.usuario?.nombre || 'N/A',
      apellidoDoctor: comb.doctor?.usuario?.apellido || 'N/A',
      estado: comb.estado
    }));

    console.log('✅ Combinaciones formateadas:', combinacionesFormateadas);
    res.json(combinacionesFormateadas);
  } catch (error) {
    console.error('❌ Error al obtener combinaciones:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createHorarios = async (req, res) => {
  try {
    console.log('🔍 createHorarios called with:', req.body);
    const { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado } = req.body;

    if (!idSede || !idDoctor || !idEspecialidad || !dia || !hora_inicio || !hora_fin) {
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos' 
      });
    }

    // Normalizar formato de horas (eliminar segundos si los tiene)
    const normalizeTime = (time) => {
      if (!time) return time;
      // Si es string en formato HH:MM:SS, convertir a HH:MM
      if (typeof time === 'string' && time.includes(':')) {
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`;
      }
      return time;
    };

    const hora_inicio_norm = normalizeTime(hora_inicio);
    const hora_fin_norm = normalizeTime(hora_fin);

    // Verificar superposición de horarios usando los nombres correctos de las columnas
    const horarioExistente = await HorarioDisponible.findOne({
      where: {
        idDoctor,
        idSede,
        idEspecialidad,
        dia: dia,
        [Op.or]: [
          {
            hora_inicio: {
              [Op.between]: [hora_inicio_norm, hora_fin_norm]
            }
          },
          {
            hora_fin: {
              [Op.between]: [hora_inicio_norm, hora_fin_norm]
            }
          }
        ]
      }
    });

    if (horarioExistente) {
      return res.status(400).json({ 
        message: 'Ya existe un horario que se superpone en ese período' 
      });
    }

    const nuevoHorario = await HorarioDisponible.create({
      idSede,
      idDoctor,
      idEspecialidad,
      dia: dia,
      hora_inicio: hora_inicio_norm,
      hora_fin: hora_fin_norm,
      estado: estado || 'Habilitado'
    });

    console.log('✅ Horario creado exitosamente:', nuevoHorario);
    res.status(201).json({ 
      message: 'Horario creado exitosamente.',
      horario: nuevoHorario
    });
  } catch (error) {
    console.error('❌ Error al crear horario:', error);
    return res.status(500).json({ message: 'Error al crear el horario.', error: error.message });
  }
};

export const updateHorarios = async (req, res) => {
  try {
    console.log('🔍 updateHorarios called with:', req.body);
    const { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado, 
            hora_inicio_original, hora_fin_original } = req.body;

    // Normalizar formato de horas (eliminar segundos si los tiene)
    const normalizeTime = (time) => {
      if (!time) return time;
      // Si es string en formato HH:MM:SS, convertir a HH:MM
      if (typeof time === 'string' && time.includes(':')) {
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`;
      }
      return time;
    };

    const hora_inicio_norm = normalizeTime(hora_inicio);
    const hora_fin_norm = normalizeTime(hora_fin);
    const hora_inicio_original_norm = normalizeTime(hora_inicio_original);
    const hora_fin_original_norm = normalizeTime(hora_fin_original);

    // Si se proporcionan las horas originales, buscar por esas
    // Si no, buscar por las horas actuales (para casos donde solo se actualiza el estado)
    const whereClause = {
      idSede,
      idDoctor,
      idEspecialidad,
      dia,
      hora_inicio: hora_inicio_original_norm || hora_inicio_norm,
      hora_fin: hora_fin_original_norm || hora_fin_norm
    };

    console.log('🔍 Buscando horario con:', whereClause);
    console.log('🔍 Tipos de datos:', {
      hora_inicio_type: typeof whereClause.hora_inicio,
      hora_fin_type: typeof whereClause.hora_fin,
      hora_inicio_original_type: typeof hora_inicio_original,
      hora_fin_original_type: typeof hora_fin_original
    });

    // Verificar si el horario existe
    const horarioExistente = await HorarioDisponible.findOne({
      where: whereClause
    });

    if (!horarioExistente) {
      console.log('❌ No se encontró horario existente');
      console.log('🔍 Intentando buscar con cualquier horario para este doctor/sede/especialidad/dia...');
      
      // Buscar todos los horarios para este doctor/sede/especialidad/día para debug
      const horariosDebug = await HorarioDisponible.findAll({
        where: {
          idSede,
          idDoctor,
          idEspecialidad,
          dia
        }
      });
      
      console.log('🔍 Horarios encontrados para debug:', horariosDebug.map(h => ({
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        estado: h.estado
      })));
      
      return res.status(404).json({ message: 'No se encontró un horario con esos datos' });
    }

    console.log('✅ Horario encontrado, verificando si necesita recreación...');

    // Si las horas cambiaron, necesitamos eliminar el viejo y crear uno nuevo
    // porque hora_inicio y hora_fin son parte de la clave primaria
    if ((hora_inicio_original_norm && hora_inicio_original_norm !== hora_inicio_norm) || 
        (hora_fin_original_norm && hora_fin_original_norm !== hora_fin_norm)) {
      
      console.log('🔄 Las horas cambiaron, recreando horario...');
      
      // Eliminar el horario existente
      await HorarioDisponible.destroy({
        where: whereClause
      });

      // Crear el nuevo horario
      const nuevoHorario = await HorarioDisponible.create({
        idSede,
        idDoctor,
        idEspecialidad,
        dia,
        hora_inicio: hora_inicio_norm,
        hora_fin: hora_fin_norm,
        estado: estado || 'Habilitado'
      });

      console.log('✅ Horario recreado exitosamente');
      res.status(200).json({ 
        message: 'Horario actualizado exitosamente',
        horario: nuevoHorario
      });
    } else {
      // Solo actualizar el estado si las horas no cambiaron
      console.log('🔄 Solo actualizando estado...');
      
      const [updatedRowsCount] = await HorarioDisponible.update({
        estado: estado || 'Habilitado'
      }, {
        where: whereClause
      });

      if (updatedRowsCount === 0) {
        return res.status(404).json({ message: 'No se pudo actualizar el horario' });
      }

      console.log('✅ Estado del horario actualizado exitosamente');
      res.status(200).json({ message: 'Horario actualizado exitosamente' });
    }
  } catch (error) {
    console.error('❌ Error al actualizar horario:', error);
    return res.status(500).json({ message: 'Error en el servidor al actualizar el horario' });
  }
};

export const getHorariosXDoctor = async (req, res) => {
  try {
    console.log('🔍 getHorariosXDoctor called with:', req.body);
    const { idSede, idEspecialidad, idDoctor } = req.body;

    if (!idSede || !idEspecialidad || !idDoctor) {
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos: idSede, idEspecialidad, idDoctor' 
      });
    }

    const horarios = await HorarioDisponible.findAll({
      where: {
        idSede,
        idDoctor,
        idEspecialidad, // Agregar también idEspecialidad ya que es parte de la clave primaria
        estado: 'Habilitado'
      },
      include: [{
        model: Sede,
        as: 'sede'
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      order: [['dia'], ['hora_inicio']] // Usar los nombres correctos de las columnas
    });

    console.log('✅ Horarios encontrados:', horarios.length);

    if (horarios.length === 0) {
      return res.status(200).json([]); // Devolver array vacío en lugar de 404
    }

    res.json(horarios);
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      where: { estado: 'Habilitado' },
      attributes: { exclude: ['contra'] }, // No devolver contraseñas
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    if (admins.length === 0) {
      return res.status(404).json({ message: 'No hay administradores cargados' });
    }

    res.json(admins);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    const admin = await Admin.findOne({
      where: { dni },
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

    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminLogin = async (req, res) => {
  try {
    const { dni, contra } = req.body;

    const admin = await Admin.findOne({
      where: { dni },
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(contra, admin.contra);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        idAdmin: admin.idAdmin,
        dni: admin.usuario.dni,
        nombre: admin.usuario.nombre,
        apellido: admin.usuario.apellido,
        rol: 'A',
      },
      'CLAVE_SUPER_SEGURISIMA',
      { expiresIn: '2h' }
    );

    res.json(token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { dni, contra } = req.body;

    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contra, 10);

    const nuevoAdmin = await Admin.create({
      dni,
      contra: hashedPassword,
      estado: 'Habilitado'
    });

    // Retornar sin la contraseña
    const adminCompleto = await Admin.findByPk(nuevoAdmin.idAdmin, {
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

    res.json(adminCompleto);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El administrador ya existe'
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { contra, estado } = req.body;

    const updateData = { estado };
    
    // Solo actualizar contraseña si se proporciona
    if (contra) {
      updateData.contra = await bcrypt.hash(contra, 10);
    }

    const [updatedRowsCount] = await Admin.update(
      updateData,
      { where: { idAdmin: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json({ message: 'Administrador actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete
    const [updatedRowsCount] = await Admin.update(
      { estado: 'Deshabilitado' },
      { where: { idAdmin: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json({ message: 'Administrador deshabilitado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
