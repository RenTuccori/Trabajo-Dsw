import axiosInstance from './axiosInstance';

export const getUserByNationalIdPassword = async ({nationalId, password}) => {
    console.log('🌐 FRONTEND - getUserByNationalIdPassword: Starting backend request');
    console.log('📋 FRONTEND - Data sent:', { nationalId, password: '***' });
    
    try {
        const response = await axiosInstance.post(`users/login`,{nationalId: Number(nationalId), password});
        console.log('✅ FRONTEND - Backend response received:', response);
        console.log('🔑 FRONTEND - Token received:', response.data ? 'Present' : 'Not present');
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error in getUserByNationalIdBirthDate:', error);
        console.log('📄 FRONTEND - Error details:', error.response?.data);
        throw error;
    }
}
export const createUser = async ({ nationalId, password, birthDate, firstName, lastName, phone, email, address, healthInsuranceId }) => {
    console.log('🌐 FRONTEND - createUser: Sending data to backend');
    console.log('📋 FRONTEND - Data (raw):', { nationalId, password: '***', birthDate, firstName, lastName, phone, email, address, healthInsuranceId });

    // Normalize optional fields: send null instead of empty strings to satisfy validators with optional nullable
    const payload = {
        nationalId: Number(nationalId),
        password,
        birthDate,
        firstName,
        lastName,
        phone: phone && String(phone).trim() !== '' ? phone : null,
        email: email && String(email).trim() !== '' ? email : null,
        address: address && String(address).trim() !== '' ? String(address).trim().slice(0, 100) : null,
        healthInsuranceId: healthInsuranceId === '' || healthInsuranceId === undefined || healthInsuranceId === null ? null : Number(healthInsuranceId),
    };

    console.log('📋 FRONTEND - Data (normalized):', payload);

    try {
        const response = await axiosInstance.post(`users`, payload);
        console.log('✅ FRONTEND - createUser: User created successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createUser: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        if (error.response?.data?.errors) {
            console.error('📌 Validation errors:', error.response.data.errors);
        }
        // Throw the backend payload if present so callers can display validation messages cleanly
        throw error.response?.data || error;
    }
}


export const updateUser = async ({ nationalId, password, name, lastName, phone, email, address, healthInsuranceId }) => {
    console.log('🌐 FRONTEND - updateUser: Sending data:', { nationalId, firstName: name, lastName, phone, email, address });
    
    // Map frontend fields to backend fields
    // Prefer explicit `nationalId` param, then token
    let resolvedNationalId = nationalId;
    if (!resolvedNationalId) {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Try common fields
                resolvedNationalId = payload.nationalId || payload.dni || payload.id || payload.userId;
            }
        } catch (e) {
            console.warn('⚠️ FRONTEND - updateUser: Could not decode token to obtain nationalId', e);
        }
    }

    // Coerce to number when possible
    const numericNationalId = resolvedNationalId ? Number(resolvedNationalId) : undefined;

    const normalizedHealthInsuranceId =
      healthInsuranceId === '' || healthInsuranceId === undefined || healthInsuranceId === null
        ? null
        : Number(healthInsuranceId);

    const backendData = {
        nationalId: numericNationalId,
        firstName: name, 
        lastName,
        phone,
        email,
        address,
        healthInsuranceId: normalizedHealthInsuranceId,
        ...(password?.trim() ? { password: password.trim() } : {}),
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

export const getUserByNationalId = async ({ nationalId }) => {
    console.log('🌐 FRONTEND - getUserByNationalId: Starting backend request');
    console.log('📋 FRONTEND - National ID sent:', nationalId);
    
    try {
        const response = await axiosInstance.post(`users/nationalId`, { nationalId: Number(nationalId) });
        console.log('✅ FRONTEND - getUserByNationalId response received:', response);
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error in getUserByNationalId:', error);
        console.log('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}

// Alias used by providers that pass { dni } instead of { nationalId }
export const getUserDni = async ({ dni }) => {
    return getUserByNationalId({ nationalId: dni });
}

