import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

export const getAvailableDatesByDocSpecLoc = async (doctorId, specialtyId, locationId) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT 
        DATE_FORMAT(fe.date, "%Y-%m-%d") AS fecha,
        hd.locationId, hd.doctorId, hd.specialtyId, hd.day,
        hd.startTime AS start_time,
        ADDTIME(hd.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS end_time,
        hd.endTime, doc.appointmentDuration
      FROM availableschedules hd
      JOIN doctors doc ON hd.doctorId = doc.id
      JOIN dates fe ON hd.day = DAYNAME(fe.date)
      WHERE hd.doctorId = ? AND hd.specialtyId = ? AND hd.locationId = ?
        AND hd.status = 'Available'
        AND fe.date > CURRENT_DATE()
      UNION ALL
      SELECT ts.fecha, ts.locationId, ts.doctorId, ts.specialtyId, ts.day,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) AS end_time,
        ts.endTime, ts.appointmentDuration
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.endTime
    )
    SELECT DISTINCT ts.fecha
    FROM time_slots ts
    JOIN users usu ON usu.nationalId = (SELECT nationalId FROM doctors WHERE id = ts.doctorId)
    LEFT JOIN appointments tur
      ON tur.doctorId = ts.doctorId AND tur.specialtyId = ts.specialtyId
      AND tur.locationId = ts.locationId
      AND ts.day = DAYNAME(tur.dateTime)
      AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.dateTime
    WHERE (tur.id IS NULL OR tur.cancellationDate IS NOT NULL)
      AND ts.doctorId = ? AND ts.specialtyId = ? AND ts.locationId = ?
    GROUP BY ts.fecha, ts.day, usu.firstName, usu.lastName
    ORDER BY ts.fecha
  `, { replacements: [doctorId, specialtyId, locationId, doctorId, specialtyId, locationId] });
  return results;
};

export const getAvailableDatesBySpecLoc = async (specialtyId, locationId) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT 
        DATE_FORMAT(fe.date, "%Y-%m-%d") AS fecha,
        hd.locationId, hd.doctorId, hd.specialtyId, hd.day,
        hd.startTime AS start_time,
        ADDTIME(hd.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS end_time,
        hd.endTime, doc.appointmentDuration
      FROM availableschedules hd
      JOIN doctors doc ON hd.doctorId = doc.id
      JOIN dates fe ON hd.day = DAYNAME(fe.date)
      WHERE hd.specialtyId = ? AND hd.locationId = ?
        AND hd.status = 'Available'
      UNION ALL
      SELECT ts.fecha, ts.locationId, ts.doctorId, ts.specialtyId, ts.day,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) AS end_time,
        ts.endTime, ts.appointmentDuration
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.endTime
    )
    SELECT DISTINCT ts.fecha
    FROM time_slots ts
    JOIN users usu ON usu.nationalId = (SELECT nationalId FROM doctors WHERE id = ts.doctorId)
    LEFT JOIN appointments tur
      ON tur.doctorId = ts.doctorId AND tur.specialtyId = ts.specialtyId
      AND tur.locationId = ts.locationId
      AND ts.day = DAYNAME(tur.dateTime)
      AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.dateTime
    WHERE (tur.id IS NULL OR tur.cancellationDate IS NOT NULL)
      AND ts.specialtyId = ? AND ts.locationId = ?
    GROUP BY ts.fecha, ts.day, usu.firstName, usu.lastName
    ORDER BY ts.fecha
  `, { replacements: [specialtyId, locationId, specialtyId, locationId] });
  return results;
};

export const getAvailableSchedulesByDocSpecLoc = async (doctorId, specialtyId, locationId, fecha) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT hd.locationId, hd.doctorId, hd.specialtyId, hd.day,
        hd.startTime AS start_time,
        ADDTIME(hd.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS end_time,
        hd.endTime, doc.appointmentDuration
      FROM availableschedules hd
      JOIN doctors doc ON hd.doctorId = doc.id
      WHERE hd.doctorId = ? AND hd.specialtyId = ? AND hd.locationId = ?
        AND hd.status = 'Available'
      UNION ALL
      SELECT ts.locationId, ts.doctorId, ts.specialtyId, ts.day,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) AS end_time,
        ts.endTime, ts.appointmentDuration
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.endTime
    )
    SELECT usu.firstName, usu.lastName, ts.start_time AS startTime, ts.day
    FROM time_slots ts
    JOIN dates fe ON ts.day = DAYNAME(fe.date)
    LEFT JOIN appointments tur
      ON tur.doctorId = ts.doctorId AND tur.specialtyId = ts.specialtyId
      AND tur.locationId = ts.locationId
      AND ts.day = DAYNAME(tur.dateTime)
      AND CONCAT(fe.date, ' ', ts.start_time) = tur.dateTime
    JOIN users usu ON usu.nationalId = (SELECT nationalId FROM doctors WHERE id = ts.doctorId)
    WHERE (tur.id IS NULL OR tur.cancellationDate IS NOT NULL)
      AND ts.doctorId = ? AND ts.specialtyId = ? AND ts.locationId = ?
      AND fe.date = ?
    ORDER BY ts.day, ts.start_time
  `, { replacements: [doctorId, specialtyId, locationId, doctorId, specialtyId, locationId, fecha] });
  return results;
};

export const getAvailableSchedulesBySpecLoc = async (specialtyId, locationId, fecha) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT hd.locationId, hd.doctorId, hd.specialtyId, hd.day,
        hd.startTime AS start_time,
        ADDTIME(hd.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS end_time,
        hd.endTime, doc.appointmentDuration
      FROM availableschedules hd
      JOIN doctors doc ON hd.doctorId = doc.id
      WHERE hd.specialtyId = ? AND hd.locationId = ?
        AND hd.status = 'Available'
      UNION ALL
      SELECT ts.locationId, ts.doctorId, ts.specialtyId, ts.day,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) AS end_time,
        ts.endTime, ts.appointmentDuration
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.endTime
    )
    SELECT usu.firstName, usu.lastName, ts.start_time AS startTime, ts.day
    FROM time_slots ts
    JOIN dates fe ON ts.day = DAYNAME(fe.date)
    LEFT JOIN appointments tur
      ON tur.doctorId = ts.doctorId AND tur.specialtyId = ts.specialtyId
      AND tur.locationId = ts.locationId
      AND ts.day = DAYNAME(tur.dateTime)
      AND CONCAT(fe.date, ' ', ts.start_time) = tur.dateTime
    JOIN users usu ON usu.nationalId = (SELECT nationalId FROM doctors WHERE id = ts.doctorId)
    WHERE (tur.id IS NULL OR tur.cancellationDate IS NOT NULL)
      AND ts.specialtyId = ? AND ts.locationId = ?
      AND fe.date = ?
    ORDER BY ts.day, ts.start_time
  `, { replacements: [specialtyId, locationId, specialtyId, locationId, fecha] });
  return results;
};
