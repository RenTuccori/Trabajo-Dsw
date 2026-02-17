import axiosInstance from './axiosInstance';

// Upload a new study
export const uploadStudy = async (formData) => {
  try {
    const response = await axiosInstance.post('estudios/upload', formData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get studies by patient
export const getStudiesByPatient = async (idPaciente) => {
  try {
    const response = await axiosInstance.get(`estudios/paciente/${idPaciente}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get studies by doctor
export const getStudiesByDoctor = async (idDoctor) => {
  try {
    const response = await axiosInstance.get(`estudios/doctor/${idDoctor}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Download study
export const downloadStudy = async (idEstudio) => {
  try {
    const response = await axiosInstance.get(`estudios/download/${idEstudio}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete study
export const deleteStudy = async (idEstudio) => {
  try {
    const response = await axiosInstance.delete(`estudios/${idEstudio}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
