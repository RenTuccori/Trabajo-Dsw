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
    console.log(error);
  }
};

export const getUserByDniFecha = async (req, res) => {
  try {
    console.log('🔍 BACKEND - getUserByDniFecha: Inicio de función');
    const { dni, birthDate } = req.body;
    console.log('📋 BACKEND - Datos recibidos:', { dni, birthDate });
    
    const [result] = await pool.query(
      'SELECT * FROM users WHERE dni = ? and birthDate = ?',
      [dni, birthDate]
    );
    
    console.log('🗄️ BACKEND - Resultado de la consulta:', result);
    console.log('📊 BACKEND - Número de resultados encontrados:', result.length);

    if (result.length === 0) {
      console.log('❌ BACKEND - Usuario no encontrado con DNI y fecha proporcionados');
      return res.status(404).json({ message: 'User not found' });
    } else {
      console.log('✅ BACKEND - Usuario encontrado:', {
        dni: result[0].dni,
        firstName: result[0].firstName,
        lastName: result[0].lastName
      });
      
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
      
      console.log('🔑 BACKEND - Token generado exitosamente');
      console.log('📤 BACKEND - Enviando respuesta con token');
      res.json(token);
    }
  } catch (error) {
    console.log('💥 BACKEND - Error en getUserByDniFecha:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByDni = async (req, res) => {
  try {
    console.log('🔍 BACKEND - getUserByDni: Inicio de función');
    const { dni } = req.body;
    console.log('📋 BACKEND - DNI recibido:', dni);
    
    const [result] = await pool.query('SELECT * FROM users WHERE dni = ?', [
      dni,
    ]);
    
    console.log('🗄️ BACKEND - Resultado de consulta getUserByDni:', result);
    console.log('📊 BACKEND - Número de resultados:', result.length);

    if (result.length === 0) {
      console.log('❌ BACKEND - Usuario no encontrado con DNI:', dni);
      return res.status(404).json({ message: 'User not found' });
    } else {
      console.log('✅ BACKEND - Usuario encontrado:', {
        dni: result[0].dni,
        firstName: result[0].firstName,
        lastName: result[0].lastName
      });
      res.json(result[0]);
    }
  } catch (error) {
    console.log('💥 BACKEND - Error en getUserByDni:', error);
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
    console.log('🔄 BACKEND - updateUser: Inicio de función');
    const { dni, firstName, lastName, phone, email, address, insuranceCompanyId } =
      req.body;
    console.log('📋 BACKEND - Datos recibidos:', { dni, firstName, lastName, phone, email, address, insuranceCompanyId });

    const [result] = await pool.query(
      'UPDATE users SET firstName = ?, lastName = ?, phone = ?, email = ?, address = ?, idInsuranceCompany = ? WHERE dni = ?',
      [firstName, lastName, phone, email, address, insuranceCompanyId, dni]
    );

    console.log('🗄️ BACKEND - Resultado de la actualización:', result);
    console.log('📊 BACKEND - Filas afectadas:', result.affectedRows);

    if (result.affectedRows === 0) {
      console.log('❌ BACKEND - Usuario no encontrado para actualizar');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ BACKEND - Usuario actualizado exitosamente');
    res.json({ message: 'User updated' });
  } catch (error) {
    console.log('💥 BACKEND - Error en updateUser:', error);
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
