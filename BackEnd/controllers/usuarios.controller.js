import { pool } from '../db.js';

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
       dni,
       nombre,  
       apellido,  
       telefono, 
       email,  
       direccion,  
       idObraSocial, 
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO usuarios (dni, nombre, apellido, telefono, email, direccion, idObraSocial) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
       dni,
       nombre,  
       apellido,  
       telefono, 
       email,  
       direccion,  
       idObraSocial, 
      ]
    );
    res.json({
       dni,
       nombre,  
       apellido,  
       telefono, 
       email,  
       direccion,  
       idObraSocial, 
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
