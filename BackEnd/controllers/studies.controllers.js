import { pool } from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './files/studies/';
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar first_name único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'study-' + uniqueSuffix + extension);
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

// Crear un nuevo study
export const createStudy = async (req, res) => {
  try {
    const { patientId, performanceDate, description } = req.body;

    // Extract idDoctor from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token required' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      const jwt = await import('jsonwebtoken');
      decodedToken = jwt.default.verify(token, 'CLAVE_SUPER_SEGURISIMA');
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const idDoctor = decodedToken.idDoctor;
    if (!idDoctor) {
      return res.status(400).json({ message: 'Doctor ID not found in token' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadDate = new Date();
    const fileName = req.file.originalname;
    const filePath = req.file.path;

    const [result] = await pool.query(
      `INSERT INTO studies (idPatient, idDoctor, performanceDate, uploadDate, fileName, filePath, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        idDoctor,
        performanceDate,
        uploadDate,
        fileName,
        filePath,
        description,
      ]
    );

    res.status(201).json({
      message: 'Study uploaded successfully',
      idStudy: result.insertId,
      fileName: fileName,
      uploadDate: uploadDate,
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating study:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get studies by patient
export const getStudiesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(
      '🔍 BACKEND - getStudiesByPatient: Obteniendo estudios para patientId:',
      patientId
    );

    const [result] = await pool.query(
      `SELECT s.idStudy, s.performanceDate, s.uploadDate, s.fileName, 
              s.description, CONCAT(u.firstName, ' ', u.lastName) as doctorName
       FROM studies s
       INNER JOIN doctors d ON s.idDoctor = d.idDoctor
       INNER JOIN users u ON d.dni = u.dni
       WHERE s.idPatient = ?
       ORDER BY s.uploadDate DESC`,
      [patientId]
    );

    console.log(
      '📊 BACKEND - getStudiesByPatient: Resultado de la query:',
      result
    );
    console.log(
      '🔢 BACKEND - getStudiesByPatient: Cantidad de estudios encontrados:',
      result.length
    );

    if (result.length === 0) {
      console.log(
        '❌ BACKEND - getStudiesByPatient: No se encontraron estudios'
      );
      return res.json([]); // Return empty array instead of 404
    }

    console.log(
      '✅ BACKEND - getStudiesByPatient: Estudios encontrados, enviando respuesta'
    );
    res.json(result);
  } catch (error) {
    console.error('❌ BACKEND - Error getting studies:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get studies by doctor
export const getStudiesByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [result] = await pool.query(
      `SELECT s.idStudy, s.performanceDate, s.uploadDate, s.fileName, 
              s.description, CONCAT(u.firstName, ' ', u.lastName) as patientName,
              p.dni as patientDni
       FROM studies s
       INNER JOIN patients p ON s.idPatient = p.idPatient
       INNER JOIN users u ON p.dni = u.dni
       WHERE s.idDoctor = ?
       ORDER BY s.uploadDate DESC`,
      [doctorId]
    );

    if (result.length === 0) {
      return res.json([]); // Return empty array instead of 404
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting studies:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Download study file
export const downloadStudy = async (req, res) => {
  try {
    const { studyId } = req.params;

    const [result] = await pool.query(
      'SELECT filePath, fileName FROM studies WHERE idStudy = ?',
      [studyId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Study not found' });
    }

    const { filePath, fileName } = result[0];

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, fileName);
  } catch (error) {
    console.error('Error downloading study:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar study
export const deleteStudy = async (req, res) => {
  try {
    const { studyId } = req.params;

    // Primero obtener la ruta del archivo
    const [study] = await pool.query(
      'SELECT filePath FROM studies WHERE idStudy = ?',
      [studyId]
    );

    if (study.length === 0) {
      return res.status(404).json({ message: 'Study not found' });
    }

    // Eliminar de la base de datos
    await pool.query('DELETE FROM studies WHERE idStudy = ?', [studyId]);

    // Eliminar archivo físico
    const filePath = study[0].filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Study deleted successfully' });
  } catch (error) {
    console.error('Error deleting study:', error);
    return res.status(500).json({ message: error.message });
  }
};
