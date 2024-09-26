import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export function AsignarCombinacion() {
  const navigate = useNavigate();
  const {
    sedes,
    especialidades,
    doctores,
    ObtenerSedes,
    ObtenerEspecialidadesDisponibles,
    ObtenerDoctores,
    crearSedEspDoc,
    borrarSedEspDoc,
    combinaciones, // Asume que tienes una lista de combinaciones en tu contexto
    obtenerCombinaciones // Asume que tienes una función para obtener combinaciones
  } = useAdministracion();

  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    ObtenerSedes();
    obtenerCombinaciones(); // Carga las combinaciones al montar el componente
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
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la asignación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await crearSedEspDoc({
            idSede: selectedSede.value,
            idEspecialidad: selectedEspecialidad.value,
            idDoctor: selectedDoctor.value,
          });

          toast.success('¡Combinación creada con éxito!');
          // Refresca las combinaciones después de la creación
          obtenerCombinaciones();
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Error al crear la combinación');
          }
        }
      }
    }
  };

  const handleDeleteCombinacion = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta combinación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await borrarSedEspDoc(id);
        toast.success('¡Combinación eliminada con éxito!');
        // Refresca las combinaciones después de la eliminación
        obtenerCombinaciones();
      } catch (error) {
        toast.error('Error al eliminar la combinación');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Formulario para crear combinaciones */}
        <form className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Asignar Combinación</h2>

          {/* Selección de Sede */}
          <div className="space-y-2">
            <label className="text-gray-700">Sede</label>
            <Select
              className="select"
              options={Array.isArray(sedes) ? sedes.map((sede) => ({
                value: sede.idSede,
                label: sede.nombre,
              })) : []}
              onChange={handleSedeChange}
              value={selectedSede}
              styles={customStyles}
            />
          </div>

          {/* Selección de Especialidad */}
          <div className="space-y-2">
            <label className="text-gray-700">Especialidad</label>
            <Select
              className="select"
              options={Array.isArray(especialidades) ? especialidades.map((especialidad) => ({
                value: especialidad.idEspecialidad,
                label: especialidad.nombre,
              })) : []}
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
              className="select"
              options={Array.isArray(doctores) ? doctores.map((doctor) => ({
                value: doctor.idDoctor,
                label: doctor.nombreyapellido,
              })) : []}
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
            onClick={confirmarCombinacion}
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

        {/* Separador */}
        <hr className="my-4 border-gray-300" />

        {/* Lista de combinaciones */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Combinaciones Asignadas</h2>
          <ul className="space-y-2 bg-white rounded-lg shadow-md p-4">
            {combinaciones && combinaciones.map((combinacion, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span>{`Sede: ${combinacion.nombreSede}, Especialidad: ${combinacion.nombreEspecialidad}, Doctor: ${combinacion.nombreDoctor} ${combinacion.apellidoDoctor}`}</span>
                <div className="flex space-x-4">
                  {/* Botón de Eliminar */}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteCombinacion(combinacion.nombreSede, combinacion.nombreEspecialidad, combinacion.nombreDoctor)}
                  >
                    Eliminar
                  </button>

                  {/* Botón de Agregar Horarios */}
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      const data = {
                        idSede: combinacion.idSede,
                        idEspecialidad: combinacion.idEspecialidad,
                        idDoctor: combinacion.idDoctor
                      };
                      console.log('Datos a enviar para agregar horarios:', data); // Log de los datos que se envían
                      navigate(`/admin/horarios`, { state: data });
                    }}
                  >
                    Agregar horarios
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
