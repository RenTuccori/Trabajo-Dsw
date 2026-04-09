import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as studiesService from '../services/studies.service.js';

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
    const { patientId, performanceDate, description } = req.body;
    const doctorId = req.session.doctorId;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID not found in token' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded' });
    }

    const uploadDate = new Date();
    const fileName = req.file.originalname;
    const filePath = req.file.path;

    const study = await studiesService.createStudy({
      patientId, doctorId, performanceDate, uploadDate, fileName, filePath, description,
    });

    res.status(201).json({
      message: 'Study uploaded successfully',
      id: study.id,
      fileName,
      uploadDate,
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
    const result = await studiesService.getStudiesByPatient(req.params.patientId);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStudiesByDoctor = async (req, res) => {
  try {
    const result = await studiesService.getStudiesByDoctor(req.params.doctorId);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadStudy = async (req, res) => {
  try {
    const study = await studiesService.findStudyById(req.params.id);
    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }
    if (!fs.existsSync(study.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.download(study.filePath, study.fileName);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStudy = async (req, res) => {
  try {
    const study = await studiesService.findStudyById(req.params.id);
    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }

    await studiesService.deleteStudyById(req.params.id);

    if (fs.existsSync(study.filePath)) {
      fs.unlinkSync(study.filePath);
    }

    res.json({ message: 'Study deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
