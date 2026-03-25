import axiosInstance from './axiosInstance';

export const getUserDniFecha = async ({dni,birthDate}) => {
    console.log('🌐 FRONTEND - getUserByNationalIdBirthDate: Starting backend request');
    console.log('📋 FRONTEND - Data sent:', { nationalId: dni, birthDate });
    
    try {
        const response = await axiosInstance.post(`users/login`,{nationalId: Number(dni), birthDate});
        console.log('✅ FRONTEND - Backend response received:', response);
        console.log('🔑 FRONTEND - Token received:', response.data ? 'Present' : 'Not present');
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error in getUserByNationalIdBirthDate:', error);
        console.log('📄 FRONTEND - Error details:', error.response?.data);
        throw error;
    }
}
export const createUser = async ({dni,birthDate,firstName,lastName,phone,email,address,insuranceCompanyId}) => {
    console.log('🌐 FRONTEND - createUser: Sending data to backend');
    console.log('📋 FRONTEND - Data:', { nationalId: dni, birthDate, firstName, lastName, phone, email, address });
    
    try {
        const response = await axiosInstance.post(`users`,{nationalId: Number(dni),birthDate,firstName,lastName,phone,email,address, insuranceCompanyId});
        console.log('✅ FRONTEND - createUser: User created successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createUser: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        if (error.response?.data?.errors) {
            console.error('📌 Validation errors:', error.response.data.errors);
        }
        throw error;
    }
}


export const updateUser = async ({ dni, nationalId: nat, name, lastName, phone, email, address, healthInsuranceId }) => {
    console.log('🌐 FRONTEND - updateUser: Sending data:', { dni, nationalId: nat, firstName: name, lastName, phone, email, address });
    
    // Map frontend fields to backend fields
    // Prefer explicit `nationalId` param, then `dni`, then token
    let nationalId = nat || dni;
    if (!nationalId) {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Try common fields
                nationalId = payload.nationalId || payload.dni || payload.id || payload.userId;
            }
        } catch (e) {
            console.warn('⚠️ FRONTEND - updateUser: Could not decode token to obtain nationalId', e);
        }
    }

    // Coerce to number when possible
    const numericNationalId = nationalId ? Number(nationalId) : undefined;

    const backendData = {
        nationalId: numericNationalId,
        firstName: name, 
        lastName,
        phone,
        email,
        address,
        healthInsuranceId
    };
    
    console.log('🔄 FRONTEND - updateUser: Mapped data for backend:', backendData);
    
    try {
        const response = await axiosInstance.put(`users`, backendData);
        console.log('✅ FRONTEND - updateUser: Successful response:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - updateUser: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        throw error.response?.data || error;
    }
}

export const getUserDni = async ({ dni }) => {
    console.log('🌐 FRONTEND - getUserByNationalId: Starting backend request');
    console.log('📋 FRONTEND - National ID sent:', dni);
    
    try {
        const response = await axiosInstance.post(`users/nationalId`, { nationalId: Number(dni) });
        console.log('✅ FRONTEND - getUserByNationalId response received:', response);
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error in getUserByNationalId:', error);
        console.log('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}


