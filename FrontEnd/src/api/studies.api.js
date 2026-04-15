import axiosInstance from './axiosInstance';

// Upload a new study
export const uploadEstudio = async (formData) => {
  try {
    const response = await axiosInstance.post('studies/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get studies by patient
export const getEstudiosByPaciente = async (patientId) => {
  console.log('🌐 FRONTEND - getEstudiosByPaciente: Obteniendo estudios para patientId:', patientId);
  try {
    const response = await axiosInstance.get(`studies/patient/${patientId}`);
    console.log('✅ FRONTEND - getEstudiosByPaciente: Respuesta recibida:', response);
    console.log('📊 FRONTEND - getEstudiosByPaciente: Estudios:', response.data);
    return response;
  } catch (error) {
    console.error('❌ FRONTEND - getEstudiosByPaciente: Error:', error);
    console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
    throw error.response?.data || error.message;
  }
};

// Get studies by doctor
export const getEstudiosByDoctor = async (doctorId) => {
  try {
    const response = await axiosInstance.get(`studies/doctor/${doctorId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Download study
export const downloadEstudio = async (studyId) => {
  try {
    const response = await axiosInstance.get(`studies/download/${studyId}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete study
export const deleteEstudio = async (studyId) => {
  try {
    const response = await axiosInstance.delete(`studies/${studyId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


