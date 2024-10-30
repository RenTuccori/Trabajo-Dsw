import { pool } from '../db.js';
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const { usuario, contra } = req.body;
    const [result] = await pool.query(`SELECT idAdmin FROM 
        admin ad
        WHERE ad.usuario = ? and ad.contra = ?`,
      [
        usuario, contra,
      ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      const token = jwt.sign({ idAdmin: result[0].idAdmin }, "CLAVE_SUPER_SEGURISIMA", { expiresIn: "30m" });
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSeEspDoc = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;
    const estado = 'Habilitado';

    // Primero, validar si la combinación ya existe
    const result = await pool.query(
      'SELECT * FROM sededoctoresp WHERE idSede = ? AND idEspecialidad = ? AND idDoctor = ?',
      [idSede, idEspecialidad, idDoctor]
    );

    if (result[0].length > 0) {
      return res.status(400).json({ message: 'Ya existe una asignación con esta combinación de sede, especialidad y doctor.' });
    }

    // Si no existe, proceder a insertar
    await pool.query(
      'INSERT INTO sededoctoresp (idSede, idEspecialidad, idDoctor, estado) VALUES (?, ?, ?, ?)',
      [idSede, idEspecialidad, idDoctor, estado]
    );

    res.json({
      message: 'Asignación creada con éxito.',
      idSede,
      idEspecialidad,
      idDoctor,
      estado
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
      [ idSede, idDoctor, idEspecialidad]
    );

    // Verificar si la combinación de sede, especialidad y doctor existe
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
        s.nombre AS nombreSede,
        e.nombre AS nombreEspecialidad,
        u.nombre AS nombreDoctor,
        sd.idSede,
        sd.idEspecialidad,
        sd.idDoctor,
        u.apellido as apellidoDoctor
      FROM
        sededoctoresp sd
      INNER JOIN
        sedes s ON sd.idSede = s.idSede
      INNER JOIN
        especialidades e ON sd.idEspecialidad = e.idEspecialidad
      INNER JOIN
        doctores d ON sd.idDoctor = d.idDoctor
	Inner join
    usuarios u on d.dni = u.dni
    where sd.estado = 'Habilitado'
      order by s.nombre, e.nombre, u.apellido
    `;

    const [result] = await pool.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron asignaciones.' });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createHorarios = async (req, res) => {
    const { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado } = req.body;
    try {
    await pool.query(
      'INSERT INTO horarios_disponibles (idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado] // Asegúrate de que los nombres de las columnas sean correctos
    );
    return res.status(201).json({ message: 'Horario creado exitosamente.' });
  } catch (error) {
    console.error(error); // Agregar un log para ver errores en el servidor
    return res.status(500).json({ message: 'Error al crear el horario.' });
  }
};

export const updateHorarios = async (req, res) => {
  try {
    const { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado } = req.body;
    console.log(req.body);
    // La consulta SQL para actualizar el horario
    const [result] = await pool.query(
      'UPDATE horarios_disponibles SET hora_inicio = ?, hora_fin = ?, estado = ? WHERE idSede = ? AND idDoctor = ? AND idEspecialidad = ? AND dia = ?',
      [hora_inicio, hora_fin, estado, idSede, idDoctor, idEspecialidad, dia]
    );
    // Los valores que se van a insertar en la consulta
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Horario actualizado exitosamente' });
    } else {
      return res.status(404).json({ message: 'No se encontró un horario con esos datos' });
    }

  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    return res.status(500).json({ message: 'Error en el servidor al actualizar el horario' });
  }
};

export const getHorariosXDoctor = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;

    // Consulta para obtener los horarios del doctor especificado
    const query = `
    SELECT
        sed.nombre AS nombreSede,  -- Selecciona el nombre de la sede
        usu.nombre AS nombreDoctor,  -- Selecciona el nombre del doctor
        esp.nombre AS nombreEspecialidad,
        dia, hora_inicio, hora_fin
    FROM
        horarios_disponibles hd
    INNER JOIN
        sedes sed ON sed.idSede = hd.idSede
    INNER JOIN
        doctores doc ON doc.idDoctor = hd.idDoctor  -- Asegúrate de que este es el nombre de la tabla de doctores
    INNER JOIN
        especialidades esp ON esp.idEspecialidad = hd.idEspecialidad -- Asegúrate de que este es el nombre de la tabla de especialidades
    INNER JOIN
      usuarios usu on usu.dni = doc.dni
    WHERE
        hd.idDoctor = ? and hd.idEspecialidad = ? and hd.idSede = ? AND hd.estado = 'Habilitado'
    ORDER BY
        hd.dia`;

    const result = await pool.query(query, [idSede, idEspecialidad, idDoctor]);

    // Verificar si se encontraron horarios
    if (result[0].length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios para este doctor.' });
    }

    // Devolver los horarios encontrados
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
