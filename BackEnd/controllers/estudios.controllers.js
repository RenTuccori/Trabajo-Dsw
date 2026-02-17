import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as estudiosService from '../services/estudios.service.js';

// Configuración de multer para subir archivos
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
    cb(new Error('Tipo de archivo no permitido. Solo se permiten: PDF, JPG, JPEG, PNG, DOC, DOCX'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const createEstudio = async (req, res) => {
  try {
    const { idPaciente, fechaRealizacion, descripcion } = req.body;
    const idDoctor = req.session.idDoctor;

    if (!idDoctor) {
      return res.status(400).json({ message: 'ID de doctor no encontrado en el token' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const fechaCarga = new Date();
    const nombreArchivo = req.file.originalname;
    const rutaArchivo = req.file.path;

    const estudio = await estudiosService.createEstudio({
      idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion,
    });

    res.status(201).json({
      message: 'Estudio subido exitosamente',
      idEstudio: estudio.idEstudio,
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

export const getEstudiosByPaciente = async (req, res) => {
  try {
    const result = await estudiosService.getEstudiosByPaciente(req.params.idPaciente);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEstudiosByDoctor = async (req, res) => {
  try {
    const result = await estudiosService.getEstudiosByDoctor(req.params.idDoctor);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadEstudio = async (req, res) => {
  try {
    const estudio = await estudiosService.findEstudioById(req.params.idEstudio);
    if (!estudio) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }
    if (!fs.existsSync(estudio.rutaArchivo)) {
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }
    res.download(estudio.rutaArchivo, estudio.nombreArchivo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEstudio = async (req, res) => {
  try {
    const estudio = await estudiosService.findEstudioById(req.params.idEstudio);
    if (!estudio) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    await estudiosService.deleteEstudioById(req.params.idEstudio);

    if (fs.existsSync(estudio.rutaArchivo)) {
      fs.unlinkSync(estudio.rutaArchivo);
    }

    res.json({ message: 'Estudio eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
