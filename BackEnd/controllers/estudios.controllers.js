import { 
  Estudio, 
  Doctor, 
  Paciente, 
  Usuario, 
  Especialidad,
  Sede 
} from '../models/index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/estudios/'); // ✅ Usar files como tienes configurado
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'estudio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Exportar el middleware upload
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen, PDF o documentos'));
    }
  }
});

// Resto de las funciones...
export const createEstudio = async (req, res) => {
  try {
    const { idPaciente, fechaRealizacion, descripcion } = req.body;
    const idDoctor = req.user?.idDoctor || req.body.idDoctor; // Obtener del token o body
    
    // El archivo viene de multer
    const archivo = req.file;
    
    if (!archivo) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    // Verificar que el paciente existe
    const paciente = await Paciente.findByPk(idPaciente);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Verificar que el doctor existe
    const doctor = await Doctor.findByPk(idDoctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    const nuevoEstudio = await Estudio.create({
      idPaciente,
      idDoctor,
      fechaRealizacion,
      fechaCarga: new Date(),
      nombreArchivo: archivo.filename,
      rutaArchivo: archivo.path,
      descripcion
    });

    // Retornar con todas las relaciones
    const estudioCompleto = await Estudio.findByPk(nuevoEstudio.idEstudio, {
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }]
    });

    res.status(201).json({
      message: 'Estudio creado exitosamente',
      estudio: estudioCompleto
    });
  } catch (error) {
    // Si hay error, eliminar el archivo subido
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getEstudios = async (req, res) => {
  try {
    const estudios = await Estudio.findAll({
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      order: [['fechaCarga', 'DESC']]
    });

    res.json(estudios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEstudioById = async (req, res) => {
  try {
    const { idEstudio } = req.params;

    const estudio = await Estudio.findByPk(idEstudio, {
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }]
    });

    if (!estudio) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    // Verificar si el archivo existe físicamente
    if (estudio.rutaArchivo && fs.existsSync(estudio.rutaArchivo)) {
      res.download(estudio.rutaArchivo, estudio.nombreArchivo);
    } else {
      console.error('❌ Archivo no encontrado en el sistema de archivos:', estudio.rutaArchivo);
      res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }
  } catch (error) {
    console.error('❌ Error al obtener estudio:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEstudiosByPaciente = async (req, res) => {
  try {
    const { idPaciente } = req.params;

    const estudios = await Estudio.findAll({
      where: { idPaciente },
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      order: [['fechaCarga', 'DESC']]
    });

    // Formatear la respuesta para incluir los datos necesarios para el frontend
    const estudiosFormateados = estudios.map(estudio => ({
      idEstudio: estudio.idEstudio,
      nombreArchivo: estudio.nombreArchivo,
      descripcion: estudio.descripcion,
      fechaRealizacion: estudio.fechaRealizacion,
      fechaCarga: estudio.fechaCarga,
      nombreDoctor: estudio.doctor?.usuario ? 
        `${estudio.doctor.usuario.nombre} ${estudio.doctor.usuario.apellido}` : 
        'Doctor no disponible'
    }));

    res.json(estudiosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEstudiosByDoctor = async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const estudios = await Estudio.findAll({
      where: { idDoctor },
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      order: [['fechaCarga', 'DESC']]
    });

    // Formatear la respuesta para incluir los datos necesarios para el frontend
    const estudiosFormateados = estudios.map(estudio => ({
      idEstudio: estudio.idEstudio,
      nombreArchivo: estudio.nombreArchivo,
      descripcion: estudio.descripcion,
      fechaRealizacion: estudio.fechaRealizacion,
      fechaCarga: estudio.fechaCarga,
      nombrePaciente: estudio.paciente?.usuario ? 
        `${estudio.paciente.usuario.nombre} ${estudio.paciente.usuario.apellido}` : 
        'Paciente no disponible',
      dniPaciente: estudio.paciente?.dni || 'N/A'
    }));

    res.json(estudiosFormateados);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEstudio = async (req, res) => {
  try {
    const { idEstudio } = req.params;
    const { tipo, informe, estado } = req.body;

    const [updatedRowsCount] = await Estudio.update({
      tipo,
      informe,
      estado
    }, {
      where: { idEstudio }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    const estudioActualizado = await Estudio.findByPk(idEstudio, {
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }]
    });

    res.json({
      message: 'Estudio actualizado exitosamente',
      estudio: estudioActualizado
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEstudio = async (req, res) => {
  try {
    const { idEstudio } = req.params;

    const estudio = await Estudio.findByPk(idEstudio);
    if (!estudio) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    // Eliminar archivo físico si existe
    if (estudio.rutaArchivo && fs.existsSync(estudio.rutaArchivo)) {
      fs.unlinkSync(estudio.rutaArchivo);
    }

    await estudio.destroy();

    res.json({ message: 'Estudio eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const completarEstudio = async (req, res) => {
  try {
    const { idEstudio } = req.params;
    const { informe } = req.body;

    const [updatedRowsCount] = await Estudio.update({
      informe,
      estado: 'Completado',
      fechaCompletado: new Date()
    }, {
      where: { idEstudio }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json({ message: 'Estudio completado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};