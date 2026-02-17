import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as estudiosService from '../services/estudios.service.js';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './files/estudios/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'estudio-' + uniqueSuffix + extension);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only PDF, JPG, JPEG, PNG, DOC, DOCX are permitted'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const createStudy = async (req, res) => {
  try {
    const { idPaciente, fechaRealizacion, descripcion } = req.body;
    const idDoctor = req.session.idDoctor;

    if (!idDoctor) {
      return res.status(400).json({ message: 'Doctor ID not found in token' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded' });
    }

    const fechaCarga = new Date();
    const nombreArchivo = req.file.originalname;
    const rutaArchivo = req.file.path;

    const study = await estudiosService.createStudy({
      idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion,
    });

    res.status(201).json({
      message: 'Study uploaded successfully',
      idEstudio: study.idEstudio,
      nombreArchivo,
      fechaCarga,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getStudiesByPatient = async (req, res) => {
  try {
    const result = await estudiosService.getStudiesByPatient(req.params.idPaciente);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStudiesByDoctor = async (req, res) => {
  try {
    const result = await estudiosService.getStudiesByDoctor(req.params.idDoctor);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadStudy = async (req, res) => {
  try {
    const study = await estudiosService.findStudyById(req.params.idEstudio);
    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }
    if (!fs.existsSync(study.rutaArchivo)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.download(study.rutaArchivo, study.nombreArchivo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStudy = async (req, res) => {
  try {
    const study = await estudiosService.findStudyById(req.params.idEstudio);
    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }

    await estudiosService.deleteStudyById(req.params.idEstudio);

    if (fs.existsSync(study.rutaArchivo)) {
      fs.unlinkSync(study.rutaArchivo);
    }

    res.json({ message: 'Study deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
