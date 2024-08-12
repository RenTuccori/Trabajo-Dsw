import { pool } from '../db.js';

//Horarios disponibles por medico, especialidad y sede
export const getHorariosDispDocEspSed = async (req, res) => {
    try {
        const {idDoctor,idEspecialidad,idSede} = req.body;
        const [result] = await pool.query(`
            select DATE_FORMAT(fe.fechas, "%Y-%m-%d") as fecha, hor.hora_inicio, hor.dia from horarios_disponibles hor
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
   
//Horarios disponibles por especialidad y sede
export const getHorariosDispEspSed = async (req, res) => {
        try {
        const {idEspecialidad,idSede} = req.body;
        const [result] = await pool.query(`
            select usu.nombre, usu.apellido, DATE_FORMAT(fe.fechas, "%Y-%m-%d") as fecha, hor.hora_inicio, hor.dia from horarios_disponibles hor
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