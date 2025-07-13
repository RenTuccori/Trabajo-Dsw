import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getDoctorsByVenueAndSpecialty = async (req, res) => {
  try {
    console.log(
      '👨‍⚕️ BACKEND - getDoctorsByVenueAndSpecialty: Inicio de función'
    );
    const { venueId, specialtyId } = req.body;
    console.log('📋 BACKEND - Parámetros recibidos:', { venueId, specialtyId });

    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.firstName, " ", u.lastName) AS nombreyapellido 
       FROM sitedoctorspecialty sds
       INNER JOIN doctors doc ON sds.idDoctor = doc.idDoctor
       INNER JOIN users u ON doc.dni = u.dni 
       WHERE sds.idSite = ? AND sds.idSpecialty = ? AND doc.status = 'Habilitado'`,
      [venueId, specialtyId]
    );

    console.log('🗄️ BACKEND - Doctores encontrados:', result);
    console.log('📊 BACKEND - Número de doctores:', result.length);

    if (result.length === 0) {
      console.log(
        '⚠️ BACKEND - No se encontraron doctores para esta combinación'
      );
      return res.status(404).json({ message: 'No doctors for this specialty' });
    } else {
      console.log('✅ BACKEND - Enviando doctores encontrados');
      res.json(result);
    }
  } catch (error) {
    console.log('💥 BACKEND - Error en getDoctorsByVenueAndSpecialty:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableDoctors = async (req, res) => {
  try {
    const { venueId } = req.body;
    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.firstName, " ", u.lastName) AS fullName 
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.idDoctor NOT IN (
         SELECT sds.idDoctor 
         FROM sitedoctorspecialty sds 
         WHERE sds.idSite = ?
       ) AND doc.status = 'Habilitado'`,
      [venueId]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: 'No available doctors for this specialty outside this venue',
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
    console.log('👨‍⚕️ BACKEND - getDoctors: Inicio de función');
    const [result] = await pool.query(
      `SELECT doc.idDoctor, CONCAT(u.firstName, " ", u.lastName) AS nombreyapellido 
       FROM doctors doc
       INNER JOIN users u ON doc.dni = u.dni 
       WHERE doc.status = 'Habilitado'
       ORDER BY u.lastName ASC`
    );
    console.log('🗄️ BACKEND - Doctores encontrados (getDoctors):', result);
    console.log('📊 BACKEND - Número de doctores (getDoctors):', result.length);

    if (result.length === 0) {
      console.log('⚠️ BACKEND - No se encontraron doctores');
      return res.status(404).json({ message: 'No doctors' });
    } else {
      console.log('✅ BACKEND - Enviando doctores');
      res.json(result);
    }
  } catch (error) {
    console.log('💥 BACKEND - Error en getDoctors:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const [dni] = req.body;
    const [result] = await pool.query(
      `SELECT doc.dni AS DNI, u.firstName, u.lastName, u.email 
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.dni = ? AND doc.status = 'Habilitado'`,
      [dni]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    console.log('👨‍⚕️ BACKEND - getDoctorById: Inicio de función');
    const { doctorId } = req.params;
    console.log('📋 BACKEND - getDoctorById: Doctor ID recibido:', doctorId);
    const [result] = await pool.query(
      `SELECT u.firstName, u.lastName, u.email, doc.dni, doc.appointmentDuration, doc.password, u.phone, u.address, u.idInsuranceCompany, ic.name AS insuranceCompany
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       INNER JOIN insurance_companies ic ON u.idInsuranceCompany = ic.idInsuranceCompany
       WHERE doc.idDoctor = ? AND doc.status = 'Habilitado'`,
      [doctorId]
    );
    console.log('🗄️ BACKEND - getDoctorById: Resultado de la query:', result);
    if (result.length === 0) {
      console.log('⚠️ BACKEND - getDoctorById: Doctor no encontrado');
      return res.status(404).json({ message: 'Doctor not found' });
    } else {
      console.log(
        '✅ BACKEND - getDoctorById: Doctor encontrado, enviando datos'
      );
      res.json(result[0]);
    }
  } catch (error) {
    console.error('💥 BACKEND - getDoctorById: Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDniContra = async (req, res) => {
  try {
    const { dni, password } = req.body;
    const [result] = await pool.query(
      `SELECT doc.idDoctor, u.firstName, u.lastName
       FROM doctors doc 
       INNER JOIN users u ON doc.dni = u.dni
       WHERE doc.dni = ? AND doc.password = ? AND doc.status = 'Habilitado'`,
      [dni, password]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    } else {
      const token = jwt.sign(
        {
          idDoctor: result[0].idDoctor,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
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
  const { dni, appointmentDuration, password } = req.body;
  const status = 'Habilitado';
  try {
    const [result] = await pool.query(
      'INSERT INTO doctors (dni, appointmentDuration, password, status) VALUES (?, ?, ?,?)',
      [dni, appointmentDuration, password, status]
    );

    const idDoctor = result.insertId;

    res.json({
      idDoctor,
      dni,
      appointmentDuration,
      password,
      status,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    // Start a transaction to ensure consistency in updates
    await pool.query('START TRANSACTION');

    // Update doctor status to "Deshabilitado"
    const [resultDoctor] = await pool.query(
      'UPDATE doctors SET status = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );

    // If doctor not found, return error
    if (resultDoctor.affectedRows === 0) {
      // If doctor doesn't exist, rollback transaction
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update status of combinations in sitedoctorspecialty table to "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sitedoctorspecialty SET status = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );
    const [resultHorario] = await pool.query(
      'UPDATE available_schedules SET status = "Deshabilitado" WHERE idDoctor = ?',
      [idDoctor]
    );
    // Commit transaction if everything went well
    await pool.query('COMMIT');

    // If transaction was successful, return 204 No Content
    return res.sendStatus(204); // No content to return, but operation was successful
  } catch (error) {
    // If an error occurs, rollback transaction
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { idDoctor } = req.params;
  const { appointmentDuration, password } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE doctors SET appointmentDuration = ?, password = ? WHERE idDoctor = ?',
      [appointmentDuration, password, idDoctor]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ idDoctor, appointmentDuration, password });
    console.log('Doctor updated:');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
