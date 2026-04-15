import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { usePatients } from '../../context/patients/PatientsProvider';

export function UserModification() {
  const {
    userByDni,
    getUserByDniFunction,
    getHealthInsurances,
    healthInsurances,
    updateUserFunction,
  } = usePatients();
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

  const getInsuranceId = (insurance) => insurance?.id ?? insurance?.healthInsuranceId ?? insurance?.idInsuranceCompany;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Alerta de confirmación
    const result = await window.confirmDialog(
      'Guardar Cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      // Ensure we send a valid nationalId: prefer form dni, fallback to userByDni.nationalId
      const payload = {
        ...formData,
        dni: formData.dni || userByDni?.nationalId || userByDni?.id || formData.dni,
      };

      try {
        const response = await updateUserFunction(payload);

        if (response && response.data && (response.status === 200 || response.data.message === 'User updated')) {
          window.notifySuccess('Usuario actualizado con éxito');
          navigate('/patient');
        } else {
          const msg = response?.data?.message || 'No se pudo actualizar el usuario';
          await window.confirmDialog('Error', msg, 'error');
        }
      } catch (error) {
        console.error('💥 FRONTEND - Error en handleSubmit:', error);
        const backendMessage = error?.message || error?.data?.message || 'Ocurrió un error al actualizar el usuario';
        await window.confirmDialog('Error', backendMessage, 'error');
      }
    }
  };

  useEffect(() => {
    
    getHealthInsurances();
    getUserByDniFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userByDni && healthInsurances.length > 0) {
      
      const insuranceId = userByDni.healthInsuranceId ?? userByDni.idInsuranceCompany;
      
      // Buscar la obra social correspondiente
      const matchingInsurance = (healthInsurances || []).find((os) =>
        String(getInsuranceId(os)) === String(insuranceId)
      );
      
      setFormData({
        dni: userByDni.nationalId || userByDni.dni,
        name: userByDni.firstName || userByDni.name || '', // Mapear firstName a name
        lastName: userByDni.lastName,
        phone: userByDni.phone,
        email: userByDni.email,
        address: userByDni.address,
        healthInsuranceId: insuranceId || '', // Mapear campo correcto
      });

      setSelectedObraSociales({
        value: insuranceId || '',
        label: matchingInsurance?.name || 'No asignada',
      });
      
      console.log('✅ FRONTEND - Obra social seleccionada:', {
        value: insuranceId,
        label: matchingInsurance?.name || 'No asignada',
      });
    }
  }, [userByDni, healthInsurances]);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
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
              options={(healthInsurances || []).map((obrasociales) => {
                return {
                  value: getInsuranceId(obrasociales),
                  label: obrasociales.name,
                };
              })}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => navigate('/patient')}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}



