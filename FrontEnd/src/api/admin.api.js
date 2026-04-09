import axiosInstance from './axiosInstance';

export const getAdmin = async ({ user, password }) => {
  return await axiosInstance.post(`admin/login`, { username: user, password });
};

//Doctor
export const createDoctor = async ({ nationalId, appointmentDuration }) => {
  try {
    const response = await axiosInstance.post(`admin/doctors`, {
      nationalId,
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

// Location
export const createLocation = async ({ name, address }) => {
  try {
    const response = await axiosInstance.post(`admin/locations`, {
      name,
      address,
    });
    return response;
  } catch (error) {
    console.error('Error creating location:', error);
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
    console.error('Error deleting location:', error);
    throw error;
  }
};

// Health Insurance
export const createHealthInsurance = async ({ name }) => {
  try {
    const response = await axiosInstance.post(`admin/health-insurance`, {
      name,
    });
    return response;
  } catch (error) {
    console.error('Error creating health insurance:', error);
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
    console.error('Error updating health insurance:', error);
    throw error;
  }
};

export const deleteHealthInsurance = async (insuranceId) => {
  try {
    const response = await axiosInstance.delete(`admin/health-insurance/${insuranceId}`);
    return response;
  } catch (error) {
    console.error('Error deleting health insurance:', error);
    throw error;
  }
};

// Specialty
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

//combinations
export const createSeEspDoc = async ({ locationId, specialtyId, doctorId }) => {
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

export const deleteSeEspDoc = async ({ locationId, doctorId, specialtyId }) => {
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

// Schedules
export const createSchedule = async ({
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
    return error.response?.data?.message || 'Error replacing schedules';
  }
};

export const getSchedulesByDoctor = async ({
  locationId,
  specialtyId,
  doctorId,
}) => {
  try {
    const response = await axiosInstance.post(`admin/schedules/doctor`, {
      locationId,
      specialtyId,
      doctorId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async ({
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
