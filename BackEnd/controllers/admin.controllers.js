import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getAdmin = async (req, res) => {
  try {
    const { user, contra } = req.body;
    const [result] = await pool.query(
      `SELECT idAdmin FROM 
        admin ad
        WHERE ad.user = ? and ad.contra = ?`,
      [user, contra]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
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
    const { idSede, idEspecialidad, idDoctor } = req.body;
    const estadoHabilitado = 'Habilitado';

    // Validar si la combinación ya existe
    const result = await pool.query(
      'SELECT * FROM sededoctoresp WHERE idSede = ? AND idEspecialidad = ? AND idDoctor = ?',
      [idSede, idEspecialidad, idDoctor]
    );

    if (result[0].length > 0) {
      const currentRecord = result[0][0];

      if (currentRecord.estado === estadoHabilitado) {
        // Si está habilitado, no hacer nada
        return res
          .status(200)
          .json({ message: 'La combinación ya está habilitada.' });
      } else {
        // Si está deshabilitado, habilitarlo
        await pool.query(
          'UPDATE sededoctoresp SET estado = ? WHERE idSede = ? AND idEspecialidad = ? AND idDoctor = ?',
          [estadoHabilitado, idSede, idEspecialidad, idDoctor]
        );

        return res
          .status(200)
          .json({ message: 'La combinación se habilitó exitosamente.' });
      }
    }

    // Si no existe, crear la combinación
    await pool.query(
      'INSERT INTO sededoctoresp (idSede, idEspecialidad, idDoctor, estado) VALUES (?, ?, ?, ?)',
      [idSede, idEspecialidad, idDoctor, estadoHabilitado]
    );

    res.status(201).json({
      message: 'Asignación creada con éxito.',
      idSede,
      idEspecialidad,
      idDoctor,
      estado: estadoHabilitado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSeEspDoc = async (req, res) => {
  try {
    const { idSede, idDoctor, idEspecialidad } = req.body;
    console.log(req.body);
    // Realizar el update para cambiar el estado a 'Deshabilitado'
    const [result] = await pool.query(
      'UPDATE sededoctoresp SET estado = "Deshabilitado" WHERE idSede = ? AND idDoctor = ? AND idEspecialidad = ?',
      [idSede, idDoctor, idEspecialidad]
    );

    // Verificar si la combinación de venue, specialty y doctor existe
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada.' });
    }

    // Si se realizó el cambio de estado correctamente
    res.json({ message: 'Asignación deshabilitada con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCombinaciones = async (req, res) => {
  try {
    const query = `
SELECT
        s.first_name AS nombreSede,
        e.first_name AS nombreEspecialidad,
        u.first_name AS nombreDoctor,
        sd.idSede,
        sd.idEspecialidad,
        sd.idDoctor,
        u.last_name as apellidoDoctor
      FROM
        sededoctoresp sd
      INNER JOIN
        venues s ON sd.idSede = s.idSede
      INNER JOIN
        specialties e ON sd.idEspecialidad = e.idEspecialidad
      INNER JOIN
        doctors d ON sd.idDoctor = d.idDoctor
	Inner join
    users u on d.dni = u.dni
    where sd.estado = 'Habilitado'
      order by s.first_name, e.first_name, u.last_name
    `;

    const [result] = await pool.query(query);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'No se encontraron asignaciones.' });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createHorarios = async (req, res) => {
  const {
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    start_time,
    end_time,
    estado,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO horarios_disponibles (idSede, idDoctor, idEspecialidad, dia, start_time, end_time, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idSede, idDoctor, idEspecialidad, dia, start_time, end_time, estado] // Asegúrate de que los nombres de las columnas sean correctos
    );
    return res.status(201).json({ message: 'Horario creado exitosamente.' });
  } catch (error) {
    console.error(error); // Agregar un log para ver errores en el servidor
    return res.status(500).json({ message: 'Error al crear el schedule.' });
  }
};

export const updateHorarios = async (req, res) => {
  try {
    const {
      idSede,
      idDoctor,
      idEspecialidad,
      dia,
      start_time,
      end_time,
      estado,
    } = req.body;
    console.log(req.body);
    // La consulta SQL para actualizar el schedule
    const [result] = await pool.query(
      'UPDATE horarios_disponibles SET start_time = ?, end_time = ?, estado = ? WHERE idSede = ? AND idDoctor = ? AND idEspecialidad = ? AND dia = ?',
      [start_time, end_time, estado, idSede, idDoctor, idEspecialidad, dia]
    );
    // Los valores que se van a insertar en la consulta
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: 'Horario actualizado exitosamente' });
    } else {
      return res
        .status(404)
        .json({ message: 'No se encontró un schedule con esos datos' });
    }
  } catch (error) {
    console.error('Error al actualizar el schedule:', error);
    return res
      .status(500)
      .json({ message: 'Error en el servidor al actualizar el schedule' });
  }
};

export const getHorariosXDoctor = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;
    // Consulta para obtener los schedules del doctor especificado
    const query = `
    SELECT
        sed.first_name AS nombreSede,  -- Selecciona el first_name de la venue
        usu.first_name AS nombreDoctor,  -- Selecciona el first_name del doctor
        esp.first_name AS nombreEspecialidad,
        dia, start_time, end_time
    FROM
        horarios_disponibles hd
    INNER JOIN
        venues sed ON sed.idSede = hd.idSede
    INNER JOIN
        doctors doc ON doc.idDoctor = hd.idDoctor  -- Asegúrate de que este es el first_name de la tabla de doctors
    INNER JOIN
        specialties esp ON esp.idEspecialidad = hd.idEspecialidad -- Asegúrate de que este es el first_name de la tabla de specialties
    INNER JOIN
      users usu on usu.dni = doc.dni
    WHERE
        hd.idSede = ? and hd.idEspecialidad = ? and hd.idDoctor = ? AND hd.estado = 'Habilitado'
    ORDER BY
        hd.dia`;

    const result = await pool.query(query, [idSede, idEspecialidad, idDoctor]);

    // Verificar si se encontraron schedules
    if (result[0].length === 0) {
      return res
        .status(404)
        .json({ message: 'No se encontraron schedules para este doctor.' });
    }

    // Devolver los schedules encontrados
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
