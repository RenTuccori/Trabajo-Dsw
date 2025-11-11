import { pool } from '../db.js';
import sequelize from '../models/index.js';

//Fechas disponibles por un medico, especialidad y sede
export const getFechasDispDocEspSed = async (req, res) => {
    try {
        const { idDoctor, idEspecialidad, idSede } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
    SELECT 
        DATE_FORMAT(fe.date, "%Y-%m-%d") AS fecha,
        hd.location_id as idSede,
        hd.doctor_id as idDoctor,
        hd.specialty_id as idEspecialidad,
        hd.day as dia,
        hd.start_time AS start_time,
        ADDTIME(hd.start_time, SEC_TO_TIME(doc.appointment_duration * 60)) AS end_time,
        hd.end_time as hora_fin,
        doc.appointment_duration as duracionTurno
    FROM available_schedules hd
    JOIN doctors doc
        ON hd.doctor_id = doc.id
    JOIN dates fe 
        ON hd.day = CASE DAYNAME(fe.date)
                        WHEN 'Monday' THEN 'Lunes'
                        WHEN 'Tuesday' THEN 'Martes'
                        WHEN 'Wednesday' THEN 'Miércoles'
                        WHEN 'Thursday' THEN 'Jueves'
                        WHEN 'Friday' THEN 'Viernes'
                        WHEN 'Saturday' THEN 'Sábado'
                        WHEN 'Sunday' THEN 'Domingo'
                    END
    WHERE hd.doctor_id = ?
      AND hd.specialty_id = ? 
      AND hd.location_id = ?
      AND fe.date > current_date()

    UNION ALL

    SELECT 
        ts.fecha,
        ts.idSede,
        ts.idDoctor,
        ts.idEspecialidad,
        ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin,
        ts.duracionTurno
    FROM time_slots ts
    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
)
SELECT DISTINCT
    ts.fecha  -- Obtener el horario mínimo
FROM 
    time_slots ts
JOIN users usu 
    ON usu.dni = (SELECT dni FROM doctors WHERE id = ts.idDoctor)
LEFT JOIN appointments tur
    ON tur.doctor_id = ts.idDoctor
    AND tur.specialty_id = ts.idEspecialidad
    AND tur.location_id = ts.idSede
    AND ts.dia = CASE DAYNAME(tur.date_time)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
    AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.date_time
    WHERE (tur.id IS NULL OR tur.cancellation_date IS NOT NULL)
    AND ts.idDoctor = ?
    AND ts.idEspecialidad = ?
    AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.first_name, usu.last_name 
    ORDER BY ts.fecha;
        `, [idDoctor, idEspecialidad, idSede, idDoctor, idEspecialidad, idSede]);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Fechas disponibles para todos los medicos y una especialidad y una sede
export const getFechasDispEspSed = async (req, res) => {
    try {
        const { idEspecialidad, idSede } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
    SELECT 
        DATE_FORMAT(fe.date, "%Y-%m-%d") AS fecha,
        hd.location_id as idSede,
        hd.doctor_id as idDoctor,
        hd.specialty_id as idEspecialidad,
        hd.day as dia,
        hd.start_time AS start_time,
        ADDTIME(hd.start_time, SEC_TO_TIME(doc.appointment_duration * 60)) AS end_time,
        hd.end_time as hora_fin,
        doc.appointment_duration as duracionTurno
    FROM available_schedules hd
    JOIN doctors doc
        ON hd.doctor_id = doc.id
    JOIN dates fe 
        ON hd.day = CASE DAYNAME(fe.date)
                        WHEN 'Monday' THEN 'Lunes'
                        WHEN 'Tuesday' THEN 'Martes'
                        WHEN 'Wednesday' THEN 'Miércoles'
                        WHEN 'Thursday' THEN 'Jueves'
                        WHEN 'Friday' THEN 'Viernes'
                        WHEN 'Saturday' THEN 'Sábado'
                        WHEN 'Sunday' THEN 'Domingo'
                    END
    WHERE hd.idEspecialidad = ?
      AND hd.idSede = ?

    UNION ALL

    SELECT 
        ts.fecha,
        ts.idSede,
        ts.idDoctor,
        ts.idEspecialidad,
        ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.hora_fin,
        ts.duracionTurno
    FROM time_slots ts
    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
)
    SELECT DISTINCT
    ts.fecha  
    FROM 
    time_slots ts
    JOIN users usu 
    ON usu.dni = (SELECT dni FROM doctors WHERE id = ts.idDoctor)
    LEFT JOIN appointments tur
    ON tur.doctor_id = ts.idDoctor
    AND tur.specialty_id = ts.idEspecialidad
    AND tur.location_id = ts.idSede
    AND ts.dia = CASE DAYNAME(tur.date_time)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
    AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.date_time
    WHERE (tur.id IS NULL OR tur.cancellation_date IS NOT NULL)
    AND ts.idEspecialidad = ?
    AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.first_name, usu.last_name  -- Agrupar por fecha y día
    ORDER BY ts.fecha;`,
            [idEspecialidad, idSede, idEspecialidad, idSede]);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Horarios disponibles por medico, especialidad y sede
