import Select from 'react-select';
import { useEffect, useState } from 'react';
import { getSedes } from '../api/sedes.api';
import { getEspecialidades } from '../api/especialidades.api';
import { getDoctores } from '../api/doctores.api';
import { getFechasDispTodos, getHorariosDisp } from '../api/horarios.api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function Ingreso() {
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
        console.log('Horario seleccionado:', selectedOption);
    };

    return (
        <div className="container">
            <div className="form">
                <p>Sede</p>
                <Select
                    options={sedes.map(sede => ({ value: sede.idSede, label: sede.nombre }))}
                    onChange={handleSedeChange}
                    value={selectedSede}
                />
                <p>Especialidad</p>
                <Select
                    options={especialidades.map(especialidad => ({ value: especialidad.idEspecialidad, label: especialidad.nombre }))}
                    onChange={handleEspecilidadChange}
                    value={selectedEspecialidad}
                    isDisabled={!selectedSede}
                />
                <p>Doctores</p>
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
                <p>Horario</p>
                <Select
                    options={horarios.map(horario => ({ value: horario.hora_inicio, label: horario.hora_inicio }))}
                    onChange={handleHorarioChange}
                    value={selectedHorario}
                    isDisabled={!selectedFecha}
                />
            </div>
        </div>
    );
}
