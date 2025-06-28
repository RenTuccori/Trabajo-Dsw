/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import { useAuth } from '../../context/global/AuthProvider';
import Select from 'react-select';
import { notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';

export function DatosPersonales() {
  const { obraSociales, ObtenerObraSociales, CrearUsuario } = usePacientes();
  const { login } = useAuth();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    fechaNacimiento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    idObraSocial: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      await CrearUsuario(formData); // Asegura que la creación del usuario sea asíncrona
      login({
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        userType: 'Patient',
      });

      // Muestra el mensaje de éxito con SweetAlert2
      confirmDialog().then(() => {
        navigate('/paciente'); // Navega después de confirmar
      });
    } catch (error) {
      notifyError('Hubo un error al registrar el usuario. Intente nuevamente.');
    }
  };

  useEffect(() => {
    ObtenerObraSociales();
  }, []);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idObraSocial: selectedOption.value,
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
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Nombre</p>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Apellido</p>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Dirección</p>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Teléfono</p>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
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
              options={(obraSociales || []).map((obrasocial) => ({
                value: obrasocial.idObraSocial,
                label: obrasocial.nombre,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
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
