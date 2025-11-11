import { Op } from 'sequelize';
import Specialty from '../models/Specialty.js';
import DoctorSpecialtyLocation from '../models/DoctorSpecialtyLocation.js';

export const getSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const specialties = await DoctorSpecialtyLocation.findAll({
      where: { location_id: idSede },
      include: [
        {
          model: Specialty,
          where: { status: 'Habilitado' }
        }
      ],
      attributes: [],
      includeAttributes: ['id', 'name']
    });
    const result = [...new Set(specialties.map(s => ({ idEspecialidad: s.Specialty.id, nombre: s.Specialty.name })))];
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSpecialities = async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      where: { status: 'Habilitado' }
    });
    res.json(specialties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const assignedSpecialties = await DoctorSpecialtyLocation.findAll({
      where: { location_id: idSede },
      attributes: ['specialty_id']
    });
    const assignedIds = assignedSpecialties.map(s => s.specialty_id);

    const specialties = await Specialty.findAll({
      where: {
        status: 'Habilitado',
        id: { [Op.notIn]: assignedIds }
      }
    });
    res.json(specialties.map(s => ({ idEspecialidad: s.id, nombre: s.name })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    const { idEspecialidad } = req.params;
    const [result] = await pool.query(
      'SELECT * FROM especialidades WHERE idEspecialidad = ? AND estado = \'Habilitado\'',
      [idEspecialidad]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createSpecialty = async (req, res) => {
  try {
    const { nombre } = req.body;
    const estado = 'Habilitado';

    // Verificar si ya existe una especialidad con el mismo nombre y estado habilitado
    const [existingSpecialty] = await pool.query(
      'SELECT * FROM especialidades WHERE nombre = ? AND estado = ?',
      [nombre, estado]
    );

    if (existingSpecialty.length > 0) {
      // Si ya existe una especialidad habilitada con el mismo nombre
      return res.status(400).json({ message: 'Ya existe una especialidad habilitada con este nombre.' });
    }

    // Insertar nueva especialidad con estado habilitado
    const [result] = await pool.query(
      'INSERT INTO especialidades (nombre, estado) VALUES (?, ?)',
      [nombre, estado]
    );

    res.json({
      idEspecialidad: result.insertId,
      nombre,
      estado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateSpecialty = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE especialidades SET ? WHERE idEspecialidad = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    res.json({ message: 'Especialidad actualizada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const { idEspecialidad } = req.params;

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado de la especialidad a "Deshabilitado"
    const [resultEspecialidad] = await pool.query(
      'UPDATE especialidades SET estado = "Deshabilitado" WHERE idEspecialidad = ?',
      [idEspecialidad]
    );

    // Si no se encontró la especialidad, devolver un error
    if (resultEspecialidad.affectedRows === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    // Actualizar el estado de las combinaciones en la tabla sededoctoresp a "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sededoctoresp SET estado = "Deshabilitado" WHERE idEspecialidad = ?',
      [idEspecialidad]
    );

    // Confirmar la transacción si todo salió bien
    await pool.query('COMMIT');

    // Si todo fue exitoso, devolver un mensaje de éxito
    return res.json({ message: 'Especialidad deshabilitada exitosamente' });
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};
