import Select from 'react-select';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function SacarTurno() {
  const navigate = useNavigate();
  const {
    sedes,
    especialidades,
    doctores,
    ObtenerSedes,
    ObtenerEspecialidades,
    ObtenerDoctores,
    fechas,
    ObtenerFechas,
    horarios,
    ObtenerHorarios,
    setFechaYHora,
    setIdDoctor,
    setIdEspecialidad,
    setIdSede,
    setEstado,
    setFechaCancelacion,
    setFechaConfirmacion,
    comprobarToken,
  } = usePacientes();
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [formatedFecha, setFormatedFecha] = useState(null);

  useEffect(() => {
    ObtenerSedes();
    comprobarToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#1e40af' : '#374151', // Ajusta los colores para que se alineen con el estilo
      color: '#ffffff', // Texto blanco
      padding: '10px', // Espaciado
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Fondo blanco del select
      borderColor: '#1e40af', // Color del borde
      borderRadius: '0.375rem', // Bordes redondeados (Tailwind: rounded-md)
      boxShadow: '0 0 0 1px rgba(29, 78, 216, 0.1)', // Sombra sutil
      padding: '5px', // Espaciado
    }),
    menu: (provided) => ({
      ...provided,
      border: '0.1rem solid #1e40af', // Borde del menú
      borderRadius: '0.375rem', // Bordes redondeados
      marginTop: '4px', // Espaciado superior
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e40af', // Color del valor seleccionado
    }),
  };

  const handleSedeChange = async (selectedOption) => {
    setSelectedSede(selectedOption);
    setSelectedEspecialidad(null);
    setSelectedDoctor(null);
    if (selectedOption) {
      ObtenerEspecialidades({ idSede: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedEspecialidad(selectedOption);
    setSelectedDoctor(null);
    if (selectedSede && selectedOption) {
      ObtenerDoctores({
        idSede: selectedSede.value,
        idEspecialidad: selectedOption.value,
      });
    }
  };

  const handleDoctorChange = async (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setSelectedFecha(null);
    if (selectedSede && selectedOption && selectedEspecialidad) {
      ObtenerFechas({ selectedOption, selectedEspecialidad, selectedSede });
      console.log(fechas);
    }
  };

  /* const isDateAvailable = (date) => {
        const result = fechas.some(f =>
            f.getFullYear() === date.getFullYear() &&
            f.getMonth() === date.getMonth() &&
            f.getDate() === (date.getDate() - 1)
        );
        return result;
    };


    const handleFechaChange = async (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
        const day = (date.getDate()).toString().padStart(2, '0');
        date = `${year}-${month}-${day}`;
        setSelectedFecha(date);
        setSelectedHorario(null);
        if (selectedSede && date && selectedEspecialidad && selectedDoctor) {
            ObtenerHorarios({ selectedDoctor, selectedEspecialidad, selectedSede, date });
        }
    };*/

  const isDateAvailable = (date) => {
    // Aseguramos que la hora esté en 00:00 para evitar desfases invisibles
    date.setHours(0, 0, 0, 0);

    return fechas.some((f) => {
      f.setHours(0, 0, 0, 0); // Aseguramos la misma hora en las fechas de comparación
      return (
        f.getFullYear() === date.getFullYear() &&
        f.getMonth() === date.getMonth() &&
        f.getDate() === date.getDate()
      );
    });
  };
  const handleFechaChange = async (date) => {
    // Aseguramos que la hora de la fecha seleccionada esté en 00:00 para evitar desfases
    date.setHours(0, 0, 0, 0);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setFormatedFecha(formattedDate);
    setSelectedFecha(date); // Aquí mantenemos el objeto Date para el DatePicker
    setSelectedHorario(null);

    if (
      selectedSede &&
      formattedDate &&
      selectedEspecialidad &&
      selectedDoctor
    ) {
      await ObtenerHorarios({
        selectedDoctor,
        selectedEspecialidad,
        selectedSede,
        date: formattedDate,
      });
    }
  };

  const handleHorarioChange = (selectedOption) => {
    setSelectedHorario(selectedOption);
    setFechaYHora(`${formatedFecha} ${selectedOption.value}`);
    console.log(`${formatedFecha} ${selectedOption.value}`);
    setIdDoctor(selectedDoctor.value);
    setIdEspecialidad(selectedEspecialidad.value);
    setIdSede(selectedSede.value);
    setEstado('Pendiente');
    setFechaCancelacion(null);
    setFechaConfirmacion(null);
  };

  return (
    <form className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-lg">Sede</p>
          <Select
            className="react-select"
            options={sedes.map((sede) => ({
              value: sede.idSede,
              label: sede.nombre,
            }))}
            onChange={handleSedeChange}
            value={selectedSede}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Especialidad</p>
          <Select
            className="react-select"
            options={especialidades.map((especialidad) => ({
              value: especialidad.idEspecialidad,
              label: especialidad.nombre,
            }))}
            onChange={handleEspecilidadChange}
            value={selectedEspecialidad}
            isDisabled={!selectedSede}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Doctores</p>
          <Select
            className="react-select"
            options={doctores.map((doctor) => ({
              value: doctor.idDoctor,
              label: doctor.nombreyapellido,
            }))}
            value={selectedDoctor}
            onChange={handleDoctorChange}
            isDisabled={!selectedEspecialidad}
            styles={customStyles}
          />
          <p className="text-center text-gray-600 text-lg">Fecha</p>
          <DatePicker
            selected={selectedFecha}
            onChange={handleFechaChange}
            filterDate={isDateAvailable}
            placeholderText="Selecciona una fecha"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            disabled={!selectedDoctor} // Deshabilitar si no hay doctor seleccionado
            dateFormat="yyyy-MM-dd" // Formato consistente
          />
          <p className="text-center text-gray-600 text-lg">Horario</p>
          <Select
            className="react-select"
            options={horarios.map((horario) => ({
              value: horario.hora_inicio,
              label: horario.hora_inicio,
            }))}
            onChange={handleHorarioChange}
            value={selectedHorario}
            isDisabled={!selectedFecha}
            styles={customStyles}
          />
        </div>
        <button
          type="button"
          disabled={!selectedHorario}
          onClick={() => navigate('/paciente/confirmacionturno')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Continuar
        </button>
        <button
          type="button"
          onClick={() => navigate('/paciente')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
      </div>
    </form>
  );
}
