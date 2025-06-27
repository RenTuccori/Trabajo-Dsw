import { Especialidad, SedeDocEsp, Doctor, Usuario, Sede, Turno } from '../models/index.js';

export const getEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      where: { estado: 'Habilitado' }
    });

    if (especialidades.length === 0) {
      return res.status(404).json({ message: 'No hay especialidades cargadas' });
    }

    res.json(especialidades);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialidad.findByPk(id, {
      include: [{
        model: Turno,
        as: 'turnos',
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
      }]
    });

    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json(especialidad);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;

    console.log('🔍 Creando especialidad:', nombre);

    // Verificar si ya existe una especialidad con el mismo nombre
    const especialidadExistente = await Especialidad.findOne({
      where: { nombre }
    });

    if (especialidadExistente) {
      if (especialidadExistente.estado === 'Habilitado') {
        return res.status(400).json({ 
          message: 'La especialidad ya existe y está habilitada' 
        });
      } else {
        // Si existe pero está deshabilitada, rehabilitarla
        console.log('🔄 Rehabilitando especialidad existente:', nombre);
        
        await Especialidad.update({
          estado: 'Habilitado'
        }, {
          where: { nombre }
        });

        const especialidadRehabilitada = await Especialidad.findOne({
          where: { nombre }
        });

        console.log('✅ Especialidad rehabilitada exitosamente');
        return res.json(especialidadRehabilitada);
      }
    }

    const nuevaEspecialidad = await Especialidad.create({
      nombre,
      estado: 'Habilitado'
    });

    console.log('✅ Nueva especialidad creada exitosamente');
    res.json(nuevaEspecialidad);
  } catch (error) {
    console.error('❌ Error al crear especialidad:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error de restricción única en la base de datos'
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const [updatedRowsCount] = await Especialidad.update(
      { nombre, estado },
      { where: { idEspecialidad: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json({ message: 'Especialidad actualizada' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEspecialidad = async (req, res) => {
  try {
    const { idEspecialidad } = req.params;
    console.log('Deleting especialidad with ID:', idEspecialidad);

    // Soft delete
    const [updatedRowsCount] = await Especialidad.update(
      { estado: 'Deshabilitado' },
      { where: { idEspecialidad } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    res.json({ message: 'Especialidad deshabilitada' });
  } catch (error) {
    console.error('Error deleting especialidad:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctoresByEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar doctores que trabajen en esta especialidad
    const sedeDocEsps = await SedeDocEsp.findAll({
      where: { 
        idEspecialidad: id,
        estado: 'Habilitado'
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
      }, {
        model: Especialidad,
        as: 'especialidad'
      }]
    });

    const doctores = sedeDocEsps.map(sde => ({
      ...sde.doctor.toJSON(),
      sede: sde.sede,
      especialidad: sde.especialidad
    }));

    res.json(doctores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
