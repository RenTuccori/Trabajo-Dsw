import { pool } from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './files/estudios/';
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'estudio-' + uniqueSuffix + extension);
  },
});

// Filtro para tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Tipo de archivo no permitido. Solo se permiten: PDF, JPG, JPEG, PNG, DOC, DOCX'
      ),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  },
});

// Crear un nuevo estudio
export const createEstudio = async (req, res) => {
  try {
    const { idPaciente, fechaRealizacion, descripcion } = req.body;

    // Extraer idDoctor del token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      const jwt = await import('jsonwebtoken');
      decodedToken = jwt.default.verify(token, 'CLAVE_SUPER_SEGURISIMA');
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const idDoctor = decodedToken.idDoctor;
    if (!idDoctor) {
      return res
        .status(400)
        .json({ message: 'ID de doctor no encontrado en el token' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'No se ha subido ningún archivo' });
    }

    const fechaCarga = new Date();
    const nombreArchivo = req.file.originalname;
    const rutaArchivo = req.file.path;

    const [result] = await pool.query(
      `INSERT INTO estudios (idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        idDoctor,
        fechaRealizacion,
        fechaCarga,
        nombreArchivo,
        rutaArchivo,
        descripcion,
      ]
    );

    res.status(201).json({
      message: 'Estudio subido exitosamente',
      idEstudio: result.insertId,
      nombreArchivo,
      fechaCarga,
    });
  } catch (error) {
    // Si hay error, eliminar el archivo subido
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al crear estudio:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener estudios por paciente
export const getEstudiosByPaciente = async (req, res) => {
  try {
    const { idPaciente } = req.params;

    const [result] = await pool.query(
      `SELECT e.idEstudio, e.fechaRealizacion, e.fechaCarga, e.nombreArchivo, 
              e.descripcion, CONCAT(u.nombre, ' ', u.apellido) as nombreDoctor
       FROM estudios e
       INNER JOIN doctores d ON e.idDoctor = d.idDoctor
       INNER JOIN usuarios u ON d.dni = u.dni
       WHERE e.idPaciente = ?
       ORDER BY e.fechaCarga DESC`,
      [idPaciente]
    );

    if (result.length === 0) {
      return res.json([]); // Devolver array vacío en lugar de 404
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener estudios:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener estudios por doctor
export const getEstudiosByDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const [result] = await pool.query(
      `SELECT e.idEstudio, e.fechaRealizacion, e.fechaCarga, e.nombreArchivo, 
              e.descripcion, CONCAT(u.nombre, ' ', u.apellido) as nombrePaciente,
              p.dni as dniPaciente
       FROM estudios e
       INNER JOIN pacientes p ON e.idPaciente = p.idPaciente
       INNER JOIN usuarios u ON p.dni = u.dni
       WHERE e.idDoctor = ?
       ORDER BY e.fechaCarga DESC`,
      [idDoctor]
    );

    if (result.length === 0) {
      return res.json([]); // Devolver array vacío en lugar de 404
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener estudios:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Descargar archivo de estudio
export const downloadEstudio = async (req, res) => {
  try {
    const { idEstudio } = req.params;

    const [result] = await pool.query(
      'SELECT rutaArchivo, nombreArchivo FROM estudios WHERE idEstudio = ?',
      [idEstudio]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    const { rutaArchivo, nombreArchivo } = result[0];

    if (!fs.existsSync(rutaArchivo)) {
      return res
        .status(404)
        .json({ message: 'Archivo no encontrado en el servidor' });
    }

    res.download(rutaArchivo, nombreArchivo);
  } catch (error) {
    console.error('Error al descargar estudio:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar estudio
export const deleteEstudio = async (req, res) => {
  try {
    const { idEstudio } = req.params;

    // Primero obtener la ruta del archivo
    const [estudio] = await pool.query(
      'SELECT rutaArchivo FROM estudios WHERE idEstudio = ?',
      [idEstudio]
    );

    if (estudio.length === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    // Eliminar de la base de datos
    await pool.query('DELETE FROM estudios WHERE idEstudio = ?', [idEstudio]);

    // Eliminar archivo físico
    const rutaArchivo = estudio[0].rutaArchivo;
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    res.json({ message: 'Estudio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar estudio:', error);
    return res.status(500).json({ message: error.message });
  }
};
