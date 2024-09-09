import Select from 'react-select';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useEffect,useState } from 'react';




export function SacarTurno() {
    const navigate = useNavigate();
    const {sedes,especialidades,doctores, ObtenerSedes,ObtenerEspecialidades, ObtenerDoctores,fechas, ObtenerFechas,horarios, ObtenerHorarios, setFechaYHora,
        setIdDoctor, setIdEspecialidad, setIdSede, setEstado, setFechaCancelacion, setFechaConfirmacion,comprobarToken} = usePacientes();
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedFecha, setSelectedFecha] = useState(null);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false); // Nuevo estado

    useEffect(() => {
        ObtenerSedes();
        comprobarToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#5368e0' : '#2a2e45', // Color de fondo cuando está seleccionado o enfocado
            color: '#ffffff', // Color de texto blanco
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Fondo del select
            color: '#5368e0', // Texto blanco en el control
            borderRadius: '5px', // Borde redondeado
            border: '2px solid #5368e0', // Borde del control
            padding: '5px', // Espaciado
        }),
        menu: (provided) => ({
            ...provided,
            border: '0.1rem solid white',
            borderRadius: '5px', // Borde redondeado
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#2a2e45', // Color del valor seleccionado
        }),
    };

    const handleSedeChange = async (selectedOption) => {
        setSelectedSede(selectedOption);
        setSelectedEspecialidad(null);
        setSelectedDoctor(null);
        setShowDatePicker(false); // Ocultar DatePicker al cambiar sede
        if (selectedOption) {
            ObtenerEspecialidades({idSede: selectedOption.value});
        } 
    };

    const handleEspecilidadChange = async (selectedOption) => {
        setSelectedEspecialidad(selectedOption);
        setSelectedDoctor(null);
        setShowDatePicker(false); // Ocultar DatePicker al cambiar especialidad
        if (selectedSede && selectedOption) {
          ObtenerDoctores({idSede: selectedSede.value, idEspecialidad: selectedOption.value});  
        }};

    const handleDoctorChange = async (selectedOption) => {
        setSelectedDoctor(selectedOption);
        setSelectedFecha(null);
        setShowDatePicker(true); // Mostrar DatePicker al seleccionar doctor
        if (selectedSede && selectedOption && selectedEspecialidad) {
            ObtenerFechas({selectedOption, selectedEspecialidad, selectedSede});
            }
    };

    const isDateAvailable = (date) => {
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
        date = `${year}-${month}-${day}`
        setSelectedFecha(date);
        setSelectedHorario(null);
        if (selectedSede && date && selectedEspecialidad && selectedDoctor) {
            ObtenerHorarios({selectedDoctor, selectedEspecialidad, selectedSede, date});
        } 
    };

    
    const handleHorarioChange = (selectedOption) => {
        setSelectedHorario(selectedOption);
        setFechaYHora(`${selectedFecha} ${selectedOption.value}`);
        setIdDoctor(selectedDoctor.value);
        setIdEspecialidad(selectedEspecialidad.value);
        setIdSede(selectedSede.value);
        setEstado('Pendiente');
        setFechaCancelacion(null);
        setFechaConfirmacion(null);
}

    return (
        <form className="home-container">
            <div className="form" >
                <p className='text'>Sede</p>
                <Select class='select'
                    options={sedes.map(sede => ({ value: sede.idSede, label: sede.nombre }))}
                    onChange={handleSedeChange}
                    value={selectedSede}
                    styles={customStyles}
                />
                <p className='text'>Especialidad</p>
                <Select class='select'
                    options={especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre }))}
                    onChange={handleEspecilidadChange}
                    value={selectedEspecialidad}
                    isDisabled={!selectedSede}
                    styles={customStyles}
                />
                <p className='text'>Doctores</p>
                <Select class='select'
                    options={doctores.map(doctor => ({ value: doctor.idDoctor, label: doctor.nombreyapellido }))}
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    isDisabled={!selectedEspecialidad}
                    styles={customStyles}
                />
                {showDatePicker && (
                    <>
                        <p>Fecha</p>
                        <DatePicker
                            selected={selectedFecha}
                            onChange={handleFechaChange}
                            filterDate={isDateAvailable}
                            placeholderText="Selecciona una fecha"
                        />
                    </>
                )}
                <p className='text'>Horario</p>
                <Select class='select'
                    options={horarios.map(horario => ({ value: horario.hora_inicio, label: horario.hora_inicio }))}
                    onChange={handleHorarioChange}
                    value={selectedHorario}
                    isDisabled={!selectedFecha}
                    styles={customStyles}
                />
                <button disabled={!selectedHorario} onClick={() => navigate('/paciente/confirmacionturno')}>Continuar</button>
            </div>
            <button onClick={() => navigate('/paciente')}>Volver</button>
        </form>
    );
}
