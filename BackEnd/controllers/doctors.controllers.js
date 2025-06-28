import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getDoctorsByVenueAndSpecialty = async (req, res) => {
  try {
    const { idSede, idEspecialidad } = req.body;
    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.first_name, " ", u.last_name) nombreyapellido 
       FROM sededoctoresp sde
       INNER JOIN doctors doc ON sde.idDoctor = doc.idDoctor
       INNER JOIN users u ON doc.dni = u.dni 
       WHERE sde.idSede = ? AND sde.idEspecialidad = ? AND doc.estado = 'Habilitado'`,
      [idSede, idEspecialidad]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'No hay doctors para esta specialty' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableDoctors = async (req, res) => {
  try {
    const { idSede } = req.body;
    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.first_name, " ", u.last_name) AS nombreyapellido 
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.idDoctor NOT IN (
         SELECT sde.idDoctor 
         FROM sededoctoresp sde 
         WHERE sde.idSede = ?
       ) AND doc.estado = 'Habilitado'`,
      [idSede]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message:
          'No hay doctors disponibles para esta specialty fuera de esta venue',
      });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.first_name, " ", u.last_name) nombreyapellido 
       FROM doctors doc
       INNER JOIN users u ON doc.dni = u.dni 
       WHERE doc.estado = 'Habilitado'
       ORDER BY u.last_name ASC`
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay doctors' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const [dni] = req.body;
    const [result] = await pool.query(
      `SELECT doc.dni AS DNI, u.first_name, u.last_name, u.email 
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.dni = ? AND doc.estado = 'Habilitado'`,
      [dni]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const [result] = await pool.query(
      `SELECT u.first_name, u.last_name, u.email, doc.dni, doc.duracionTurno, doc.contra, u.phone, u.address, u.idObraSocial, os.first_name AS obraSocial
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       INNER JOIN obrasociales os ON u.idObraSocial = os.idObraSocial
       WHERE doc.idDoctor = ? AND doc.estado = 'Habilitado'`,
      [idDoctor]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDniContra = async (req, res) => {
  try {
    const { dni, contra } = req.body;
    const [result] = await pool.query(
      `SELECT doc.idDoctor, u.first_name, u.last_name
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.dni = ? AND doc.contra = ? AND doc.estado = 'Habilitado'`,
      [dni, contra]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      const token = jwt.sign(
        {
          idDoctor: result[0].idDoctor,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          rol: 'Doctor',
        },
        'CLAVE_SUPER_SEGURISIMA',
        { expiresIn: '5m' }
      );
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  const { dni, duracionTurno, contra } = req.body;
  const estado = 'Habilitado';
  try {
    const [result] = await pool.query(
      'INSERT INTO doctors (dni, duracionTurno, contra, estado) VALUES (?, ?, ?,?)',
      [dni, duracionTurno, contra, estado]
    );

    const idDoctor = result.insertId;

    res.json({
      idDoctor,
      dni,
      duracionTurno,
      contra,
      estado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado del doctor a "Deshabilitado"
    const [resultDoctor] = await pool.query(
      'UPDATE doctors SET estado = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );

    // Si no se encontró el doctor, devolver un error
    if (resultDoctor.affectedRows === 0) {
      // Si el doctor no existe, hacer un rollback de la transacción
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    // Actualizar el estado de las combinaciones en la tabla sededoctoresp a "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sededoctoresp SET estado = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );
    const [resultHorario] = await pool.query(
      'UPDATE horarios_disponibles SET estado = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );
    // Confirmar la transacción si todo salió bien
    await pool.query('COMMIT');

    // Si la transacción fue exitosa, devolver 204 No Content
    return res.sendStatus(204); // No hay contenido que devolver, pero la operación fue exitosa
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { idDoctor } = req.params;
  const { duracionTurno, contra } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE doctors SET duracionTurno = ?, contra = ? WHERE idDoctor = ?',
      [duracionTurno, contra, idDoctor]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json({ idDoctor, duracionTurno, contra });
    console.log('Doctor actualizado:');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
