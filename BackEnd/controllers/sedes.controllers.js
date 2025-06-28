import { Sede, HorarioDisponible, Doctor, Usuario, SedeDocEsp, Especialidad } from '../models/index.js';

export const getSedes = async (req, res) => {
  try {
    const sedes = await Sede.findAll({
      where: { estado: 'Habilitado' }
    });

    if (sedes.length === 0) {
      return res.status(404).json({ message: 'No hay sedes cargadas' });
    }

    res.json(sedes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const { id } = req.params;

    const sede = await Sede.findByPk(id);

    if (!sede) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    res.json(sede);
  } catch (error) {
    console.error('Error en getSedeById:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createSede = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;

    console.log('🔍 Creando sede:', nombre, direccion);

    // Verificar si ya existe una sede con el mismo nombre
    const sedeExistente = await Sede.findOne({
      where: { nombre }
    });

    if (sedeExistente) {
      if (sedeExistente.estado === 'Habilitado') {
        return res.status(400).json({ 
          message: 'La sede ya existe y está habilitada' 
        });
      } else {
        // Si existe pero está deshabilitada, rehabilitarla
        console.log('🔄 Rehabilitando sede existente:', nombre);
        
        await Sede.update({
          direccion, // Actualizar también la dirección por si cambió
          estado: 'Habilitado'
        }, {
          where: { nombre }
        });

        const sedeRehabilitada = await Sede.findOne({
          where: { nombre }
        });

        console.log('✅ Sede rehabilitada exitosamente');
        return res.json(sedeRehabilitada);
      }
    }

    const nuevaSede = await Sede.create({
      nombre,
      direccion,
      estado: 'Habilitado'
    });

    console.log('✅ Nueva sede creada exitosamente');
    res.json(nuevaSede);
  } catch (error) {
    console.error('❌ Error al crear sede:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, estado } = req.body;

    const [updatedRowsCount] = await Sede.update(
      { nombre, direccion, estado },
      { where: { idSede: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    res.json({ message: 'Sede actualizada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSede = async (req, res) => {
  try {
    const { idSede } = req.params;

    // Soft delete
    const [updatedRowsCount] = await Sede.update(
      { estado: 'Deshabilitado' },
      { where: { idSede: idSede } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    res.json({ message: 'Sede deshabilitada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctoresBySede = async (req, res) => {
  try {
    const { id } = req.params;

    const sede = await Sede.findByPk(id, {
      include: [{
        model: SedeDocEsp,
        as: 'sedeDocEsp',
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
        }]
      }]
    });

    if (!sede) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    res.json(sede);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
