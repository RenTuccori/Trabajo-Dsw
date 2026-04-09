import axiosInstance from './axiosInstance';

export const getInsurance = async () => {
    console.log('🌐 FRONTEND - getInsurance: Getting insurance options');
    try {
        const response = await axiosInstance.get(`health-insurance`);
        console.log('✅ FRONTEND - Insurance response:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getInsurance:', error);
        throw error;
    }
}



