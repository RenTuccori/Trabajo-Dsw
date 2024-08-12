import { pool } from '../db.js';

export const getHorariosDisp = async (req, res) => {
    try {
        const {idDoctor,idEspecialidad,idSede} = req.body;
        const [result] = await pool.query(`
            select hor.iddoctor,hor.idespecialidad,hor.idsede, hor.hora_inicio, hor.dia from horarios_disponibles hor
            left join turnos tur
	        on tur.idDoctor = hor.?
            and tur.idEspecialidad = hor.?
            and tur.idSede = hor.?
            and hor.dia = (CASE DAYNAME(tur.fechaYHora)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END)
	        and hor.hora_inicio = time(tur.fechayhora)
            where tur.idTurno is null or tur.fechaCancelacion is not null
            `,
            [idDoctor,idEspecialidad,idSede]);
            res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
    
