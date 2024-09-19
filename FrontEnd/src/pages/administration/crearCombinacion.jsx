import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Importa toast para las notificaciones

export function AsignarCombinacion() {
  const navigate = useNavigate();
  const { sedes, especialidades, doctores, ObtenerSedes, ObtenerEspecialidadesDisponibles, ObtenerDoctores, crearSedEspDoc } = useAdministracion();
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    ObtenerSedes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#5368e0' : '#2a2e45',
      color: '#ffffff',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      color: '#5368e0',
      borderRadius: '5px',
      border: '2px solid #5368e0',
      padding: '5px',
    }),
    menu: (provided) => ({
      ...provided,
      border: '0.1rem solid white',
      borderRadius: '5px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2a2e45',
    }),
  };

  const handleSedeChange = async (selectedOption) => {
    setSelectedSede(selectedOption);
    setSelectedEspecialidad(null);
    setSelectedDoctor(null);

    if (selectedOption) {
      await ObtenerEspecialidadesDisponibles({ idSede: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedEspecialidad(selectedOption);
    setSelectedDoctor(null);

    if (selectedSede && selectedOption) {
      await ObtenerDoctores();
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };

  const confirmarCombinacion = async () => {
    if (selectedSede && selectedEspecialidad && selectedDoctor) {
      try {
        console.log('selectedSede:', selectedSede.value);
        console.log('selectedEspecialidad:', selectedEspecialidad.value);
        console.log('selectedDoctor:', selectedDoctor.value);
        await crearSedEspDoc({
          idSede: selectedSede.value,
          idEspecialidad: selectedEspecialidad.value,
          idDoctor: selectedDoctor.value
        });
        toast.success('¡Combinación creada con éxito!'); // Mensaje de éxito
      } catch (error) {
        toast.error('Error al crear la combinación'); // Mensaje de error
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <form className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {/* Selección de Sede */}
        <div className="space-y-2">
          <label className="text-gray-700">Sede</label>
          <Select
            className='select'
            options={Array.isArray(sedes) ? sedes.map(sede => ({ value: sede.idSede, label: sede.nombre })) : []}
            onChange={handleSedeChange}
            value={selectedSede}
            styles={customStyles}
          />
        </div>

        {/* Selección de Especialidad */}
        <div className="space-y-2">
          <label className="text-gray-700">Especialidad</label>
          <Select
            className='select'
            options={Array.isArray(especialidades) ? especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre })) : []}
            onChange={handleEspecilidadChange}
            value={selectedEspecialidad}
            isDisabled={!selectedSede}
            styles={customStyles}
          />
        </div>

        {/* Selección de Doctor */}
        <div className="space-y-2">
          <label className="text-gray-700">Doctor</label>
          <Select
            className='select'
            options={Array.isArray(doctores) ? doctores.map(doctor => ({ value: doctor.idDoctor, label: doctor.nombreyapellido })) : []}
            onChange={handleDoctorChange}
            value={selectedDoctor}
            isDisabled={!selectedEspecialidad}
            styles={customStyles}
          />
        </div>

        {/* Botón para confirmar la asignación */}
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!selectedDoctor}
          onClick={confirmarCombinacion}  // Llamada a la función confirmarCombinacion
        >
          Confirmar
        </button>

        <button
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/admin')}
        >
          Volver
        </button>
      </form>
    </div>
  );
}
