import { pool } from '../bd.js';

export const getDoctors = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM doctores');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay doctores cargados' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM doctores WHERE dni = ?', [
      req.params.dni,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    matricula,
    fechaNac,
    sexo,
    telefono,
    mail,
    direccion,
    codpostal,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO usuarios (nombre, apellido, dni, matricula, fechaNac, sexo, telefono, mail, direccion, codpostal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nombre,
        apellido,
        dni,
        matricula,
        fechaNac,
        sexo,
        telefono,
        mail,
        direccion,
        codpostal,
      ]
    );
    res.json({
      nombre,
      apellido,
      dni,
      matricula,
      fechaNac,
      sexo,
      telefono,
      mail,
      direccion,
      codpostal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE doctores SET / WHERE dni = ?', [
      req.body,
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json({ message: 'Doctor actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM doctores WHERE dni = ?', [
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
