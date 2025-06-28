import { pool } from '../db.js';

//Fechas disponibles por un medico, specialty y venue
export const getFechasDispDocEspSed = async (req, res) => {
    try {
        const { idDoctor, idEspecialidad, idSede } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
    SELECT 
        DATE_FORMAT(fe.fechas, "%Y-%m-%d") AS fecha,
        hd.idSede,
        hd.idDoctor,
        hd.idEspecialidad,
        hd.dia,
        hd.start_time AS start_time,
        ADDTIME(hd.start_time, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.end_time,
        doc.duracionTurno
    FROM horarios_disponibles hd
    JOIN doctors doc
        ON hd.idDoctor = doc.idDoctor
    JOIN fechas fe 
        ON hd.dia = CASE DAYNAME(fe.fechas)
                        WHEN 'Monday' THEN 'Lunes'
                        WHEN 'Tuesday' THEN 'Martes'
                        WHEN 'Wednesday' THEN 'Miércoles'
                        WHEN 'Thursday' THEN 'Jueves'
                        WHEN 'Friday' THEN 'Viernes'
                        WHEN 'Saturday' THEN 'Sábado'
                        WHEN 'Sunday' THEN 'Domingo'
                    END
    WHERE hd.idDoctor = ?
      AND hd.idEspecialidad = ? 
      AND hd.idSede = ?
      AND fe.fechas > current_date()

    UNION ALL

    SELECT 
        ts.fecha,
        ts.idSede,
        ts.idDoctor,
        ts.idEspecialidad,
        ts.dia,
        ts.end_time AS start_time,
        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
        ts.end_time,
        ts.duracionTurno
    FROM time_slots ts
    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.end_time
)
SELECT DISTINCT
    ts.fecha  -- Obtener el schedule mínimo
FROM 
    time_slots ts
JOIN users usu 
    ON usu.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.idDoctor)
LEFT JOIN appointments tur
    ON tur.idDoctor = ts.idDoctor
    AND tur.idEspecialidad = ts.idEspecialidad
    AND tur.idSede = ts.idSede
    AND ts.dia = CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
    AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.fechaYHora
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
    AND ts.idDoctor = ?
    AND ts.idEspecialidad = ?
    AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.first_name, usu.last_name 
    ORDER BY ts.fecha;
        `, [idDoctor, idEspecialidad, idSede, idDoctor, idEspecialidad, idSede]);
        [idDoctor, idEspecialidad, idSede];
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Fechas disponibles para todos los medicos y una specialty y una venue
export const getFechasDispEspSed = async (req, res) => {
    try {
        const { idEspecialidad, idSede } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
    SELECT 
        DATE_FORMAT(fe.fechas, "%Y-%m-%d") AS fecha,
        hd.idSede,
        hd.idDoctor,
        hd.idEspecialidad,
        hd.dia,
        hd.start_time AS start_time,
        ADDTIME(hd.start_time, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
        hd.end_time,
        doc.duracionTurno
    FROM horarios_disponibles hd
    JOIN doctors doc
        ON hd.idDoctor = doc.idDoctor
    JOIN fechas fe 
        ON hd.dia = CASE DAYNAME(fe.fechas)
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
        ts.end_time,
        ts.duracionTurno
    FROM time_slots ts
    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.end_time
)
    SELECT DISTINCT
    ts.fecha  
    FROM 
    time_slots ts
    JOIN users usu 
    ON usu.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.idDoctor)
    LEFT JOIN appointments tur
    ON tur.idDoctor = ts.idDoctor
    AND tur.idEspecialidad = ts.idEspecialidad
    AND tur.idSede = ts.idSede
    AND ts.dia = CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
    AND CONCAT(ts.fecha, ' ', ts.start_time) = tur.fechaYHora
    WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
    AND ts.idEspecialidad = ?
    AND ts.idSede = ?
    GROUP BY ts.fecha, ts.dia, usu.first_name, usu.last_name  -- Agrupar por fecha y día
    ORDER BY ts.fecha;`,
            [idEspecialidad, idSede]);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Horarios disponibles por medico, specialty y venue
