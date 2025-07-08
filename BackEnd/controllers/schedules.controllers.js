import { pool } from '../db.js';

export const getAvailableDatesByDoctorSpecialtyVenue = async (req, res) => {
    try {
        console.log('[SCHEDULES] getAvailableDatesByDoctorSpecialtyVenue - Request body:', req.body);
        const { doctorId, specialtyId, venueId } = req.body;
        console.log('[SCHEDULES] Parameters - doctorId:', doctorId, 'specialtyId:', specialtyId, 'venueId:', venueId);
        
        // Verificar si los parámetros existen en la base de datos
        const [doctorCheck] = await pool.query('SELECT * FROM doctors WHERE idDoctor = ?', [doctorId]);
        const [specialtyCheck] = await pool.query('SELECT * FROM specialties WHERE idSpecialty = ?', [specialtyId]);
        const [venueCheck] = await pool.query('SELECT * FROM sites WHERE idSite = ?', [venueId]);
        const [scheduleCheck] = await pool.query('SELECT * FROM available_schedules WHERE idDoctor = ? AND idSpecialty = ? AND idSite = ?', [doctorId, specialtyId, venueId]);
        
        console.log('[SCHEDULES] Doctor exists:', doctorCheck.length > 0 ? 'YES' : 'NO', doctorCheck);
        console.log('[SCHEDULES] Specialty exists:', specialtyCheck.length > 0 ? 'YES' : 'NO', specialtyCheck);
        console.log('[SCHEDULES] Venue exists:', venueCheck.length > 0 ? 'YES' : 'NO', venueCheck);
        console.log('[SCHEDULES] Schedule exists:', scheduleCheck.length > 0 ? 'YES' : 'NO', scheduleCheck);
        
        // Query simplificada para debug
        console.log('[SCHEDULES] Running simplified query first...');
        const [simpleResult] = await pool.query(`
            SELECT 
                DATE_FORMAT(d.dates, "%Y-%m-%d") AS date,
                sch.day,
                sch.startTime,
                sch.endTime,
                DAYNAME(d.dates) as dayName
            FROM available_schedules sch
            JOIN doctors doc ON sch.idDoctor = doc.idDoctor
            JOIN dates d ON sch.day = CASE DAYNAME(d.dates)
                                WHEN 'Monday' THEN 'Lunes'
                                WHEN 'Tuesday' THEN 'Martes'
                                WHEN 'Wednesday' THEN 'Miércoles'
                                WHEN 'Thursday' THEN 'Jueves'
                                WHEN 'Friday' THEN 'Viernes'
                                WHEN 'Saturday' THEN 'Sábado'
                                WHEN 'Sunday' THEN 'Domingo'
                            END
            WHERE sch.idDoctor = ?
              AND sch.idSpecialty = ? 
              AND sch.idSite = ?
              AND d.dates > CURDATE()
            LIMIT 10
        `, [doctorId, specialtyId, venueId]);
        console.log('[SCHEDULES] Simple query result:', simpleResult.length, 'rows', simpleResult);
        
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
    SELECT 
        DATE_FORMAT(d.dates, "%Y-%m-%d") AS date,
        sch.idSite AS venueId,
        sch.idDoctor AS doctorId,
        sch.idSpecialty AS specialtyId,
        sch.day,
        sch.startTime AS startTime,
        ADDTIME(sch.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS calculatedEndTime,
        sch.endTime AS maxEndTime,
        doc.appointmentDuration
    FROM available_schedules sch
    JOIN doctors doc
        ON sch.idDoctor = doc.idDoctor
    JOIN dates d 
        ON sch.day = CASE DAYNAME(d.dates)
                        WHEN 'Monday' THEN 'Lunes'
                        WHEN 'Tuesday' THEN 'Martes'
                        WHEN 'Wednesday' THEN 'Miércoles'
                        WHEN 'Thursday' THEN 'Jueves'
                        WHEN 'Friday' THEN 'Viernes'
                        WHEN 'Saturday' THEN 'Sábado'
                        WHEN 'Sunday' THEN 'Domingo'
                    END
    WHERE sch.idDoctor = ?
      AND sch.idSpecialty = ? 
      AND sch.idSite = ?
      AND d.dates > current_date()

    UNION ALL

    SELECT 
        ts.date,
        ts.venueId,
        ts.doctorId,
        ts.specialtyId,
        ts.day,
        ts.calculatedEndTime AS startTime,
        ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) AS calculatedEndTime,
        ts.maxEndTime,
        ts.appointmentDuration
    FROM time_slots ts
    WHERE ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.maxEndTime
)
SELECT DISTINCT
    ts.date
FROM 
    time_slots ts
JOIN users u 
    ON u.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.doctorId)
