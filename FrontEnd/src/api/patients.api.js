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
  console.log('🌐 FRONTEND - getPatientbyNationalId: Starting request to backend');
  console.log('📋 FRONTEND - National ID sent:', nationalId);
  
  try {
    const response = await axiosInstance.post(`patients/nationalId`, { nationalId });
    console.log('✅ FRONTEND - getPatientbyNationalId: Response received:', response);
    console.log('🆔 FRONTEND - idPatient in response:', response.data?.id);
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


