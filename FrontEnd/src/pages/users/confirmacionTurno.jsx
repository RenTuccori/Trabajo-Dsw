import { useEffect, useState } from 'react';
import { createTurno } from '../../api/turnos.api';
import { getEspecialidadById } from '../../api/especialidades.api';
import { getDoctorById } from '../../api/doctores.api';
import { getSedeById } from '../../api/sedes.api';
import '../../estilos/home.css';
import '../../estilos/tarjetaturno.css';
import { useNavigate } from 'react-router-dom';

export function ConfirmacionTurno() {
    const [nombreEspecialidad, setNombreEspecialidad] = useState('');
    const [nombreDoctor, setNombreDoctor] = useState('');
    const [apellidoDoctor, setApellidoDoctor] = useState('');
    const [nombreSede, setNombreSede] = useState('');
    const [direccionSede, setDireccionSede] = useState('');
    const navigate = useNavigate();

    const idPaciente = localStorage.getItem('idPaciente');
    const fecha = localStorage.getItem('fecha');
    const hora = localStorage.getItem('hora');
    const idEspecialidad = localStorage.getItem('idEspecialidad');
    const idDoctor = localStorage.getItem('idDoctor');
    const idSede = localStorage.getItem('idSede');
    const fechaCancelacion = null;
    const fechaConfirmacion = null;
    const estado = 'Pendiente';

    const fechaYHora = `${fecha} ${hora}`;

    const body = {
        idPaciente,
        fechaYHora,
        fechaCancelacion,
        fechaConfirmacion,
        estado,
        idEspecialidad,
        idDoctor,
        idSede,
    };

    // Crear el turno
    useEffect(() => {
        createTurno(body)
            .then(response => {
                console.log('Turno creado con éxito:', response);
            })
            .catch(error => {
                console.error('Error al crear el turno:', error);
            });
    }, []); // The empty array ensures that the effect runs only once after the initial render

    // Obtener los datos adicionales de especialidad, doctor y sede
    useEffect(() => {
        getEspecialidadById({ idEspecialidad })
            .then(response => {
                setNombreEspecialidad(response.data.nombre);
                console.log('Especialidad:', response.data.nombre);
            })
            .catch(error => {
                console.error('Error al obtener la especialidad:', error);
            });

        getDoctorById({ idDoctor })
            .then(response => {
                setNombreDoctor(response.data.nombre);
                setApellidoDoctor(response.data.apellido);
            })
            .catch(error => {
                console.error('Error al obtener el doctor:', error);
            });

        getSedeById({ idSede })
            .then(response => {
                setNombreSede(response.data.nombre);
                setDireccionSede(response.data.direccion);
            })
            .catch(error => {
                console.error('Error al obtener la sede:', error);
            });
    }, []);

    return (
        <div className='container'>
            <div className='turno-card'>
                <h1>Turno confirmado:</h1>
                <p>
                    <strong>Fecha y Hora:</strong> {fechaYHora}
                </p>
                <p>
                    <strong>Especialidad:</strong> {nombreEspecialidad}
                </p>
                <p>
                    <strong>Doctor:</strong> {nombreDoctor} {apellidoDoctor}
                </p>
                <p>
                    <strong>Sede:</strong> {nombreSede}, {direccionSede}
                </p>
                <p>
                    <strong>Estado:</strong> Pendiente
                </p>
            </div>
            <button className='button' onClick={() => navigate('/paciente')}>
                Volver
            </button>
        </div>
    );
}