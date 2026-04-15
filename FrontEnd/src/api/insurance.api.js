import axiosInstance from './axiosInstance';

export const getInsurance = async () => {
    try {
        const response = await axiosInstance.get(`health-insurance`);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getInsurance:', error);
        throw error;
    }
}



