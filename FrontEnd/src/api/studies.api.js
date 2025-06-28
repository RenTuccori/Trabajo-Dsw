import axiosInstance from './axiosInstance';

// Subir un nuevo estudio
export const uploadEstudio = async (formData) => {
  try {
    const response = await axiosInstance.post('estudios/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener estudios por patient
export const getEstudiosByPaciente = async (patientId) => {
  try {
    const response = await axiosInstance.get(`estudios/patient/${patientId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener estudios por doctor
export const getEstudiosByDoctor = async (doctorId) => {
  try {
    const response = await axiosInstance.get(`estudios/doctor/${doctorId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Descargar estudio
export const downloadEstudio = async (idEstudio) => {
  try {
    const response = await axiosInstance.get(`estudios/download/${idEstudio}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar estudio
export const deleteEstudio = async (idEstudio) => {
  try {
    const response = await axiosInstance.delete(`estudios/${idEstudio}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


