import Select from 'react-select';
import { useEffect, useState } from 'react';
import { getSedes } from '../api/sedes.api';
import { getEspecialidades } from '../api/especialidades.api';
import { getDoctores } from '../api/doctores.api';
import { getFechasDispTodos, getHorariosDisp } from '../api/horarios.api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../estilos/white-text.css';

export function SacarTurno() {
    const navigate = useNavigate();
    const [sedes, setSedes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedFecha, setSelectedFecha] = useState(null);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false); // Nuevo estado

    useEffect(() => {
        const fetchSedes = async () => {
            const response = await getSedes();
            setSedes(response.data);
            console.log('Sedes fetched:', response.data);
        };

        fetchSedes();
    }, []);

    const handleSedeChange = async (selectedOption) => {
        setSelectedSede(selectedOption);
        localStorage.setItem('idSede',selectedOption.value);
        setSelectedEspecialidad(null);
        setSelectedDoctor(null);
        setDoctores([]);
        setShowDatePicker(false); // Ocultar DatePicker al cambiar sede
        if (selectedOption) {
            const response = await getEspecialidades({ idSede: selectedOption.value });
            console.log('Especialidades fetched:', response.data);
            setEspecialidades(response.data);
        } else {
            setEspecialidades([]);
        }
    };

    const handleEspecilidadChange = async (selectedOption) => {
        setSelectedEspecialidad(selectedOption);
        localStorage.setItem('idEspecialidad',selectedOption.value);
        console.log('Especialidad seleccionada:', selectedOption.value);
        setSelectedDoctor(null);
        setShowDatePicker(false); // Ocultar DatePicker al cambiar especialidad
        if (selectedSede && selectedOption) {
            const response = await getDoctores({
                idSede: selectedSede.value,
                idEspecialidad: selectedOption.value
            });
            console.log('Doctores fetched:', response.data);
            setDoctores(response.data);
        } else {
            setDoctores([]);
        }
    };

    const handleDoctorChange = async (selectedOption) => {
        setSelectedDoctor(selectedOption);
        localStorage.setItem('idDoctor',selectedOption.value);
        console.log('Doctor seleccionado:', selectedOption.value);
        setSelectedFecha(null);
        setShowDatePicker(true); // Mostrar DatePicker al seleccionar doctor
        if (selectedSede && selectedOption && selectedEspecialidad) {
            const response = await getFechasDispTodos({
                idDoctor: selectedOption.value,
                idEspecialidad: selectedEspecialidad.value,
                idSede: selectedSede.value
            });
            console.log('Fechas fetched:', response.data);
            const fechasFormateadas = response.data.map(item => {
                console.log('Fecha original:', item.fecha);
                return new Date(item.fecha);
            });
            setFechas(fechasFormateadas);
        } else {
            setFechas([]);
        }
    };

    const isDateAvailable = (date) => {
        const result = fechas.some(f => 
            f.getFullYear() === date.getFullYear() &&
            f.getMonth() === date.getMonth() &&
            f.getDate() === (date.getDate()-1)
        );
        return result;
    };
    

    const handleFechaChange = async (date) => {
        setSelectedFecha(date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
        const day = (date.getDate()).toString().padStart(2, '0');
        date = `${year}-${month}-${day}`
        localStorage.setItem('fecha',date);
        console.log('Fecha seleccionada:', date);
        setSelectedHorario(null);
        if (selectedSede && date && selectedEspecialidad && selectedDoctor) {
            const response = await getHorariosDisp({
                idDoctor: selectedDoctor.value,
                idEspecialidad: selectedEspecialidad.value,
                idSede: selectedSede.value,
                fecha: date
            });
            console.log('Horarios fetched:', response.data);
            setHorarios(response.data);
        } else {
            setHorarios([]);
        }
    };
    
   
    const handleHorarioChange = (selectedOption) => {
        setSelectedHorario(selectedOption);
        localStorage.setItem('hora',selectedOption.value);
        console.log('Horario seleccionado:', selectedOption.value);
    };

    return (
        <div className="container">
            <div className="form">
                <p className='text'>Sede</p>
                <Select
                    options={sedes.map(sede => ({ value: sede.idSede, label: sede.nombre }))}
                    onChange={handleSedeChange}
                    value={selectedSede}
                />
                <p className='text'>Especialidad</p>
                <Select
                    options={especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre }))}
                    onChange={handleEspecilidadChange}
                    value={selectedEspecialidad}
                    isDisabled={!selectedSede}
                />
                <p className='text'>Doctores</p>
                <Select
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
                <Select
                    options={horarios.map(horario => ({ value: horario.hora_inicio, label: horario.hora_inicio }))}
                    onChange={handleHorarioChange}
                    value={selectedHorario}
                    isDisabled={!selectedFecha}
                />
                <button onClick={() => navigate('/datospersonales')}>Continuar</button>
            </div>
        </div>
    );
}
