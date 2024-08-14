import Select from 'react-select';
import { useEffect, useState } from 'react';
import { getSedes } from '../api/sedes.api';
import { getEspecialidades } from '../api/especialidades.api';
import { getDoctores } from '../api/doctores.api';

export function Ingreso() {
    const [sedes, setSedes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchSedes = async () => {
            const response = await getSedes();
            setSedes(response.data);
            console.log('Sedes fetched:', response.data); // Verificar que las sedes se obtienen correctamente
        };

        fetchSedes();
    }, []);

    const handleSedeChange = async (selectedOption) => {
        setSelectedSede(selectedOption);
        setSelectedEspecialidad(null); // Limpiar selección de especialidad
        setSelectedDoctor(null); // Limpiar selección de doctor
        setDoctores([]); // Reiniciar doctores
        if (selectedOption) {
            const response = await getEspecialidades({ idSede: selectedOption.value });
            console.log('Especialidades fetched:', response.data); // Verificar que las especialidades se obtienen correctamente
            setEspecialidades(response.data);
        } else {
            setEspecialidades([]);
        }
    };

    const handleEspecilidadChange = async (selectedOption) => {
        setSelectedEspecialidad(selectedOption);
        setSelectedDoctor(null); // Limpiar selección de doctor
        if (selectedSede && selectedOption) {
            const response = await getDoctores({
                idSede: selectedSede.value,
                idEspecialidad: selectedOption.value
            });
            console.log('Doctores fetched:', response.data); // Verificar que se obtienen los doctores
            setDoctores(response.data);
        } else {
            setDoctores([]);
        }
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
                    isDisabled={!selectedSede} // Deshabilitar hasta que se seleccione una sede
                />
                <p>Doctores</p>
                <Select
                    options={doctores.map(doctor => ({ value: doctor.idDoctor, label: doctor.nombreyapellido }))}
                    value={selectedDoctor}
                    onChange={(option) => setSelectedDoctor(option)}
                    isDisabled={!selectedEspecialidad} // Deshabilitar hasta que se seleccione una especialidad
                />
            </div>
        </div>
    );
}