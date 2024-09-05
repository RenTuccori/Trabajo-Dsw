import { pool } from '../db.js';
import jwt from "jsonwebtoken";

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

export const getUserByDniFecha = async (req, res) => {
  try {
    const { dni, fechaNacimiento } = req.body;
    const [result] = await pool.query(
      'SELECT * FROM usuarios WHERE dni = ? and fechaNacimiento = ?',
      [dni, fechaNacimiento]
    );

    if (result.length === 0) {
      return res.status(200).json(null); // Devuelve null si no encuentra al usuario
    } else {
      const token = jwt.sign({ dni: result[0].dni}, "CLAVE_SUPER_SEGURISIMA", { expiresIn: "5m" });
      console.log('Token generado:', token);
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const createUser = async (req, res) => {
  const {
        dni,
        fechaNacimiento,
        nombre,
        apellido,
        telefono,
        email,
        direccion,
        idObraSocial
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO usuarios (dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        dni,
        fechaNacimiento,
        nombre,
        apellido,
        telefono,
        email,
        direccion,
        idObraSocial
      ]
    );
    res.json({
        dni,
        fechaNacimiento,
        nombre,
        apellido,
        telefono,
        email,
        direccion,
        idObraSocial
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, direccion, idObraSocial } = req.body;

    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ?, idObraSocial = ? WHERE dni = ?',
      [nombre, apellido, telefono, email, direccion, idObraSocial, dni]
    );

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