export const getHorariosDispDocEspSed = async (req, res) => {
    try {
        const { idDoctor, idEspecialidad, idSede, fecha } = req.body;
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                hd.idSede,
                hd.idDoctor,
                hd.idEspecialidad,
                hd.dia,
                hd.start_time AS start_time,
                ADDTIME(hd.start_time, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
                hd.end_time,
                doc.duracionTurno
            FROM horarios_disponibles hd
            JOIN doctors doc
                    ON hd.idDoctor = doc.idDoctor
                    WHERE hd.idDoctor = ?
                    AND hd.idEspecialidad = ? 
                    AND hd.idSede = ?
                    UNION ALL
                    SELECT 
                        ts.idSede,
                        ts.idDoctor,
                        ts.idEspecialidad,
                        ts.dia,
                        ts.end_time AS start_time,
                        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
                        ts.end_time,
                        ts.duracionTurno
                    FROM time_slots ts
                    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.end_time
                )
                SELECT 
                    usu.first_name, 
                    usu.last_name, 
                    ts.start_time AS start_time, 
                    ts.dia 
                FROM 
                    time_slots ts
                JOIN fechas fe 
                    ON ts.dia = CASE DAYNAME(fe.fechas)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                    END
                    LEFT JOIN appointments tur
                    ON tur.idDoctor = ts.idDoctor
                    AND tur.idEspecialidad = ts.idEspecialidad
                    AND tur.idSede = ts.idSede
                    AND ts.dia = CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
            AND CONCAT(fe.fechas, ' ', ts.start_time) = tur.fechaYHora
        JOIN users usu 
            ON usu.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.idDoctor)
        WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
        AND ts.idDoctor = ?
        AND ts.idEspecialidad = ?
        AND ts.idSede = ?
        AND fe.fechas = ?
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
                hd.idSede,
                hd.idDoctor,
                hd.idEspecialidad,
                hd.dia,
                hd.start_time AS start_time,
                ADDTIME(hd.start_time, SEC_TO_TIME(doc.duracionTurno * 60)) AS end_time,
                hd.end_time,
                doc.duracionTurno
            FROM horarios_disponibles hd
            JOIN doctors doc
                    ON hd.idDoctor = doc.idDoctor
                    WHERE hd.idEspecialidad = ? 
                    AND hd.idSede = ?
                    UNION ALL
                    SELECT 
                        ts.idSede,
                        ts.idDoctor,
                        ts.idEspecialidad,
                        ts.dia,
                        ts.end_time AS start_time,
                        ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) AS end_time,
                        ts.end_time,
                        ts.duracionTurno
                    FROM time_slots ts
                    WHERE ADDTIME(ts.end_time, SEC_TO_TIME(ts.duracionTurno * 60)) <= ts.end_time
                )
                SELECT 
                    usu.first_name, 
                    usu.last_name, 
                    ts.start_time AS start_time, 
                    ts.dia 
                FROM 
                    time_slots ts
                JOIN fechas fe 
                    ON ts.dia = CASE DAYNAME(fe.fechas)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                    END
                    LEFT JOIN appointments tur
                    ON tur.idDoctor = ts.idDoctor
                    AND tur.idEspecialidad = ts.idEspecialidad
                    AND tur.idSede = ts.idSede
                    AND ts.dia = CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
            AND CONCAT(fe.fechas, ' ', ts.start_time) = tur.fechaYHora
        JOIN users usu 
            ON usu.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.idDoctor)
        WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
        AND ts.idEspecialidad = ?
        AND ts.idSede = ?
        AND fe.fechas = ?
        ORDER BY ts.dia, ts.start_time;
        `, [idEspecialidad, idSede, idEspecialidad, idSede, fecha]);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};