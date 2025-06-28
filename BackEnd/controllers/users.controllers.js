import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM users');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay users cargados' });
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
      'SELECT * FROM users WHERE dni = ? and fechaNacimiento = ?',
      [dni, fechaNacimiento]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      const token = jwt.sign(
        {
          dni: result[0].dni,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          rol: 'Patient',
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

export const getUserByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const [result] = await pool.query('SELECT * FROM users WHERE dni = ?', [
      dni,
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
    dni,
    fechaNacimiento,
    first_name,
    last_name,
    phone,
    email,
    address,
    idObraSocial,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (dni, fechaNacimiento, first_name, last_name, phone, email, address, idObraSocial) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        dni,
        fechaNacimiento,
        first_name,
        last_name,
        phone,
        email,
        address,
        idObraSocial,
      ]
    );
    res.json({
      dni,
      fechaNacimiento,
      first_name,
      last_name,
      phone,
      email,
      address,
      idObraSocial,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { dni, first_name, last_name, phone, email, address, idObraSocial } =
      req.body;

    const [result] = await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, idObraSocial = ? WHERE dni = ?',
      [first_name, last_name, phone, email, address, idObraSocial, dni]
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
    const [result] = await pool.query('DELETE FROM users WHERE dni = ?', [
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