LEFT JOIN appointments a
    ON a.idDoctor = ts.doctorId
    AND a.idSpecialty = ts.specialtyId
    AND a.idSite = ts.venueId
    AND ts.day = CASE DAYNAME(a.dateTime)
                    WHEN 'Monday' THEN 'Lunes'
                    WHEN 'Tuesday' THEN 'Martes'
                    WHEN 'Wednesday' THEN 'Miércoles'
                    WHEN 'Thursday' THEN 'Jueves'
                    WHEN 'Friday' THEN 'Viernes'
                    WHEN 'Saturday' THEN 'Sábado'
                    WHEN 'Sunday' THEN 'Domingo'
                END
    AND CONCAT(ts.date, ' ', ts.startTime) = a.dateTime
    WHERE (a.idAppointment IS NULL OR a.cancellationDate IS NOT NULL)
    AND ts.doctorId = ?
    AND ts.specialtyId = ?
    AND ts.venueId = ?
    GROUP BY ts.date, ts.day, u.firstName, u.lastName 
    ORDER BY ts.date;
        `, [doctorId, specialtyId, venueId, doctorId, specialtyId, venueId]);
        console.log('[SCHEDULES] Query executed, result count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('[SCHEDULES] Error in getAvailableDatesByDoctorSpecialtyVenue:', error.message);
        res.status(500).json({ message: "Server error", details: error.message });
    }
}

//Available dates for all doctors and one specialty and one venue
export const getAvailableDatesBySpecialtyVenue = async (req, res) => {
    try {
        console.log('[SCHEDULES] getAvailableDatesBySpecialtyVenue - Request body:', req.body);
        const { specialtyId, venueId } = req.body;
        console.log('[SCHEDULES] Parameters - specialtyId:', specialtyId, 'venueId:', venueId);
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                DATE_FORMAT(d.dates, "%Y-%m-%d") AS date,
                sch.idSite AS venueId,
                sch.idDoctor AS doctorId,
                sch.idSpecialty AS specialtyId,
                sch.day,
                sch.startTime AS startTime,
                ADDTIME(sch.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS calculatedEndTime,
                sch.endTime AS maxEndTime,
                doc.appointmentDuration
            FROM available_schedules sch
            JOIN doctors doc
                ON sch.idDoctor = doc.idDoctor
            JOIN dates d 
                ON sch.day = CASE DAYNAME(d.dates)
                                WHEN 'Monday' THEN 'Lunes'
                                WHEN 'Tuesday' THEN 'Martes'
                                WHEN 'Wednesday' THEN 'Miércoles'
                                WHEN 'Thursday' THEN 'Jueves'
                                WHEN 'Friday' THEN 'Viernes'
                                WHEN 'Saturday' THEN 'Sábado'
                                WHEN 'Sunday' THEN 'Domingo'
                            END
            WHERE sch.idSpecialty = ? 
              AND sch.idSite = ?
              AND d.dates > current_date()

            UNION ALL

            SELECT 
                ts.date,
                ts.venueId,
                ts.doctorId,
                ts.specialtyId,
                ts.day,
                ts.calculatedEndTime AS startTime,
                ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) AS calculatedEndTime,
                ts.maxEndTime,
                ts.appointmentDuration
            FROM time_slots ts
            WHERE ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.maxEndTime
        )
        SELECT DISTINCT
            ts.date
        FROM 
            time_slots ts
        JOIN users u 
            ON u.dni = (SELECT dni FROM doctors WHERE idDoctor = ts.doctorId)
        LEFT JOIN appointments a
            ON a.idDoctor = ts.doctorId
            AND a.idSpecialty = ts.specialtyId
            AND a.idSite = ts.venueId
            AND ts.day = CASE DAYNAME(a.dateTime)
                            WHEN 'Monday' THEN 'Lunes'
                            WHEN 'Tuesday' THEN 'Martes'
                            WHEN 'Wednesday' THEN 'Miércoles'
                            WHEN 'Thursday' THEN 'Jueves'
                            WHEN 'Friday' THEN 'Viernes'
                            WHEN 'Saturday' THEN 'Sábado'
                            WHEN 'Sunday' THEN 'Domingo'
                        END
            AND CONCAT(ts.date, ' ', ts.startTime) = a.dateTime
            WHERE (a.idAppointment IS NULL OR a.cancellationDate IS NOT NULL)
            AND ts.specialtyId = ?
            AND ts.venueId = ?
            GROUP BY ts.date, ts.day, u.firstName, u.lastName  -- Group by date and day
            ORDER BY ts.date;
        `,
            [specialtyId, venueId, specialtyId, venueId]);
        console.log('[SCHEDULES] Query executed, result count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('[SCHEDULES] Error in getAvailableDatesBySpecialtyVenue:', error.message);
        res.status(500).json({ message: "Server error", details: error.message });
    }
}

