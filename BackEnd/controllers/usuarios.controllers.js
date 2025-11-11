import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios cargados' });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByDniFecha = async (req, res) => {
  try {
    const { dni, fechaNacimiento } = req.body;
    const user = await User.findOne({
      where: {
        national_id: dni,
        birth_date: fechaNacimiento
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      const token = jwt.sign(
        {
          national_id: user.national_id,
          first_name: user.first_name,
          last_name: user.last_name,
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
    const user = await User.findOne({
      where: { national_id: dni }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(user);
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
    idObraSocial,
  } = req.body;
  try {
    const newUser = await User.create({
      national_id: dni,
      birth_date: fechaNacimiento,
      first_name: nombre,
      last_name: apellido,
      phone: telefono,
      email: email,
      address: direccion,
      health_insurance_id: idObraSocial,
    });
    res.json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, direccion, idObraSocial } =
      req.body;

    const [updatedRows] = await User.update(
      {
        first_name: nombre,
        last_name: apellido,
        phone: telefono,
        email: email,
        address: direccion,
        health_insurance_id: idObraSocial,
      },
      {
        where: { national_id: dni }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { national_id: req.params.dni }
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
