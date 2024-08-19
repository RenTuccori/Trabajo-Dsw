import { useEffect } from 'react';
import { createTurno } from '../api/turnos';

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
        createTurno(body)
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

    return (
        <div>
            <h1>Turno confirmado:</h1>
            <p><strong>Fecha y Hora:</strong> {fechaYHora}</p>
            <p><strong>Especialidad:</strong> {idEspecialidad}</p>
            <p><strong>Doctor:</strong> {idDoctor}</p>
            <p><strong>Sede:</strong> {idSede}</p>
            <p><strong>Estado:</strong> Pendiente</p>
        </div>
    );
}
