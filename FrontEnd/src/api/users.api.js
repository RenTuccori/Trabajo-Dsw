import axiosInstance from './axiosInstance';

export const getUserDniFecha = async ({dni,birthDate}) => {
    console.log('🌐 FRONTEND - getUserDniFecha: Iniciando petición al backend');
    console.log('📋 FRONTEND - Datos enviados:', { dni, birthDate });
    
    try {
        const response = await axiosInstance.post(`usersdnifecha`,{dni,birthDate});
        console.log('✅ FRONTEND - Respuesta del backend recibida:', response);
        console.log('🔑 FRONTEND - Token recibido:', response.data ? 'Presente' : 'No presente');
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error en getUserDniFecha:', error);
        console.log('📄 FRONTEND - Detalles del error:', error.response?.data);
        throw error;
    }
}
export const createUser = async ({dni,birthDate,firstName,lastName,phone,email,address,insuranceCompanyId}) => {
    console.log('🌐 FRONTEND - createUser: Enviando datos al backend');
    console.log('📋 FRONTEND - Datos:', { dni, birthDate, firstName, lastName, phone, email, address, insuranceCompanyId });
    
    try {
        const response = await axiosInstance.post(`users`,{dni,birthDate,firstName,lastName,phone,email,address,insuranceCompanyId});
        console.log('✅ FRONTEND - createUser: Usuario creado exitosamente:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createUser: Error:', error);
        console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
        throw error;
    }
}


export const updateUser = async ({ dni, name, lastName, phone, email, address, healthInsuranceId }) => {
    console.log('🌐 FRONTEND - updateUser: Enviando datos:', { dni, name, lastName, phone, email, address, healthInsuranceId });
    
    // Mapear campos del frontend al backend
    const backendData = {
        dni,
        firstName: name, // Mapear name a firstName
        lastName,
        phone,
        email,
        address,
        insuranceCompanyId: healthInsuranceId // Mapear healthInsuranceId a insuranceCompanyId
    };
    
    console.log('🔄 FRONTEND - updateUser: Datos mapeados para backend:', backendData);
    
    try {
        const response = await axiosInstance.put(`users`, backendData);
        console.log('✅ FRONTEND - updateUser: Respuesta exitosa:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - updateUser: Error:', error);
        console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
        return error.response.data.message;
    }
}

export const getUserDni = async ({ dni }) => {
    console.log('🌐 FRONTEND - getUserDni: Iniciando petición al backend');
    console.log('📋 FRONTEND - DNI enviado:', dni);
    
    try {
        const response = await axiosInstance.post(`usersdni`, { dni });
        console.log('✅ FRONTEND - Respuesta de getUserDni recibida:', response);
        return response;
    } catch (error) {
        console.log('❌ FRONTEND - Error en getUserDni:', error);
        console.log('📄 FRONTEND - Detalles del error:', error.response?.data);
        return error.response.data.message;
    }
}


