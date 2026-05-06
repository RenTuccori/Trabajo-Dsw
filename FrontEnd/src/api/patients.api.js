import axiosInstance from './axiosInstance';

export const getPatients = async () => {
  try {
    const response = await axiosInstance.get(`patients`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPatientbyNationalId = async ({ nationalId }) => {
  
  try {
    const response = await axiosInstance.post(`patients/nationalId`, { nationalId });
    return response;
  } catch (error) {
    console.error('❌ FRONTEND - getPatientbyNationalId: Error:', error);
    console.error('📄 FRONTEND - Error details:', error.response?.data);
    // Propagar el objeto de error para que el consumidor pueda manejarlo
    throw error.response?.data || error;
  }
};

export const createPatient = async ({ nationalId }) => {
  return await axiosInstance.post(`patients`, { nationalId });
};

export const deletePatient = async (nationalId) => {
  try {
      const response = await axiosInstance.delete(`patients/${nationalId}`);
      return response;
  } catch (error) {
      throw error;
  }
};


