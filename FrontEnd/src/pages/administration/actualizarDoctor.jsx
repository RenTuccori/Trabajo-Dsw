import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ActualizarDoctor() {
  const navigate = useNavigate();
  const { idDoctor } = useParams(); // Obtenemos el ID del doctor desde la URL
  const { ObtenerDoctorPorId, ActualizarDoctor, ObtenerOS, obrasSociales, doctor } = useAdministracion();
  const [doctorData, setDoctorData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
    duracionTurno: '',
    idObraSocial: '',
  });
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);

  useEffect(() => {
    // Obtener datos del doctor
    const fetchDoctorData = async () => {
      ObtenerDoctorPorId(idDoctor);
      setDoctorData({
        nombre: doctor.nombre,
        apellido: doctor.apellido,
        direccion: doctor.direccion,
        telefono: doctor.telefono,
        email: doctor.email,
        duracionTurno: doctor.duracionTurno,
        idObraSocial: doctor.idObraSocial,
      });
      setSelectedObraSociales(
        obrasSociales.find(os => os.idObraSocial === doctor.idObraSocial)
      );
    };

    ObtenerOS(); // Obtenemos las obras sociales disponibles
    fetchDoctorData();
  }, [idDoctor, ObtenerDoctorPorId, ObtenerOS, obrasSociales]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value,
    });
  };

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setDoctorData({ ...doctorData, idObraSocial: selectedOption.value });
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await ActualizarDoctor(idDoctor, doctorData);
      toast.success('Doctor actualizado con éxito');
      navigate('/admin');
    } catch (error) {
      toast.error('Error al actualizar el doctor');
      console.error('Error al actualizar doctor:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Actualizar Doctor</h2>

        <form onSubmit={handleUpdateDoctor} className="space-y-4">
          <div>
            <p className="text-center text-gray-600 text-lg">Nombre</p>
            <input
              type="text"
              name="nombre"
              value={doctorData.nombre}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Apellido</p>
            <input
              type="text"
              name="apellido"
              value={doctorData.apellido}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Dirección</p>
            <input
              type="text"
              name="direccion"
              value={doctorData.direccion}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Teléfono</p>
            <input
              type="text"
              name="telefono"
              value={doctorData.telefono}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Email</p>
            <input
              type="email"
              name="email"
              value={doctorData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Obra Social</p>
            <Select
              options={obrasSociales.map((obrasocial) => ({
                value: obrasocial.idObraSocial,
                label: obrasocial.nombre,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Duración del Turno (minutos)</p>
            <input
              type="text"
              name="duracionTurno"
              value={doctorData.duracionTurno}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors"
          >
            Actualizar Doctor
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>
      </div>
    </div>
  );
}