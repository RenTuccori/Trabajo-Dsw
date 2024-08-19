import { useEffect, useState } from 'react';
import { createTurno } from '../api/turnos.api';
import { getSpecialtyById } from '../api/especialidades.api';
import { getDoctorById } from '../api/doctores.api';
import { getSedeById } from '../api/sedes.api';

export function ConfirmacionTurno() {
    const [nombreEspecialidad, setNombreEspecialidad] = useState('');
    const [nombreDoctor, setNombreDoctor] = useState('');
    const [apellidoDoctor, setApellidoDoctor] = useState('');
    const [nombreSede, setNombreSede] = useState('');
    const [direccionSede, setDireccionSede] = useState('');

    useEffect(() => {
        // Obtener los valores del localStorage
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
        console.log('Body:', body);

        // Crear el turno
        createTurno({ body })
            .then(response => {
                console.log('Turno creado con éxito:', response);
            })
            .catch(error => {
                console.error('Error al crear el turno:', error);
            });

        // Obtener los datos adicionales de especialidad, doctor y sede
        getSpecialtyById({ idEspecialidad })
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
    }, []); // El array vacío asegura que el efecto se ejecute solo una vez después del primer render

    const fecha = localStorage.getItem('fecha');
    const hora = localStorage.getItem('hora');
    const fechaYHora = `${fecha} ${hora}`;

    return (
        <div>
            <h1>Turno confirmado:</h1>
            <p><strong>Fecha y Hora:</strong> {fechaYHora}</p>
            <p><strong>Especialidad:</strong> {nombreEspecialidad}</p>
            <p><strong>Doctor:</strong> {nombreDoctor} {apellidoDoctor}</p>
            <p><strong>Sede:</strong> {nombreSede}, {direccionSede}</p>
            <p><strong>Estado:</strong> Pendiente</p>
        </div>
    );
}



/*import { useEffect } from 'react';
import { createTurno } from '../api/turnos.api';
import { getSpecialtyById } from '../api/especialidades.api';
import { getDoctorById } from '../api/doctores.api';
import { getSedeById } from '../api/sedes.api';
/*import { getObraSocial } from '../api/obrasociales.api';
import { getPacienteDni } from '../api/pacientes.api';

export function ConfirmacionTurno() {
    useEffect(() => {
        // Obtener los valores del localStorage
        const idPaciente = localStorage.getItem('idPaciente');
        const fecha = localStorage.getItem('fecha');
        const hora = localStorage.getItem('hora');
        const idEspecialidad = localStorage.getItem('idEspecialidad');
        const idDoctor = localStorage.getItem('idDoctor');
        const idSede = localStorage.getItem('idSede');
        const fechaCancelacion = null;
        const fechaConfirmacion = null;
        const estado = 'Pendiente';

        // Concatenar la fecha y la hora
        const fechaYHora = `${fecha} ${hora}`;

        // Crear el cuerpo de la solicitud
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

        // Llamar a la función createTurno
        createTurno({body})
            .then(response => {
                // Manejar la respuesta si es necesario
                console.log('Turno creado con éxito:', response);
            })
            .catch(error => {
                // Manejar el error si ocurre
                console.error('Error al crear el turno:', error);
            });

    }, []); // El array vacío asegura que el efecto se ejecute solo una vez después del primer render
    
    const idEspecialidad = localStorage.getItem('idEspecialidad');
    const idDoctor = localStorage.getItem('idDoctor');
    const idSede = localStorage.getItem('idSede');
    const fecha = localStorage.getItem('fecha');
    const hora = localStorage.getItem('hora');
    const fechaYHora = `${fecha} ${hora}`;
    
    let nombreEspecialidad;
    let nombreDoctor;
    let apellidoDoctor;
    let nombreSede;
    let direccionSede;

    getSpecialtyById({ idEspecialidad })
        .then(response => {
            console.log('Especialidad:', response.data);
            nombreEspecialidad = response.data.nombre;
            console.log('Especialidad:', response.data);
        })
        .catch(error => {
            console.error('Error al obtener la especialidad:', error);
        });

    getDoctorById({ idDoctor })
        .then(response => {
            nombreDoctor = response.data.nombre;
            apellidoDoctor = response.data.apellido;
            console.log('Doctor:', response.data);
        })
        .catch(error => {
            console.error('Error al obtener el doctor:', error);
        });
    
    getSedeById({ idSede }) 
        .then(response => {
            nombreSede = response.data.nombre;
            direccionSede = response.data.direccion;
            console.log('Sede:', response.data);
        })
        .catch(error => {
            console.error('Error al obtener la sede:', error);});  

    return (    
        <div>
            <h1>Turno confirmado:</h1>
            <p><strong>Fecha y Hora:</strong> {fechaYHora}</p>
            <p><strong>Especialidad:</strong> {nombreEspecialidad}</p>
            <p><strong>Doctor:</strong> {{ nombreDoctor }} {{ apellidoDoctor }}</p>
            <p><strong>Sede:</strong> {{nombreSede}} {{direccionSede}}</p>
            <p><strong>Estado:</strong> Pendiente</p>
        </div>
    );}
*/