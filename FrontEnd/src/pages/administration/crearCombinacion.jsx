import Select from "react-select";
import { useAdministracion } from "../../context/administracion/AdministracionProvider.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { notifySuccess, notifyError } from "../../components/ToastConfig";
import { confirmDialog } from "../../components/SwalConfig";

export function CrearCombinacion() {
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
    obtenerCombinaciones, // Asume que tienes una función para obtener combinaciones
  } = useAdministracion();

  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    console.log('🔄 Inicializando página de combinaciones');
    ObtenerSedes()
      .then(() => console.log('✅ Sedes cargadas'))
      .catch(err => console.error('❌ Error al cargar sedes:', err));
    
    ObtenerEspecialidadesDisponibles()
      .then(() => console.log('✅ Especialidades cargadas'))
      .catch(err => console.error('❌ Error al cargar especialidades:', err));
    
    ObtenerDoctores()
      .then(() => console.log('✅ Doctores cargados'))
      .catch(err => console.error('❌ Error al cargar doctores:', err));
    
    obtenerCombinaciones()
      .then(() => console.log('✅ Combinaciones cargadas'))
      .catch(err => console.error('❌ Error al cargar combinaciones:', err));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#5368e0" : "#2a2e45",
      color: "#ffffff",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      color: "#5368e0",
      borderRadius: "5px",
      border: "2px solid #5368e0",
      padding: "5px",
    }),
    menu: (provided) => ({
      ...provided,
      border: "0.1rem solid white",
      borderRadius: "5px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#2a2e45",
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
      const result = await confirmDialog(
        "¿Está seguro?",
        "Esta acción no se puede deshacer."
      );

      if (result.isConfirmed) {
        try {
          await crearSedEspDoc({
            idSede: selectedSede.value,
            idEspecialidad: selectedEspecialidad.value,
            idDoctor: selectedDoctor.value,
          });

          notifySuccess("¡Combinación creada con éxito!");
          // Refresca las combinaciones después de la creación
          obtenerCombinaciones();
        } catch (error) {
          if (error.response && error.response.status === 400) {
            notifyError(error.response.data.message);
          } else {
            notifyError("Error al crear la combinación");
          }
        }
      }
    }
  };

  const handleDeleteCombinacion = async (idSede, idDoctor, idEspecialidad) => {
    const result = await confirmDialog(
      "¿Estás seguro?",
      "¿Deseas eliminar esta combinación?"
    );

    if (result.isConfirmed) {
      try {
        await borrarSedEspDoc({ idSede, idDoctor, idEspecialidad });
        notifySuccess("¡Combinación eliminada con éxito!");
        // Refresca las combinaciones después de la eliminación
        obtenerCombinaciones();
      } catch (error) {
        notifySuccess("Error al eliminar la combinación");
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
              options={
                Array.isArray(sedes)
                  ? sedes.map((sede) => ({
                      value: sede.idSede,
                      label: sede.nombre,
                    }))
                  : []
              }
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
              options={
                Array.isArray(especialidades)
                  ? especialidades.map((especialidad) => ({
                      value: especialidad.idEspecialidad,
                      label: especialidad.nombre,
                    }))
                  : []
              }
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
              options={
                Array.isArray(doctores)
                  ? doctores.map((doctor) => ({
                      value: doctor.idDoctor,
                      label: doctor.nombreyapellido,
                    }))
                  : []
              }
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
            onClick={() => navigate("/admin")}
          >
            Volver
          </button>
        </form>

        {/* Separador */}
        <hr className="my-4 border-gray-300" />

        {/* Lista de combinaciones */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Combinaciones Asignadas
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            {combinaciones && combinaciones.length > 0 ? (
              <ul className="space-y-2">
                {combinaciones.map((combinacion, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        <span className="font-semibold">Sede:</span> {combinacion.nombreSede || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Especialidad:</span> {combinacion.nombreEspecialidad || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Doctor:</span> {`${combinacion.nombreDoctor || ''} ${combinacion.apellidoDoctor || ''}`.trim() || 'N/A'}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {/* Botón de Agregar Horarios */}
                      <button
                        className="text-blue-600 hover:text-blue-800 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                        onClick={() => {
                          const data = {
                            idSede: combinacion.idSede,
                            idEspecialidad: combinacion.idEspecialidad,
                            idDoctor: combinacion.idDoctor,
                          };
                          console.log(
                            "Datos a enviar para agregar horarios:",
                            data
                          );
                          navigate(`/admin/horarios`, { state: data });
                        }}
                      >
                        Horarios
                      </button>

                      {/* Botón de Eliminar */}
                      <button
                        className="text-red-600 hover:text-red-800 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                        onClick={() =>
                          handleDeleteCombinacion(
                            combinacion.idSede,
                            combinacion.idDoctor,
                            combinacion.idEspecialidad
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600 py-4">
                No hay combinaciones asignadas aún.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
