import { ObraSocial, Usuario } from '../models/index.js';

export const getObrasSociales = async (req, res) => {
  try {
    const obrasSociales = await ObraSocial.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuarios',
        required: false // LEFT JOIN - incluye obras sociales sin usuarios
      }]
    });

    if (obrasSociales.length === 0) {
      return res.status(404).json({ message: 'No hay obras sociales cargadas' });
    }

    res.json(obrasSociales);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getObraSocialById = async (req, res) => {
  try {
    const { id } = req.params;

    const obraSocial = await ObraSocial.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuarios',
        required: false
      }]
    });

    if (!obraSocial) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }

    res.json(obraSocial);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createObraSocial = async (req, res) => {
  try {
    const { nombre } = req.body;

    console.log('🔍 Creando obra social:', nombre);

    // Verificar si ya existe una obra social con el mismo nombre
    const obraSocialExistente = await ObraSocial.findOne({
      where: { nombre }
    });

    if (obraSocialExistente) {
      if (obraSocialExistente.estado === 'Habilitado') {
        return res.status(400).json({ 
          message: 'La obra social ya existe y está habilitada' 
        });
      } else {
        // Si existe pero está deshabilitada, rehabilitarla
        console.log('🔄 Rehabilitando obra social existente:', nombre);
        
        await ObraSocial.update({
          estado: 'Habilitado'
        }, {
          where: { nombre }
        });

        const obraSocialRehabilitada = await ObraSocial.findOne({
          where: { nombre }
        });

        console.log('✅ Obra social rehabilitada exitosamente');
        return res.json(obraSocialRehabilitada);
      }
    }

    const nuevaObraSocial = await ObraSocial.create({
      nombre,
      estado: 'Habilitado'
    });

    console.log('✅ Nueva obra social creada exitosamente');
    res.json(nuevaObraSocial);
  } catch (error) {
    console.error('❌ Error al crear obra social:', error);
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

export const updateObraSocial = async (req, res) => {
  try {
    const { idObraSocial } = req.params;
    const { nombre, estado } = req.body;

    console.log('🔄 Actualizando obra social - ID:', idObraSocial, 'Nombre:', nombre);

    if (!idObraSocial) {
      return res.status(400).json({ message: 'ID de obra social requerido' });
    }

    const [updatedRowsCount] = await ObraSocial.update(
      { nombre, estado },
      { where: { idObraSocial: idObraSocial } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }

    console.log('✅ Obra social actualizada exitosamente');
    res.json({ message: 'Obra social actualizada' });
  } catch (error) {
    console.error('❌ Error al actualizar obra social:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteObraSocial = async (req, res) => {
  try {
    const { idObraSocial } = req.params;

    console.log('🗑️ Eliminando obra social - ID:', idObraSocial);

    if (!idObraSocial) {
      return res.status(400).json({ message: 'ID de obra social requerido' });
    }

    // Soft delete - cambiar estado en lugar de eliminar
    const [updatedRowsCount] = await ObraSocial.update(
      { estado: 'Deshabilitado' },
      { where: { idObraSocial: idObraSocial } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }

    console.log('✅ Obra social deshabilitada exitosamente');
    res.json({ message: 'Obra social deshabilitada' });
  } catch (error) {
    console.error('❌ Error al eliminar obra social:', error);
    return res.status(500).json({ message: error.message });
  }
};