//Available schedules by doctor, specialty and venue
export const getAvailableSchedulesByDoctorSpecialtyVenue = async (req, res) => {
    try {
        console.log('[SCHEDULES] getAvailableSchedulesByDoctorSpecialtyVenue - Request body:', req.body);
        const { doctorId, specialtyId, venueId, date } = req.body;
        console.log('[SCHEDULES] Parameters - doctorId:', doctorId, 'specialtyId:', specialtyId, 'venueId:', venueId, 'date:', date);
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                sch.idSite AS venueId,
                sch.idDoctor AS doctorId,
                sch.idSpecialty AS specialtyId,
                sch.day,
                sch.startTime AS startTime,
                ADDTIME(sch.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS calculatedEndTime,
                sch.endTime AS maxEndTime,
                doc.appointmentDuration
            FROM available_schedules sch
            JOIN doctors doc
                ON sch.idDoctor = doc.idDoctor
            WHERE sch.idDoctor = ?
              AND sch.idSpecialty = ?
              AND sch.idSite = ?
              AND sch.day = CASE DAYNAME(?)
                                WHEN 'Monday' THEN 'Lunes'
                                WHEN 'Tuesday' THEN 'Martes'
                                WHEN 'Wednesday' THEN 'Miércoles'
                                WHEN 'Thursday' THEN 'Jueves'
                                WHEN 'Friday' THEN 'Viernes'
                                WHEN 'Saturday' THEN 'Sábado'
                                WHEN 'Sunday' THEN 'Domingo'
                            END

            UNION ALL

            SELECT 
                ts.venueId,
                ts.doctorId,
                ts.specialtyId,
                ts.day,
                ts.calculatedEndTime AS startTime,
                ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) AS calculatedEndTime,
                ts.maxEndTime,
                ts.appointmentDuration
            FROM time_slots ts
            WHERE ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.maxEndTime
        )
        SELECT 
            ts.startTime AS startTime
        FROM 
            time_slots ts
        LEFT JOIN appointments a
            ON a.idDoctor = ts.doctorId
            AND a.idSpecialty = ts.specialtyId
            AND a.idSite = ts.venueId
            AND CONCAT(?, ' ', ts.startTime) = a.dateTime
            WHERE (a.idAppointment IS NULL OR a.cancellationDate IS NOT NULL)
            ORDER BY ts.startTime;
        `, [doctorId, specialtyId, venueId, date, date]);
        console.log('[SCHEDULES] Query executed, result count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('[SCHEDULES] Error in getAvailableSchedulesByDoctorSpecialtyVenue:', error.message);
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

export const getAvailableSchedulesBySpecialtyVenue = async (req, res) => {
    try {
        console.log('[SCHEDULES] getAvailableSchedulesBySpecialtyVenue - Request body:', req.body);
        const { specialtyId, venueId, date } = req.body;
        console.log('[SCHEDULES] Parameters - specialtyId:', specialtyId, 'venueId:', venueId, 'date:', date);
        const [result] = await pool.query(`
            WITH RECURSIVE time_slots AS (
            SELECT 
                sch.idSite AS venueId,
                sch.idDoctor AS doctorId,
                sch.idSpecialty AS specialtyId,
                sch.day,
                sch.startTime AS startTime,
                ADDTIME(sch.startTime, SEC_TO_TIME(doc.appointmentDuration * 60)) AS calculatedEndTime,
                sch.endTime AS maxEndTime,
                doc.appointmentDuration
            FROM available_schedules sch
            JOIN doctors doc
                ON sch.idDoctor = doc.idDoctor
            WHERE sch.idSpecialty = ?
              AND sch.idSite = ?
              AND sch.day = CASE DAYNAME(?)
                                WHEN 'Monday' THEN 'Lunes'
                                WHEN 'Tuesday' THEN 'Martes'
                                WHEN 'Wednesday' THEN 'Miércoles'
                                WHEN 'Thursday' THEN 'Jueves'
                                WHEN 'Friday' THEN 'Viernes'
                                WHEN 'Saturday' THEN 'Sábado'
                                WHEN 'Sunday' THEN 'Domingo'
                            END

            UNION ALL

            SELECT 
                ts.venueId,
                ts.doctorId,
                ts.specialtyId,
                ts.day,
                ts.calculatedEndTime AS startTime,
                ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) AS calculatedEndTime,
                ts.maxEndTime,
                ts.appointmentDuration
            FROM time_slots ts
            WHERE ADDTIME(ts.calculatedEndTime, SEC_TO_TIME(ts.appointmentDuration * 60)) <= ts.maxEndTime
        )
        SELECT 
            ts.doctorId,
            ts.startTime AS startTime
        FROM 
            time_slots ts
        LEFT JOIN appointments a
            ON a.idDoctor = ts.doctorId
            AND a.idSpecialty = ts.specialtyId
            AND a.idSite = ts.venueId
            AND CONCAT(?, ' ', ts.startTime) = a.dateTime
            WHERE (a.idAppointment IS NULL OR a.cancellationDate IS NOT NULL)
            ORDER BY ts.startTime;
        `, [specialtyId, venueId, date, date]);
        console.log('[SCHEDULES] Query executed, result count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('[SCHEDULES] Error in getAvailableSchedulesBySpecialtyVenue:', error.message);
        res.status(500).json({ message: "Server error", details: error.message });
    }
};