export const getHorariosDispDocEspSed = async (req, res) => {
    try {
        const { idDoctor, idEspecialidad, idSede, fecha } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                hd.location_id as idSede,
                hd.doctor_id as idDoctor,
                hd.specialty_id as idEspecialidad,
                hd.day as dia,
                hd.start_time AS start_time,
                ADDTIME(hd.start_time, SEC_TO_TIME(doc.appointment_duration * 60)) AS end_time,
                hd.end_time as hora_fin,
                doc.appointment_duration as duracionTurno
            FROM available_schedules hd
            JOIN doctors doc
                    ON hd.doctor_id = doc.id
                    WHERE hd.doctor_id = ?
                    AND hd.specialty_id = ? 
                    AND hd.location_id = ?
                    UNION ALL
                    SELECT 
                        ts.idSede,
                        ts.idDoctor,
                        ts.idEspecialidad,
                        ts.dia,
                        ts.end_time AS start_time,
                        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
                        ts.hora_fin,
                        ts.duracionTurno
                    FROM time_slots ts
                    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
                )
                SELECT 
                    usu.first_name as nombre, 
                    usu.last_name as apellido, 
                    ts.start_time AS hora_inicio, 
                    ts.dia 
                FROM 
                    time_slots ts
                JOIN dates fe 
                    ON ts.dia = CASE DAYNAME(fe.date)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                    END
                    LEFT JOIN appointments tur
                    ON tur.doctor_id = ts.idDoctor
                    AND tur.specialty_id = ts.idEspecialidad
                    AND tur.location_id = ts.idSede
                    AND ts.dia = CASE DAYNAME(tur.date_time)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
            AND CONCAT(fe.date, ' ', ts.start_time) = tur.date_time
        JOIN users usu 
            ON usu.dni = (SELECT dni FROM doctors WHERE id = ts.idDoctor)
        WHERE (tur.id IS NULL OR tur.cancellation_date IS NOT NULL)
        AND ts.idDoctor = ?
        AND ts.idEspecialidad = ?
        AND ts.idSede = ?
        AND fe.date = ?
        ORDER BY ts.dia, ts.start_time;
        `, [idDoctor, idEspecialidad, idSede, idDoctor, idEspecialidad, idSede, fecha]);

        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getHorariosDispEspSed = async (req, res) => {
    try {
        const { idEspecialidad, idSede, fecha } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                hd.location_id as idSede,
                hd.doctor_id as idDoctor,
                hd.specialty_id as idEspecialidad,
                hd.day as dia,
                hd.start_time AS start_time,
                ADDTIME(hd.start_time, SEC_TO_TIME(doc.appointment_duration * 60)) AS end_time,
                hd.end_time as hora_fin,
                doc.appointment_duration as duracionTurno
            FROM available_schedules hd
            JOIN doctors doc
                    ON hd.doctor_id = doc.id
                    WHERE hd.specialty_id = ? 
                    AND hd.location_id = ?
                    UNION ALL
                    SELECT 
                        ts.idSede,
                        ts.idDoctor,
                        ts.idEspecialidad,
                        ts.dia,
                        ts.end_time AS start_time,
                        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
                        ts.hora_fin,
                        ts.duracionTurno
                    FROM time_slots ts
                    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.hora_fin
                )
                SELECT 
                    usu.first_name as nombre, 
                    usu.last_name as apellido, 
                    ts.start_time AS hora_inicio, 
                    ts.dia 
                FROM 
                    time_slots ts
                JOIN dates fe 
                    ON ts.dia = CASE DAYNAME(fe.date)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                    END
                    LEFT JOIN appointments tur
                    ON tur.doctor_id = ts.idDoctor
                    AND tur.specialty_id = ts.idEspecialidad
                    AND tur.location_id = ts.idSede
                    AND ts.dia = CASE DAYNAME(tur.date_time)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
            AND CONCAT(fe.date, ' ', ts.start_time) = tur.date_time
        JOIN users usu 
            ON usu.dni = (SELECT dni FROM doctors WHERE id = ts.idDoctor)
        WHERE (tur.id IS NULL OR tur.cancellation_date IS NOT NULL)
        AND ts.idEspecialidad = ?
        AND ts.idSede = ?
        AND fe.date = ?
        ORDER BY ts.dia, ts.start_time;
        `, [idEspecialidad, idSede, idEspecialidad, idSede, fecha]);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};