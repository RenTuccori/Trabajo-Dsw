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

// Obtener estudios por paciente
export const getEstudiosByPaciente = async (idPaciente) => {
  try {
    const response = await axiosInstance.get(`estudios/paciente/${idPaciente}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener estudios por doctor
export const getEstudiosByDoctor = async (idDoctor) => {
  try {
    const response = await axiosInstance.get(`estudios/doctor/${idDoctor}`);
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
