import axiosInstance from './axiosInstance';

export const getAdmin = async ({ user, password }) => {
  return await axiosInstance.post(`admin/login`, { username: user, password });
};

//Doctor
export const createDoctor = async ({ dni, appointmentDuration }) => {
  try {
    const response = await axiosInstance.post(`admin/doctors`, {
      nationalId: dni,
      appointmentDuration,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const deleteDoctor = async (doctorId) => {
  try {
    const response = await axiosInstance.delete(`admin/doctors/${doctorId}`);
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const updateDoctor = async ({
  doctorId,
  appointmentDuration,
}) => {
  try {
    const response = await axiosInstance.put(`admin/doctors/${doctorId}`, {
      appointmentDuration,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

//Location
export const createLocation = async ({ name, address }) => {
  try {
    const response = await axiosInstance.post(`admin/locations`, {
      name,
      address,
    });
    return response;
  } catch (error) {
    console.error('Error creating sede:', error);
    throw error;
  }
};

export const updateLocation = async ({ locationId, name, address }) => {
  try {
    const response = await axiosInstance.put(`admin/locations/${locationId}`, {
      name,
      address,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const response = await axiosInstance.delete(`admin/locations/${locationId}`);
    return response;
  } catch (error) {
    console.error('Error deleting sede:', error);
    throw error;
  }
};

//HealthInsurance
export const createHealthInsurance = async ({ name }) => {
  try {
    const response = await axiosInstance.post(`admin/health-insurance`, {
      name,
    });
    return response;
  } catch (error) {
    console.error('Error creating obra social:', error);
    throw error;
  }
};

export const updateHealthInsurance = async ({ insuranceId, healthInsuranceId, name }) => {
  const resolvedInsuranceId = insuranceId ?? healthInsuranceId;
  try {
    const response = await axiosInstance.put(`admin/health-insurance/${resolvedInsuranceId}`, {
      name,
    });
    return response;
  } catch (error) {
    console.error('Error updating obra social:', error);
    throw error;
  }
};

export const deleteHealthInsurance = async (insuranceId) => {
  try {
    const response = await axiosInstance.delete(`admin/health-insurance/${insuranceId}`);
    return response;
  } catch (error) {
    console.error('Error deleting obra social:', error);
    throw error;
  }
};

//Especialidad
export const createSpecialty = async ({ name }) => {
  try {
    const response = await axiosInstance.post(`admin/specialties`, { name });
    return response;
  } catch (error) {
    console.error('Error creating specialty:', error);
    throw error;
  }
};

export const deleteSpecialty = async (specialtyId) => {
  try {
    const response = await axiosInstance.delete(`admin/specialties/${specialtyId}`);
    return response;
  } catch (error) {
    console.error('Error deleting specialty:', error);
    throw error;
  }
};

//Combinations
export const createCombination = async ({ locationId, specialtyId, doctorId }) => {
  try {
    const response = await axiosInstance.post(`admin/combinations`, {
      locationId,
      specialtyId,
      doctorId,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const deleteCombination = async ({ locationId, doctorId, specialtyId }) => {
  try {
    const response = await axiosInstance.delete(`admin/combinations`, {
      data: { locationId, doctorId, specialtyId },
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getCombinations = async () => {
  try {
    const response = await axiosInstance.get(`admin/combinations`);
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

//Schedules
export const createSchedules = async ({
  locationId,
  doctorId,
  specialtyId,
  day,
  startTime,
  endTime,
  status,
}) => {
  try {
    const response = await axiosInstance.post(`admin/schedules`, {
      locationId,
      doctorId,
      specialtyId,
      day,
      startTime,
      endTime,
      status,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const replaceSchedules = async ({ locationId, doctorId, specialtyId, schedules }) => {
  try {
    const response = await axiosInstance.post(`admin/schedules/replace`, {
      locationId,
      doctorId,
      specialtyId,
      schedules,
    });
    return response;
  } catch (error) {
    return error.response?.data?.message || 'Error al reemplazar horarios';
  }
};

export const getSchedulesByDoctor = async ({
  locationId,
  specialtyId,
  doctorId,
}) => {
  return await axiosInstance.post(`admin/schedules/doctor`, {
    locationId,
    specialtyId,
    doctorId,
  });
};

export const updateSchedules = async ({
  locationId,
  doctorId,
  specialtyId,
  day,
  startTime,
  endTime,
  status,
}) => {
  try {
    const response = await axiosInstance.put(`admin/schedules`, {
      locationId,
      doctorId,
      specialtyId,
      day,
      startTime,
      endTime,
      status,
    });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};
