import axiosInstance from './axiosInstance';

export const getUserByNationalIdPassword = async ({dni, password}) => {
    
    try {
        const response = await axiosInstance.post(`users/login`,{nationalId: Number(dni), password});
        return response;
    } catch (error) {
        throw error;
    }
}
export const createUser = async (userData) => {
    // Acepta tanto 'name' como 'firstName', tanto 'dni' como 'nationalId'
    const { 
        dni, 
        nationalId, 
        password, 
        birthDate, 
        firstName, 
        name,
        lastName, 
        phone, 
        email, 
        address,
        addressLat,
        addressLon,
        healthInsuranceId
    } = userData;

    // Normalize optional fields: send null instead of empty strings to satisfy validators with optional nullable
    const payload = {
        nationalId: Number(nationalId || dni),
        password,
        birthDate,
        firstName: firstName || name,
        lastName,
        phone: phone && String(phone).trim() !== '' ? phone : null,
        email: email && String(email).trim() !== '' ? email : null,
        address: address && String(address).trim() !== '' ? String(address).trim().slice(0, 100) : null,
        healthInsuranceId: healthInsuranceId === '' || healthInsuranceId === undefined || healthInsuranceId === null ? null : Number(healthInsuranceId),
        // NO incluir addressLat, addressLon en el backend
    };

    try {
        const response = await axiosInstance.post(`users`, payload);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createUser: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        if (error.response?.data?.errors) {
            console.error('📌 Validation errors:', error.response.data.errors);
        }
        // Propagar la respuesta del backend con el código de error
        throw error.response?.data || error;
    }
}


export const updateUser = async ({ dni, nationalId: nat, password, name, lastName, phone, email, address, healthInsuranceId }) => {
    
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
    
    
    try {
        const response = await axiosInstance.put(`users`, backendData);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - updateUser: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        throw error.response?.data || error;
    }
}

export const getUserByNationalId = async ({ dni }) => {
    
    try {
        const response = await axiosInstance.post(`users/nationalId`, { nationalId: Number(dni) });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`users/all`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (nationalId) => {
    try {
        const response = await axiosInstance.delete(`users/${nationalId}`);
        return response;
    } catch (error) {
        throw error;
    }
}



