import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM users');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No users loaded' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByDniFecha = async (req, res) => {
  try {
    const { dni, birthDate } = req.body;

    const [result] = await pool.query(
      'SELECT * FROM users WHERE dni = ? and birthDate = ?',
      [dni, birthDate]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const token = jwt.sign(
        {
          dni: result[0].dni,
          name: result[0].firstName,
          lastName: result[0].lastName,
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
      return res.status(404).json({ message: 'User not found' });
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
    birthDate,
    firstName,
    lastName,
    phone,
    email,
    address,
    insuranceCompanyId,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (dni, birthDate, firstName, lastName, phone, email, address, idInsuranceCompany) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        dni,
        birthDate,
        firstName,
        lastName,
        phone,
        email,
        address,
        insuranceCompanyId,
      ]
    );
    res.json({
      dni,
      birthDate: birthDate,
      firstName: firstName,
      lastName: lastName,
      phone,
      email,
      address,
      idInsuranceCompany: insuranceCompanyId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      dni,
      firstName,
      lastName,
      phone,
      email,
      address,
      insuranceCompanyId,
    } = req.body;

    const [result] = await pool.query(
      'UPDATE users SET firstName = ?, lastName = ?, phone = ?, email = ?, address = ?, idInsuranceCompany = ? WHERE dni = ?',
      [firstName, lastName, phone, email, address, insuranceCompanyId, dni]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
