import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

export const getAvailableDatesByDocSpecLoc = async (idDoctor, idEspecialidad, idSede) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT 
        DATE_FORMAT(fe.fechas, "%Y-%m-%d") AS fecha,
        hd.idSede, hd.idDoctor, hd.idEspecialidad, hd.dia,
        hd.hora_inicio AS start_time,
        ADDTIME(hd.hora_inicio, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.hora_fin, doc.duracionTurno
      FROM horarios_disponibles hd
      JOIN doctores doc ON hd.idDoctor = doc.idDoctor
      JOIN fechas fe ON hd.dia = CASE DAYNAME(fe.fechas)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      WHERE hd.idDoctor = ? AND hd.idEspecialidad = ? AND hd.idSede = ?
        AND fe.fechas > CURRENT_DATE()
      UNION ALL
      SELECT ts.fecha, ts.idSede, ts.idDoctor, ts.idEspecialidad, ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin, ts.duracionTurno
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
    )
    SELECT DISTINCT ts.fecha
    FROM time_slots ts
    JOIN usuarios usu ON usu.dni = (SELECT dni FROM doctores WHERE idDoctor = ts.idDoctor)
    LEFT JOIN turnos tur
      ON tur.idDoctor = ts.idDoctor AND tur.idEspecialidad = ts.idEspecialidad
      AND tur.idSede = ts.idSede
      AND ts.dia = CASE DAYNAME(tur.fechaYHora)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.fechaYHora
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
      AND ts.idDoctor = ? AND ts.idEspecialidad = ? AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.nombre, usu.apellido
    ORDER BY ts.fecha
  `, { replacements: [idDoctor, idEspecialidad, idSede, idDoctor, idEspecialidad, idSede] });
  return results;
};

export const getAvailableDatesBySpecLoc = async (idEspecialidad, idSede) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT 
        DATE_FORMAT(fe.fechas, "%Y-%m-%d") AS fecha,
        hd.idSede, hd.idDoctor, hd.idEspecialidad, hd.dia,
        hd.hora_inicio AS start_time,
        ADDTIME(hd.hora_inicio, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.hora_fin, doc.duracionTurno
      FROM horarios_disponibles hd
      JOIN doctores doc ON hd.idDoctor = doc.idDoctor
      JOIN fechas fe ON hd.dia = CASE DAYNAME(fe.fechas)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      WHERE hd.idEspecialidad = ? AND hd.idSede = ?
      UNION ALL
      SELECT ts.fecha, ts.idSede, ts.idDoctor, ts.idEspecialidad, ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin, ts.duracionTurno
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
    )
    SELECT DISTINCT ts.fecha
    FROM time_slots ts
    JOIN usuarios usu ON usu.dni = (SELECT dni FROM doctores WHERE idDoctor = ts.idDoctor)
    LEFT JOIN turnos tur
      ON tur.idDoctor = ts.idDoctor AND tur.idEspecialidad = ts.idEspecialidad
      AND tur.idSede = ts.idSede
      AND ts.dia = CASE DAYNAME(tur.fechaYHora)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.fechaYHora
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
      AND ts.idEspecialidad = ? AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.nombre, usu.apellido
    ORDER BY ts.fecha
  `, { replacements: [idEspecialidad, idSede, idEspecialidad, idSede] });
  return results;
};

export const getAvailableSchedulesByDocSpecLoc = async (idDoctor, idEspecialidad, idSede, fecha) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT hd.idSede, hd.idDoctor, hd.idEspecialidad, hd.dia,
        hd.hora_inicio AS start_time,
        ADDTIME(hd.hora_inicio, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.hora_fin, doc.duracionTurno
      FROM horarios_disponibles hd
      JOIN doctores doc ON hd.idDoctor = doc.idDoctor
      WHERE hd.idDoctor = ? AND hd.idEspecialidad = ? AND hd.idSede = ?
      UNION ALL
      SELECT ts.idSede, ts.idDoctor, ts.idEspecialidad, ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin, ts.duracionTurno
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
    )
    SELECT usu.nombre, usu.apellido, ts.start_time AS hora_inicio, ts.dia
    FROM time_slots ts
    JOIN fechas fe ON ts.dia = CASE DAYNAME(fe.fechas)
      WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
      WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
      WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
      WHEN 'Sunday' THEN 'Domingo' END
    LEFT JOIN turnos tur
      ON tur.idDoctor = ts.idDoctor AND tur.idEspecialidad = ts.idEspecialidad
      AND tur.idSede = ts.idSede
      AND ts.dia = CASE DAYNAME(tur.fechaYHora)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      AND CONCAT(fe.fechas, ' ', ts.start_time) = tur.fechaYHora
    JOIN usuarios usu ON usu.dni = (SELECT dni FROM doctores WHERE idDoctor = ts.idDoctor)
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
      AND ts.idDoctor = ? AND ts.idEspecialidad = ? AND ts.idSede = ?
      AND fe.fechas = ?
    ORDER BY ts.dia, ts.start_time
  `, { replacements: [idDoctor, idEspecialidad, idSede, idDoctor, idEspecialidad, idSede, fecha] });
  return results;
};

export const getAvailableSchedulesBySpecLoc = async (idEspecialidad, idSede, fecha) => {
  const [results] = await sequelize.query(`
    WITH RECURSIVE time_slots AS (
      SELECT hd.idSede, hd.idDoctor, hd.idEspecialidad, hd.dia,
        hd.hora_inicio AS start_time,
        ADDTIME(hd.hora_inicio, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.hora_fin, doc.duracionTurno
      FROM horarios_disponibles hd
      JOIN doctores doc ON hd.idDoctor = doc.idDoctor
      WHERE hd.idEspecialidad = ? AND hd.idSede = ?
      UNION ALL
      SELECT ts.idSede, ts.idDoctor, ts.idEspecialidad, ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin, ts.duracionTurno
      FROM time_slots ts
      WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
    )
    SELECT usu.nombre, usu.apellido, ts.start_time AS hora_inicio, ts.dia
    FROM time_slots ts
    JOIN fechas fe ON ts.dia = CASE DAYNAME(fe.fechas)
      WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
      WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
      WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
      WHEN 'Sunday' THEN 'Domingo' END
    LEFT JOIN turnos tur
      ON tur.idDoctor = ts.idDoctor AND tur.idEspecialidad = ts.idEspecialidad
      AND tur.idSede = ts.idSede
      AND ts.dia = CASE DAYNAME(tur.fechaYHora)
        WHEN 'Monday' THEN 'Lunes' WHEN 'Tuesday' THEN 'Martes'
        WHEN 'Wednesday' THEN 'Miércoles' WHEN 'Thursday' THEN 'Jueves'
        WHEN 'Friday' THEN 'Viernes' WHEN 'Saturday' THEN 'Sábado'
        WHEN 'Sunday' THEN 'Domingo' END
      AND CONCAT(fe.fechas, ' ', ts.start_time) = tur.fechaYHora
    JOIN usuarios usu ON usu.dni = (SELECT dni FROM doctores WHERE idDoctor = ts.idDoctor)
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
      AND ts.idEspecialidad = ? AND ts.idSede = ?
      AND fe.fechas = ?
    ORDER BY ts.dia, ts.start_time
  `, { replacements: [idEspecialidad, idSede, idEspecialidad, idSede, fecha] });
  return results;
};
