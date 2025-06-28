import { 
  Turno, 
  Doctor, 
  Paciente, 
  Usuario, 
  ObraSocial, 
  Especialidad, 
  Sede,
  HorarioDisponible 
} from '../models/index.js';
import { Op } from 'sequelize';

// Función utilitaria para formatear fechas
const formatearFechas = (turno) => {
  const turnoObj = turno.toJSON ? turno.toJSON() : turno;
  
  // Formatear fechaYHora al formato YYYY-MM-DD HH:mm:ss
  if (turnoObj.fechaYHora) {
    const fecha = new Date(turnoObj.fechaYHora);
    turnoObj.fechaYHora = fecha.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  // Formatear fechaConfirmacion si existe
  if (turnoObj.fechaConfirmacion) {
    const fecha = new Date(turnoObj.fechaConfirmacion);
    turnoObj.fechaConfirmacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  // Formatear fechaCancelacion si existe
  if (turnoObj.fechaCancelacion) {
    const fecha = new Date(turnoObj.fechaCancelacion);
    turnoObj.fechaCancelacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  return turnoObj;
};

export const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario',
          include: [{
            model: ObraSocial,
            as: 'obraSocial'
          }]
        }]
      }, {
        model: Especialidad,
        as: 'especialidad'
      }, {
        model: Sede,
        as: 'sede'
      }],
      order: [['fechaYHora', 'ASC']]
    });

    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No hay turnos cargados' });
    }

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnosByDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const turnos = await Turno.findAll({
      where: { idDoctor },
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario',
          include: [{
            model: ObraSocial,
            as: 'obraSocial'
          }]
        }]
      }, {
        model: Especialidad,
        as: 'especialidad'
      }, {
        model: Sede,
        as: 'sede'
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnosByPaciente = async (req, res) => {
  try {
    const { idPaciente } = req.params;

    const turnos = await Turno.findAll({
      where: { idPaciente },
      include: [{
        model: Doctor,
        as: 'doctor',
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
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnosDisponibles = async (req, res) => {
  try {
    const { idDoctor, idEspecialidad, idSede, fecha } = req.query;

    const whereClause = {
      estado: 'Disponible'
    };

    if (idDoctor) whereClause.idDoctor = idDoctor;
    if (idEspecialidad) whereClause.idEspecialidad = idEspecialidad;
    if (idSede) whereClause.idSede = idSede;
    
    if (fecha) {
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);
      
      whereClause.fechaYHora = {
        [Op.gte]: fechaInicio,
        [Op.lt]: fechaFin
      };
    }

    const turnosDisponibles = await Turno.findAll({
      where: whereClause,
      include: [{
        model: Doctor,
        as: 'doctor',
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
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnosDisponibles.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTurno = async (req, res) => {
  try {
    const {
      idDoctor,
      idPaciente,
      fechaYHora,
      idEspecialidad,
      idSede
    } = req.body;

    // Verificar que el doctor existe
    const doctor = await Doctor.findByPk(idDoctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    // Si hay paciente, verificar que existe
    if (idPaciente) {
      const paciente = await Paciente.findByPk(idPaciente);
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
    }

    // Verificar que no haya conflicto de horarios
    const conflicto = await Turno.findOne({
      where: {
        idDoctor,
        fechaYHora,
        estado: {
          [Op.in]: ['Reservado', 'Confirmado']
        }
      }
    });

    if (conflicto) {
      return res.status(400).json({ 
        message: 'Ya existe un turno en ese horario para el doctor' 
      });
    }

    const nuevoTurno = await Turno.create({
      idDoctor,
      idPaciente,
      fechaYHora,
      idEspecialidad,
      idSede,
      estado: idPaciente ? 'Reservado' : 'Disponible'
    });

    // Retornar con todas las relaciones
    const turnoCompleto = await Turno.findByPk(nuevoTurno.idTurno, {
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
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
    });

    // Formatear fechas antes de enviar
    const turnoFormateado = formatearFechas(turnoCompleto);
    res.json(turnoFormateado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reservarTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;
    const { idPaciente } = req.body;

    // Verificar que el turno existe y está disponible
    const turno = await Turno.findByPk(idTurno);
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    if (turno.estado !== 'Disponible') {
      return res.status(400).json({ message: 'El turno no está disponible' });
    }

    // Verificar que el paciente existe
    const paciente = await Paciente.findByPk(idPaciente);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Actualizar el turno
    await Turno.update({
      idPaciente,
      estado: 'Reservado'
    }, {
      where: { idTurno }
    });

    // Retornar turno actualizado
    const turnoActualizado = await Turno.findByPk(idTurno, {
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
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
    });

    // Formatear fechas antes de enviar
    const turnoFormateado = formatearFechas(turnoActualizado);
    res.json(turnoFormateado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body; // Cambiado de req.params a req.body

    const [updatedRowsCount] = await Turno.update({
      estado: 'Confirmado',
      fechaConfirmacion: new Date()
    }, {
      where: { 
        idTurno,
        estado: ['Reservado', 'Pendiente'] // Permitir tanto Reservado como Pendiente
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o no se puede confirmar' 
      });
    }

    res.json({ message: 'Turno confirmado exitosamente' });
  } catch (error) {
    console.error('❌ Error al confirmar turno:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const cancelarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body; // Cambiado de req.params a req.body

    const [updatedRowsCount] = await Turno.update({
      estado: 'Cancelado',
      fechaCancelacion: new Date(),
      idPaciente: null
    }, {
      where: { 
        idTurno,
        estado: {
          [Op.in]: ['Reservado', 'Confirmado', 'Pendiente'] // Agregado Pendiente
        }
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o no se puede cancelar' 
      });
    }

    res.json({ message: 'Turno cancelado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const completarTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;

    const [updatedRowsCount] = await Turno.update({
      estado: 'Completado'
    }, {
      where: { 
        idTurno,
        estado: 'Confirmado'
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o no está confirmado' 
      });
    }

    res.json({ message: 'Turno completado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const generarTurnosAutomaticos = async (req, res) => {
  try {
    const { idDoctor, fechaInicio, fechaFin } = req.body;

    // Obtener horarios disponibles del doctor
    const horarios = await HorarioDisponible.findAll({
      where: { 
        idDoctor,
        estado: 'Habilitado'
      }
    });

    if (horarios.length === 0) {
      return res.status(404).json({ 
        message: 'No hay horarios configurados para este doctor' 
      });
    }

    // Obtener duración del turno del doctor
    const doctor = await Doctor.findByPk(idDoctor);
    const duracionTurno = doctor.duracionTurno;

    const turnosGenerados = [];
    const fechaActual = new Date(fechaInicio);
    const fechaLimite = new Date(fechaFin);

    // Generar turnos día por día
    while (fechaActual <= fechaLimite) {
      const diaSemana = fechaActual.toLocaleDateString('es-ES', { weekday: 'long' });
      const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      // Buscar horarios para este día
      const horariosDelDia = horarios.filter(h => h.diaSemana === diaCapitalizado);

      for (const horario of horariosDelDia) {
        let horaActual = new Date(fechaActual);
        const [horaInicio, minutoInicio] = horario.horaInicio.split(':');
        const [horaFin, minutoFin] = horario.horaFin.split(':');

        horaActual.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);
        const horaLimite = new Date(fechaActual);
        horaLimite.setHours(parseInt(horaFin), parseInt(minutoFin), 0, 0);

        // Generar turnos cada 'duracionTurno' minutos
        while (horaActual < horaLimite) {
          // Verificar que no existe ya un turno en este horario
          const turnoExistente = await Turno.findOne({
            where: {
              idDoctor,
              fechaYHora: horaActual
            }
          });

          if (!turnoExistente) {
            const nuevoTurno = await Turno.create({
              idDoctor,
              fechaYHora: new Date(horaActual),
              estado: 'Disponible',
              idSede: horario.idSede
            });
            turnosGenerados.push(nuevoTurno);
          }

          horaActual.setMinutes(horaActual.getMinutes() + duracionTurno);
        }
      }

      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    res.json({
      message: `Se generaron ${turnosGenerados.length} turnos exitosamente`,
      turnos: turnosGenerados.map(formatearFechas)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función específica para obtener turnos por DNI del paciente
export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    // Buscar paciente por DNI
    const paciente = await Paciente.findOne({
      where: { dni },
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Buscar turnos del paciente
    const turnos = await Turno.findAll({
      where: { idPaciente: paciente.idPaciente },
      include: [{
        model: Doctor,
        as: 'doctor',
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
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear las fechas para que no incluyan información de zona horaria
    const turnosFormateados = turnos.map(formatearFechas);

    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función específica para turnos del doctor HOY
export const getTurnoByDoctorHoy = async (req, res) => {
  try {
    const { idDoctor } = req.body;

    const hoy = new Date();
    const maniana = new Date(hoy);
    maniana.setDate(hoy.getDate() + 1);

    const turnos = await Turno.findAll({
      where: { 
        idDoctor,
        fechaYHora: {
          [Op.gte]: hoy.setHours(0, 0, 0, 0),
          [Op.lt]: maniana.setHours(0, 0, 0, 0)
        }
      },
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
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función específica para turnos históricos del doctor
export const getTurnoByDoctorHistorico = async (req, res) => {
  try {
    const { idDoctor } = req.body;

    const turnos = await Turno.findAll({
      where: { 
        idDoctor,
        estado: {
          [Op.in]: ['Completado', 'Cancelado']
        }
      },
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
      }],
      order: [['fechaYHora', 'DESC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función específica para turnos del doctor en una fecha específica
export const getTurnoByDoctorFecha = async (req, res) => {
  try {
    const { idDoctor, fechaYHora } = req.body; // Cambiado de 'fecha' a 'fechaYHora'
    
    const fechaInicio = new Date(fechaYHora);
    const fechaFin = new Date(fechaYHora);
    fechaFin.setDate(fechaFin.getDate() + 1);

    const turnos = await Turno.findAll({
      where: { 
        idDoctor,
        fechaYHora: {
          [Op.gte]: fechaInicio,
          [Op.lt]: fechaFin
        }
      },
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
      }],
      order: [['fechaYHora', 'ASC']]
    });

    // Formatear fechas antes de enviar
    const turnosFormateados = turnos.map(formatearFechas);
    res.json(turnosFormateados);
  } catch (error) {
    console.error('Error en getTurnoByDoctorFecha:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Función específica para eliminar/cancelar turno
export const deleteTurno = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - cambiar estado a cancelado
    const [updatedRowsCount] = await Turno.update({
      estado: 'Cancelado',
      fechaCancelacion: new Date()
    }, {
      where: { 
        idTurno: id,
        estado: {
          [Op.in]: ['Reservado', 'Confirmado']
        }
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o no se puede cancelar' 
      });
    }

    res.json({ message: 'Turno cancelado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
