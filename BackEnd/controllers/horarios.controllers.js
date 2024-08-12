import { pool } from '../db.js';

//Fechas disponibles por un medico, especialidad y sede
export const getFechasDispDocEspSed = async (req, res) => {
    try {
        const {idDoctor,idEspecialidad,idSede} = req.body;
        const [result] = await pool.query(`
            select DATE_FORMAT(fe.fechas, "%Y-%m-%d") as fecha from horarios_disponibles hor
            join fechas fe 
            on hor.dia = (CASE DAYNAME(fe.fechas)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END)
            left join turnos tur
	        on tur.idDoctor = hor.idDoctor
            and tur.idEspecialidad = hor.idEspecialidad
            and tur.idSede = hor.idSede
            and hor.dia = (CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END)
	        and CONCAT(fe.fechas, ' ', hor.hora_inicio) = tur.fechayhora
            where (tur.idTurno is null or tur.fechaCancelacion is not null)
            AND hor.idDoctor = ?
            AND hor.idEspecialidad = ?
            AND hor.idSede = ?`,
            [idDoctor,idEspecialidad,idSede]);
            res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
   
//Fechas disponibles para todos los medicos y una especialidad y una sede
export const getFechasDispEspSed = async (req, res) => {
        try {
        const {idEspecialidad,idSede} = req.body;
        const [result] = await pool.query(`
            select usu.nombre, usu.apellido, DATE_FORMAT(fe.fechas, "%Y-%m-%d") as fecha from horarios_disponibles hor
            inner join doctores doc 
            on hor.idDoctor = doc.idDoctor
            inner join usuarios usu 
            on usu.dni = doc.dni
            join fechas fe 
            on hor.dia = (CASE DAYNAME(fe.fechas)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END)
            left join turnos tur
	        on tur.idDoctor = hor.idDoctor
            and tur.idEspecialidad = hor.idEspecialidad
            and tur.idSede = hor.idSede
            and hor.dia = (CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END)
	        and CONCAT(fe.fechas, ' ', hor.hora_inicio) = tur.fechayhora
            where (tur.idTurno is null or tur.fechaCancelacion is not null)
            AND hor.idEspecialidad = ?
            AND hor.idSede = ?`,
            [idEspecialidad,idSede]);
            res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Horarios disponibles por medico, especialidad y sede
export const getHorariosDispDocEspSed = async (req, res) => {
    try {
        const {idDoctor,idEspecialidad,idSede, fecha} = req.body;
        const [result] = await pool.query(`
        
        SET @duracion_turno := 30;

   
    WITH RECURSIVE time_slots AS (
        SELECT 
        hd.idSede,
        hd.idDoctor,
        hd.idEspecialidad,
        hd.dia,
        hd.hora_inicio AS start_time,
        ADDTIME(hd.hora_inicio, SEC_TO_TIME(@duracion_turno * 60)) AS end_time,
        hd.hora_fin
        FROM horarios_disponibles hd
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
        ADDTIME(ts.end_time, SEC_TO_TIME(@duracion_turno * 60)) AS end_time,
        ts.hora_fin
        FROM time_slots ts
        WHERE ADDTIME(ts.end_time, SEC_TO_TIME(@duracion_turno * 60)) <= ts.hora_fin
    )
        SELECT 
            usu.nombre, 
            usu.apellido, 
            ts.start_time AS hora_inicio, 
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
        LEFT JOIN turnos tur
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
        JOIN usuarios usu 
            ON usu.dni = (SELECT dni FROM doctores WHERE idDoctor = ts.idDoctor)
        WHERE (tur.idTurno IS NULL OR tur.fechaCancelacion IS NOT NULL)
        AND ts.idDoctor = ?
        AND ts.idEspecialidad = ?
        AND ts.idSede = ?
        AND fe.fechas = ?
        ORDER BY ts.dia, ts.start_time;`,
            [idDoctor,idEspecialidad,idSede,fecha]);
            res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
   