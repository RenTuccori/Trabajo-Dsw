import Select from 'react-select';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useEffect,useState } from 'react';


export function SacarTurno() {
    const navigate = useNavigate();
    const {sedes,especialidades,doctores, ObtenerSedes,ObtenerEspecialidades, ObtenerDoctores,fechas, ObtenerFechas,horarios, ObtenerHorarios, setDetalles} = usePacientes();
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedFecha, setSelectedFecha] = useState(null);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false); // Nuevo estado

    useEffect(() => {
        ObtenerSedes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
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
        setSelectedFecha(date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
        const day = (date.getDate()).toString().padStart(2, '0');
        date = `${year}-${month}-${day}`
        setSelectedHorario(null);
        if (selectedSede && date && selectedEspecialidad && selectedDoctor) {
            ObtenerHorarios({selectedDoctor, selectedEspecialidad, selectedSede, date});
        } 
    };

    
    const handleHorarioChange = (selectedOption) => {
        setSelectedHorario(selectedOption);
        setDetalles({selectedSede, selectedEspecialidad, selectedDoctor, selectedFecha, selectedHorario});
    };


    return (
        <div className="home-container">
            <div className="form" >
                <p className='text'>Sede</p>
                <Select class='select'
                    options={sedes.map(sede => ({ value: sede.idSede, label: sede.nombre }))}
                    onChange={handleSedeChange}
                    value={selectedSede}
                />
                <p className='text'>Especialidad</p>
                <Select class='select'
                    options={especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre }))}
                    onChange={handleEspecilidadChange}
                    value={selectedEspecialidad}
                    isDisabled={!selectedSede}
                />
                <p className='text'>Doctores</p>
                <Select class='select'
                    options={doctores.map(doctor => ({ value: doctor.idDoctor, label: doctor.nombreyapellido }))}
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    isDisabled={!selectedEspecialidad}
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
                />
                <button onClick={() => navigate('/paciente/datospersonales')}>Continuar</button>
            </div>
            <button onClick={() => navigate('/')}>Volver</button>
        </div>
    );
}
