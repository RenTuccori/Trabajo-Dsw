import Study from '../models/Study.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
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

    const uploadDate = new Date();
    const fileName = req.file.originalname;
    const filePath = req.file.path;

    const newStudy = await Study.create({
      patient_id: idPaciente,
      doctor_id: idDoctor,
      performed_date: fechaRealizacion,
      upload_date: uploadDate,
      file_name: fileName,
      file_path: filePath,
      description: descripcion,
    });

    res.status(201).json({
      message: 'Estudio subido exitosamente',
      idEstudio: newStudy.id,
      nombreArchivo: fileName,
      fechaCarga: uploadDate,
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

    const studies = await Study.findAll({
      where: { patient_id: idPaciente },
      include: [
        {
          model: Doctor,
          include: [User]
        }
      ],
      order: [['upload_date', 'DESC']]
    });

    const result = studies.map(study => ({
      idEstudio: study.id,
      fechaRealizacion: study.performed_date,
      fechaCarga: study.upload_date,
      nombreArchivo: study.file_name,
      descripcion: study.description,
      nombreDoctor: `${study.Doctor.User.first_name} ${study.Doctor.User.last_name}`
    }));

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

    const studies = await Study.findAll({
      where: { doctor_id: idDoctor },
      include: [
        {
          model: Patient,
          include: [User]
        }
      ],
      order: [['upload_date', 'DESC']]
    });

    const result = studies.map(study => ({
      idEstudio: study.id,
      fechaRealizacion: study.performed_date,
      fechaCarga: study.upload_date,
      nombreArchivo: study.file_name,
      descripcion: study.description,
      nombrePaciente: `${study.Patient.User.first_name} ${study.Patient.User.last_name}`,
      dniPaciente: study.Patient.dni
    }));

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

    const study = await Study.findByPk(idEstudio);

    if (!study) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    const { file_path, file_name } = study;

    if (!fs.existsSync(file_path)) {
      return res
        .status(404)
        .json({ message: 'Archivo no encontrado en el servidor' });
    }

    res.download(file_path, file_name);
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
    const study = await Study.findByPk(idEstudio);

    if (!study) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    // Eliminar archivo físico
    const rutaArchivo = study.file_path;
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar de la base de datos
    await study.destroy();

    res.json({ message: 'Estudio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar estudio:', error);
    return res.status(500).json({ message: error.message });
  }
};
