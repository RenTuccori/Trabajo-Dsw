import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { usePacientes } from '../../context/patients/PatientsProvider';

export function UserModification() {
  const {
    userByDni,
    getUserByDniFunction,
    getHealthInsurances,
    healthInsurances,
    updateUserFunction,
  } = usePacientes();
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
      console.log('💾 FRONTEND - handleSubmit: Datos a enviar:', formData);
      try {
        const response = await updateUserFunction(formData);
        console.log('📨 FRONTEND - handleSubmit: Respuesta recibida:', response);

        // Verificar si la respuesta indica éxito
        if (response && response.data && (response.status === 200 || response.data.message === 'User updated')) {
          console.log('✅ FRONTEND - Usuario actualizado con éxito');
          window.notifySuccess('Usuario actualizado con éxito');
          navigate('/patient');
        } else {
          console.log('❌ FRONTEND - Error al actualizar user - respuesta:', response);
          window.confirmDialog(
            'Error',
            'No se pudo actualizar el usuario',
            'error'
          );
        }
      } catch (error) {
        console.error('💥 FRONTEND - Error en handleSubmit:', error);
        window.confirmDialog(
          'Error',
          'Ocurrió un error al actualizar el usuario',
          'error'
        );
      }
    }
  };

  useEffect(() => {
    console.log('🔄 FRONTEND - userModification: useEffect disparado');
    console.log('👤 FRONTEND - userByDni:', userByDni);
    console.log('🏥 FRONTEND - healthInsurances:', healthInsurances);
    
    getHealthInsurances();
    getUserByDniFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userByDni && healthInsurances.length > 0) {
      console.log('🔧 FRONTEND - userModification: Mapeando datos del usuario:', userByDni);
      console.log('🏥 FRONTEND - Obras sociales disponibles:', healthInsurances);
      
      const insuranceId = userByDni.idInsuranceCompany || userByDni.healthInsuranceId;
      console.log('🆔 FRONTEND - ID de obra social del usuario:', insuranceId);
      
      // Buscar la obra social correspondiente
      const matchingInsurance = healthInsurances.find((os) => 
        (os.healthInsuranceId || os.idInsuranceCompany) === insuranceId
      );
      console.log('🔍 FRONTEND - Obra social encontrada:', matchingInsurance);
      
      setFormData({
        dni: userByDni.dni,
        name: userByDni.firstName || userByDni.name || '', // Mapear firstName a name
        lastName: userByDni.lastName,
        phone: userByDni.phone,
        email: userByDni.email,
        address: userByDni.address,
        healthInsuranceId: insuranceId, // Mapear campo correcto
      });

      setSelectedObraSociales({
        value: insuranceId,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
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
                console.log('🏥 FRONTEND - Mapeando obra social:', obrasociales);
                return {
                  value: obrasociales.healthInsuranceId || obrasociales.idInsuranceCompany,
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



