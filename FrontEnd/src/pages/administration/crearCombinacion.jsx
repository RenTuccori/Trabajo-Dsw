import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useEffect, useState } from 'react';

export function AsignarCombinacion() {
  const navigate = useNavigate();
  const { sedes, especialidades, doctores, ObtenerSedes, ObtenerEspecialidades, ObtenerDoctores, setIdDoctor, setIdEspecialidad, setIdSede } = useAdministracion();
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
      await ObtenerEspecialidades({ idSede: selectedOption.value });
    }
  };

  const handleEspecilidadChange = async (selectedOption) => {
    setSelectedEspecialidad(selectedOption);
    setSelectedDoctor(null);
    if (selectedSede && selectedOption) {
      await ObtenerDoctores({ idSede: selectedSede.value, idEspecialidad: selectedOption.value });
    }
  };

  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setIdDoctor(selectedOption.value);
    setIdEspecialidad(selectedEspecialidad.value);
    setIdSede(selectedSede.value);
  };

  return (
    <form className="turno-container">
      <div className="form">
        {/* Selección de Sede */}
        <p className='text'>Sede</p>
        <Select
          className='select'
          options={Array.isArray(sedes) ? sedes.map(sede => ({ value: sede.idSede, label: sede.nombre })) : []}
          onChange={handleSedeChange}
          value={selectedSede}
          styles={customStyles}
        />

        {/* Selección de Especialidad */}
        <p className='text'>Especialidad</p>
        <Select
          className='select'
          options={Array.isArray(especialidades) ? especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre })) : []}
          onChange={handleEspecilidadChange}
          value={selectedEspecialidad}
          isDisabled={!selectedSede}
          styles={customStyles}
        />

        {/* Selección de Doctor */}
        <p className='text'>Doctor</p>
        <Select
          className='select'
          options={Array.isArray(doctores) ? doctores.map(doctor => ({ value: doctor.idDoctor, label: doctor.nombreyapellido })) : []}
          onChange={handleDoctorChange}
          value={selectedDoctor}
          isDisabled={!selectedEspecialidad}
          styles={customStyles}
        />

        {/* Botón para confirmar la asignación */}
        <button
          disabled={!selectedDoctor}
          onClick={() => navigate('/paciente/confirmacioncombinacion')}
        >
          Confirmar
        </button>
      </div>

      <button onClick={() => navigate('/paciente')}>Volver</button>
    </form>
  );
}
