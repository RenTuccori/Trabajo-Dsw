import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getAdmin = async (req, res) => {
  try {
    const { user, password } = req.body;
    const [result] = await pool.query(
      `SELECT idAdmin FROM 
        admin ad
        WHERE ad.user = ? and ad.contra = ?`,
      [user, password]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const token = jwt.sign(
        { idAdmin: result[0].idAdmin, rol: 'Admin' },
        'CLAVE_SUPER_SEGURISIMA',
        { expiresIn: '30m' }
      );
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSeEspDoc = async (req, res) => {
  try {
    const { venueId, specialtyId, doctorId } = req.body;
    const enabledStatus = 'Habilitado';

    // Validate if the combination already exists
    const result = await pool.query(
      'SELECT * FROM sitedoctorspecialty WHERE idSite = ? AND idSpecialty = ? AND idDoctor = ?',
      [venueId, specialtyId, doctorId]
    );

    if (result[0].length > 0) {
      const currentRecord = result[0][0];

      if (currentRecord.status === enabledStatus) {
        // If enabled, do nothing
        return res
          .status(200)
          .json({ message: 'The combination is already enabled.' });
      } else {
        // If disabled, enable it
        await pool.query(
          'UPDATE sitedoctorspecialty SET status = ? WHERE idSite = ? AND idSpecialty = ? AND idDoctor = ?',
          [enabledStatus, venueId, specialtyId, doctorId]
        );

        return res
          .status(200)
          .json({ message: 'The combination was successfully enabled.' });
      }
    }

    // If it doesn't exist, create the combination
    await pool.query(
      'INSERT INTO sitedoctorspecialty (idSite, idSpecialty, idDoctor, status) VALUES (?, ?, ?, ?)',
      [venueId, specialtyId, doctorId, enabledStatus]
    );

    res.status(201).json({
      message: 'Assignment created successfully.',
      idSite: venueId,
      idSpecialty: specialtyId,
      idDoctor: doctorId,
      status: enabledStatus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSeEspDoc = async (req, res) => {
  try {
    const { venueId, doctorId, specialtyId } = req.body;
    // Update the status to 'Deshabilitado'
    const [result] = await pool.query(
      'UPDATE sitedoctorspecialty SET status = "Deshabilitado" WHERE idSite = ? AND idDoctor = ? AND idSpecialty = ?',
      [venueId, doctorId, specialtyId]
    );

    // Check if the combination of venue, specialty and doctor exists
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // If the status change was successful
    res.json({ message: 'Assignment disabled successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCombinaciones = async (req, res) => {
  try {
    const query = `
SELECT
        s.name AS venueName,
        sp.name AS specialtyName,
        u.firstName AS doctorFirstName,
        sds.idSite,
        sds.idSpecialty,
        sds.idDoctor,
        u.lastName as doctorLastName
      FROM
        sitedoctorspecialty sds
      INNER JOIN
        sites s ON sds.idSite = s.idSite
      INNER JOIN
        specialties sp ON sds.idSpecialty = sp.idSpecialty
      INNER JOIN
        doctors d ON sds.idDoctor = d.idDoctor
	Inner join
    users u on d.dni = u.dni
    where sds.status = 'Habilitado'
      order by s.name, sp.name, u.lastName
    `;

    const [result] = await pool.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No assignments found.' });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createHorarios = async (req, res) => {
  const { venueId, doctorId, specialtyId, day, startTime, endTime, status } =
    req.body;
  try {
    await pool.query(
      'INSERT INTO available_schedules (idSite, idDoctor, idSpecialty, day, startTime, endTime, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [venueId, doctorId, specialtyId, day, startTime, endTime, status]
    );
    return res.status(201).json({ message: 'Schedule created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating schedule.' });
  }
};

export const updateHorarios = async (req, res) => {
  try {
    const { venueId, doctorId, specialtyId, day, startTime, endTime, status } =
      req.body;
    // SQL query to update the schedule
    const [result] = await pool.query(
      'UPDATE available_schedules SET startTime = ?, endTime = ?, status = ? WHERE idSite = ? AND idDoctor = ? AND idSpecialty = ? AND day = ?',
      [startTime, endTime, status, venueId, doctorId, specialtyId, day]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Schedule updated successfully' });
    } else {
      return res
        .status(404)
        .json({ message: 'No schedule found with that data' });
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ message: 'Server error updating schedule' });
  }
};

export const getHorariosXDoctor = async (req, res) => {
  try {
    const { venueId, specialtyId, doctorId } = req.body;
    // Query to get the doctor's schedules
    const query = `
    SELECT
        s.name AS venueName,
        u.firstName AS doctorFirstName,
        sp.name AS specialtyName,
        day, startTime, endTime
    FROM
        available_schedules sch
    INNER JOIN
        sites s ON s.idSite = sch.idSite
    INNER JOIN
        doctors doc ON doc.idDoctor = sch.idDoctor
    INNER JOIN
        specialties sp ON sp.idSpecialty = sch.idSpecialty
    INNER JOIN
      users u on u.dni = doc.dni
    WHERE
        sch.idSite = ? and sch.idSpecialty = ? and sch.idDoctor = ? AND sch.status = 'Disponible'
    ORDER BY
        sch.day`;

    const result = await pool.query(query, [venueId, specialtyId, doctorId]);

    // Check if schedules were found
    if (result[0].length === 0) {
      return res
        .status(404)
        .json({ message: 'No schedules found for this doctor.' });
    }

    // Return the found schedules
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
