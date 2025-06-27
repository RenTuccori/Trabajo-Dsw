import { 
  HorarioDisponible, 
  Doctor, 
  Usuario, 
  Turno, 
  Especialidad, 
  Sede,
  sequelize 
} from '../models/index.js';
import { Op, QueryTypes } from 'sequelize';

// Función auxiliar para convertir día de la semana
const getDayName = (dayNumber) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayNumber];
};

// Fechas disponibles por doctor, especialidad y sede
export const getFechasDispDocEspSed = async (req, res) => {
  try {
    console.log('🔍 getFechasDispDocEspSed called with:', req.body);
    const { idDoctor, idEspecialidad, idSede } = req.body;

    // Validar parámetros requeridos
    if (!idDoctor || !idEspecialidad || !idSede) {
      console.log('❌ Missing required parameters:', { idDoctor, idEspecialidad, idSede });
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos: idDoctor, idEspecialidad, idSede' 
      });
    }

    // Obtener información del doctor para duración de turno
    console.log('🔍 Looking for doctor with ID:', idDoctor);
    const doctor = await Doctor.findByPk(idDoctor);
    if (!doctor) {
      console.log('❌ Doctor not found:', idDoctor);
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    console.log('✅ Doctor found:', { id: doctor.idDoctor, duracion: doctor.duracionTurno });

    // Usar la tabla de fechas existente y hacer una consulta más simple
    const fechasDisponibles = await sequelize.query(`
      SELECT DISTINCT f.fechas as fecha
      FROM fechas f
      JOIN horarios_disponibles hd ON (
        hd.dia = CASE DAYNAME(f.fechas)
          WHEN 'Monday' THEN 'Lunes'
          WHEN 'Tuesday' THEN 'Martes'
          WHEN 'Wednesday' THEN 'Miércoles'
          WHEN 'Thursday' THEN 'Jueves'
          WHEN 'Friday' THEN 'Viernes'
          WHEN 'Saturday' THEN 'Sábado'
          WHEN 'Sunday' THEN 'Domingo'
        END
      )
      WHERE hd.idDoctor = :idDoctor
      AND hd.idEspecialidad = :idEspecialidad
      AND hd.idSede = :idSede
      AND hd.estado = 'Habilitado'
      AND f.fechas > CURDATE()
      ORDER BY f.fechas
      LIMIT 30
    `, {
      replacements: {
        idDoctor,
        idEspecialidad,
        idSede,
        duracionTurno: doctor.duracionTurno
      },
      type: QueryTypes.SELECT
    });

    console.log('✅ Query executed successfully, results:', fechasDisponibles);
    
    // Formatear las fechas para el frontend
    const fechasFormateadas = fechasDisponibles.map(row => ({
      fecha: row.fecha instanceof Date ? row.fecha.toISOString().split('T')[0] : row.fecha
    }));
    
    res.json(fechasFormateadas);
  } catch (error) {
    console.error('❌ Error en getFechasDispDocEspSed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

// Fechas disponibles para todos los doctores de una especialidad y sede
export const getFechasDispEspSed = async (req, res) => {
  try {
    const { idEspecialidad, idSede } = req.body;

    const fechasDisponibles = await sequelize.query(`
      SELECT DISTINCT DATE(fecha_hora) as fecha
      FROM (
        SELECT 
          CONCAT(fe.fechas, ' ', TIME(
            ADDTIME(hd.hora_inicio, 
              SEC_TO_TIME(FLOOR(TIMESTAMPDIFF(MINUTE, hd.hora_inicio, hd.hora_fin) / d.duracionTurno) * d.duracionTurno * 60)
            )
          )) as fecha_hora
        FROM horarios_disponibles hd
        JOIN doctores d ON hd.idDoctor = d.idDoctor
        JOIN sededoctoresp sde ON (sde.idDoctor = hd.idDoctor AND sde.idEspecialidad = :idEspecialidad)
        CROSS JOIN (
          SELECT CURDATE() + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS fechas
          FROM (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
          CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
          CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) AS c
          WHERE CURDATE() + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY <= CURDATE() + INTERVAL 90 DAY
        ) fe
        WHERE hd.dia = CASE DAYNAME(fe.fechas)
          WHEN 'Monday' THEN 'Lunes'
          WHEN 'Tuesday' THEN 'Martes'
          WHEN 'Wednesday' THEN 'Miércoles'
          WHEN 'Thursday' THEN 'Jueves'
          WHEN 'Friday' THEN 'Viernes'
          WHEN 'Saturday' THEN 'Sábado'
          WHEN 'Sunday' THEN 'Domingo'
        END
        AND hd.idSede = :idSede
        AND hd.estado = 'Habilitado'
        AND fe.fechas > CURDATE()
      ) disponibles
      LEFT JOIN turnos t ON (
        t.fechaYHora = disponibles.fecha_hora
        AND t.estado IN ('Reservado', 'Confirmado')
      )
      WHERE t.idTurno IS NULL
      ORDER BY fecha
    `, {
      replacements: { idEspecialidad, idSede },
      type: QueryTypes.SELECT
    });

    res.json(fechasDisponibles);
  } catch (error) {
    console.error('Error en getFechasDispEspSed:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Horarios disponibles por doctor, especialidad y sede en una fecha específica
export const getHorariosDispDocEspSed = async (req, res) => {
  try {
    console.log('🔍 getHorariosDispDocEspSed called with:', req.body);
    const { idDoctor, idEspecialidad, idSede, fecha } = req.body;

    // Validar parámetros requeridos
    if (!idDoctor || !idEspecialidad || !idSede || !fecha) {
      console.log('❌ Missing required parameters:', { idDoctor, idEspecialidad, idSede, fecha });
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos: idDoctor, idEspecialidad, idSede, fecha' 
      });
    }

    // Obtener información del doctor para duración de turno
    const doctor = await Doctor.findByPk(idDoctor);
    if (!doctor) {
      console.log('❌ Doctor not found:', idDoctor);
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    console.log('✅ Doctor found:', { id: doctor.idDoctor, duracion: doctor.duracionTurno });

    // Consulta simplificada para horarios
    const horariosDisponibles = await sequelize.query(`
      SELECT 
        TIME_FORMAT(hd.hora_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(hd.hora_fin, '%H:%i') as hora_fin,
        u.nombre,
        u.apellido,
        hd.idDoctor,
        hd.idSede
      FROM horarios_disponibles hd
      JOIN doctores d ON hd.idDoctor = d.idDoctor
      JOIN usuarios u ON d.dni = u.dni
      WHERE hd.idDoctor = :idDoctor
      AND hd.idSede = :idSede
      AND hd.estado = 'Habilitado'
      AND hd.dia = CASE DAYNAME(:fecha)
        WHEN 'Monday' THEN 'Lunes'
        WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles'
        WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes'
        WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo'
      END
      ORDER BY hd.hora_inicio
    `, {
      replacements: {
        idDoctor,
        idEspecialidad,
        idSede,
        fecha
      },
      type: QueryTypes.SELECT
    });

    console.log('✅ Query executed successfully, results:', horariosDisponibles);
    res.json(horariosDisponibles);
  } catch (error) {
    console.error('❌ Error en getHorariosDispDocEspSed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

// Horarios disponibles para todos los doctores de una especialidad y sede en una fecha específica
export const getHorariosDispEspSed = async (req, res) => {
  try {
    const { idEspecialidad, idSede, fecha } = req.body;

    const horariosDisponibles = await sequelize.query(`
      WITH RECURSIVE time_slots AS (
        SELECT 
          hd.idDoctor,
          hd.idSede,
          hd.dia,
          hd.hora_inicio AS start_time,
          ADDTIME(hd.hora_inicio, SEC_TO_TIME(d.duracionTurno * 60)) AS end_time,
          hd.hora_fin,
          d.duracionTurno,
          u.nombre,
          u.apellido
        FROM horarios_disponibles hd
        JOIN doctores d ON hd.idDoctor = d.idDoctor
        JOIN usuarios u ON d.dni = u.dni
        JOIN sededoctoresp sde ON (sde.idDoctor = hd.idDoctor AND sde.idEspecialidad = :idEspecialidad)
        WHERE hd.idSede = :idSede
        AND hd.estado = 'Habilitado'
        AND sde.estado = 'Habilitado'
        AND hd.dia = CASE DAYNAME(:fecha)
          WHEN 'Monday' THEN 'Lunes'
          WHEN 'Tuesday' THEN 'Martes'
          WHEN 'Wednesday' THEN 'Miércoles'
          WHEN 'Thursday' THEN 'Jueves'
          WHEN 'Friday' THEN 'Viernes'
          WHEN 'Saturday' THEN 'Sábado'
          WHEN 'Sunday' THEN 'Domingo'
        END

        UNION ALL

        SELECT 
          ts.idDoctor,
          ts.idSede,
          ts.dia,
          ts.end_time AS start_time,
          ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
          ts.hora_fin,
          ts.duracionTurno,
          ts.nombre,
          ts.apellido
        FROM time_slots ts
        WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
      )
      SELECT 
        ts.idDoctor,
        ts.nombre,
        ts.apellido,
        ts.start_time AS hora_inicio,
        ts.dia AS dia
      FROM time_slots ts
      LEFT JOIN turnos tur ON (
        tur.idDoctor = ts.idDoctor
        AND tur.idSede = ts.idSede
        AND DATE(tur.fechaYHora) = :fecha
        AND TIME(tur.fechaYHora) = ts.start_time
        AND tur.estado IN ('Reservado', 'Confirmado')
      )
      WHERE tur.idTurno IS NULL
      ORDER BY ts.nombre, ts.apellido, ts.start_time
    `, {
      replacements: { idEspecialidad, idSede, fecha },
      type: QueryTypes.SELECT
    });

    res.json(horariosDisponibles);
  } catch (error) {
    console.error('Error en getHorariosDispEspSed:', error);
    return res.status(500).json({ message: error.message });
  }
};

// CRUD para horarios disponibles
export const getHorariosDisponibles = async (req, res) => {
  try {
    const horarios = await HorarioDisponible.findAll({
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Sede,
        as: 'sede'
      }],
      order: [['dia'], ['hora_inicio']]
    });

    res.json(horarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createHorarioDisponible = async (req, res) => {
  try {
    const { idDoctor, idSede, idEspecialidad, dia, hora_inicio, hora_fin } = req.body;

    // Verificar que no exista un horario que se superponga
    const horarioExistente = await HorarioDisponible.findOne({
      where: {
        idDoctor,
        idSede,
        idEspecialidad,
        dia,
        [Op.or]: [
          {
            hora_inicio: {
              [Op.between]: [hora_inicio, hora_fin]
            }
          },
          {
            hora_fin: {
              [Op.between]: [hora_inicio, hora_fin]
            }
          },
          {
            [Op.and]: [
              { hora_inicio: { [Op.lte]: hora_inicio } },
              { hora_fin: { [Op.gte]: hora_fin } }
            ]
          }
        ]
      }
    });

    if (horarioExistente) {
      return res.status(400).json({ 
        message: 'Ya existe un horario que se superpone con el especificado' 
      });
    }

    const nuevoHorario = await HorarioDisponible.create({
      idDoctor,
      idSede,
      idEspecialidad,
      dia,
      hora_inicio,
      hora_fin,
      estado: 'Habilitado'
    });

    // Como no hay idHorario auto-incremental, devolver el horario creado directamente
    const horarioCompleto = await HorarioDisponible.findOne({
      where: {
        idDoctor,
        idSede,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin
      },
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Sede,
        as: 'sede'
      }]
    });

    res.json(horarioCompleto);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateHorarioDisponible = async (req, res) => {
  try {
    const { idDoctor, idSede, idEspecialidad, dia, hora_inicio, hora_fin, estado } = req.body;

    if (!idDoctor || !idSede || !idEspecialidad || !dia || !hora_inicio || !hora_fin) {
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos para actualizar el horario' 
      });
    }

    const [updatedRowsCount] = await HorarioDisponible.update({
      estado: estado || 'Habilitado'
    }, {
      where: { 
        idDoctor,
        idSede,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteHorarioDisponible = async (req, res) => {
  try {
    const { idDoctor, idSede, idEspecialidad, dia, hora_inicio, hora_fin } = req.body;

    if (!idDoctor || !idSede || !idEspecialidad || !dia || !hora_inicio || !hora_fin) {
      return res.status(400).json({ 
        message: 'Faltan parámetros requeridos para eliminar el horario' 
      });
    }

    // Soft delete
    const [updatedRowsCount] = await HorarioDisponible.update({
      estado: 'Deshabilitado'
    }, {
      where: { 
        idDoctor,
        idSede,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario deshabilitado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};