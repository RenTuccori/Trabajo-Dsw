import { pool } from '../bd.js';

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM usuarios');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios cargados' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserByDni = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM usuarios WHERE dni = ?', [
      req.params.dni,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    fechaNac,
    sexo,
    telefono,
    mail,
    direccion,
    codpostal,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO usuarios (nombre, apellido, dni,fechaNac, sexo, telefono, mail, direccion, codpostal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nombre,
        apellido,
        dni,
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

export const updateUser = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE usuarios SET / WHERE dni = ?', [
      req.body,
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE dni = ?', [
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
