/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/patients/PatientsProvider';
import { useAuth } from '../../context/global/AuthProvider';
import Select from 'react-select';
import { notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';
import AddressAutocomplete from '../../components/AddressAutocomplete';

export function PersonalData() {
  const { healthInsurances, getHealthInsurances, createUserFunction, getUserByDniFunction, userByDni } = usePatients();
  const { login, dni } = useAuth();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    birthDate: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
  });

  const getInsuranceId = (insurance) =>
    insurance?.id ?? insurance?.healthInsuranceId ?? insurance?.idInsuranceCompany;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    // Client-side validation to mirror backend validators
    const nationalIdDigits = String(formData.dni).replace(/\D/g, '');
    if (nationalIdDigits.length < 7) {
      notifyError('El DNI debe tener al menos 7 dígitos.');
      return;
    }
    const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthDatePattern.test(formData.birthDate)) {
      notifyError('La fecha de nacimiento debe tener formato YYYY-MM-DD.');
      return;
    }
    if (!formData.name.trim() || !formData.lastName.trim()) {
      notifyError('Nombre y apellido son obligatorios.');
      return;
    }

    try {
      await createUserFunction(formData); // Asegura que la creación del user sea asíncrona

      login({
        identifier: formData.dni,
        credential: formData.birthDate,
        userType: 'Patient',
      });

      // Show success toast and navigate directly
      if (window.notifySuccess) window.notifySuccess('Usuario registrado correctamente');
      navigate('/patient');
    } catch (error) {
      console.error('❌ FRONTEND - Error al registrar usuario:', error);
      // If validation details are available from backend, show them
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        const messages = backendErrors.map((e) => `${e.field}: ${e.message}`).join('; ');
        notifyError(messages);
      } else {
        notifyError('Hubo un error al registrar el user. Intente nuevamente.');
      }
    }
  };

  useEffect(() => {
    getHealthInsurances();
  }, []);

  useEffect(() => {
    if (dni) {
      getUserByDniFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dni]);

  useEffect(() => {
    // When user data is fetched from backend, prefill the form
    if (userByDni && Object.keys(userByDni).length > 0) {
      setFormData((prev) => ({
        ...prev,
        dni: userByDni.nationalId || prev.dni,
        birthDate: userByDni.birthDate || prev.birthDate,
        name: userByDni.firstName || prev.name,
        lastName: userByDni.lastName || prev.lastName,
        phone: userByDni.phone || prev.phone,
        email: userByDni.email || prev.email,
        address: userByDni.address || prev.address,
        healthInsuranceId:
          userByDni.healthInsuranceId ||
          userByDni.insuranceCompanyId ||
          prev.healthInsuranceId,
      }));

      // set selected option for obra social if available
      const selectedInsuranceId =
        userByDni.healthInsuranceId || userByDni.insuranceCompanyId;
      if (selectedInsuranceId) {
        const option = (healthInsurances || []).find(
          (h) => String(getInsuranceId(h)) === String(selectedInsuranceId)
        );
        if (option) {
          setSelectedObraSociales({
            value: getInsuranceId(option),
            label: option.name,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userByDni, healthInsurances]);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-center text-gray-600 text-lg">DNI</p>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">
              Fecha de Nacimiento
            </p>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Nombre</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Apellido</p>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Dirección</p>
            <AddressAutocomplete
              initialValue={formData.address}
              onSelect={(place) =>
                setFormData((prev) => ({
                  ...prev,
                  address: place.address,
                  addressLat: place.lat,
                  addressLon: place.lon,
                }))
              }
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Teléfono</p>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Email</p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Obra Social</p>
            <Select
              options={(healthInsurances || []).map((obrasocial) => ({
                value: getInsuranceId(obrasocial),
                label: obrasocial.name,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
              placeholder="Seleccione obra social..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}



