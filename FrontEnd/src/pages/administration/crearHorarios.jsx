import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearHorarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idSede, idEspecialidad, idDoctor } = location.state || {};

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const { obtenerHorariosXDoctor, crearHorarios, horariosDoctor } = useAdministracion();
  const [horariosExistentes, setHorariosExistentes] = useState([]);
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia) => ({
      dia,
      horaInicio: '',
      horaFin: ''
    }))
  );

  // Obtener horarios ya existentes para el doctor, sede y especialidad
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const horariosResponse = await obtenerHorariosXDoctor({ idSede, idEspecialidad, idDoctor });
        console.log('Horarios existentes:', horariosResponse); // Log para verificar los horarios obtenidos
        setHorariosExistentes(horariosResponse);
      } catch (error) {
        toast.error('Error al cargar los horarios');
      }
    };

    if (idSede && idEspecialidad && idDoctor) {
      cargarHorarios();
    } else {
      toast.error('Faltan datos para cargar horarios');
    }
  }, [idSede, idEspecialidad, idDoctor, obtenerHorariosXDoctor]);


  const handleInputChange = (index, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value;
    setHorarios(nuevosHorarios);
  };

  const agregarHorariosDisponibles = async () => {
    const horariosValidos = horarios.filter(horario => horario.horaInicio && horario.horaFin);

    if (horariosValidos.length === 0) {
      toast.error('Debes ingresar al menos un horario válido.');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas confirmar los horarios ingresados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        for (const horario of horariosValidos) {
          await crearHorarios({
            idSede,
            idDoctor,
            idEspecialidad,
            dia: horario.dia,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
          });
        }
        toast.success('Horarios creados exitosamente');
        navigate('/admin'); // Navegar de vuelta a la página de administración
      } catch (error) {
        toast.error('Error al crear los horarios.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Crear Horarios</h2>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium">Sede: {idSede}, Especialidad: {idEspecialidad}, Doctor: {idDoctor}</h3>

          {/* Mostrar horarios ya existentes */}
          <div className="mb-4">
            <h4 className="text-lg font-medium">Horarios Existentes</h4>
            {horariosExistentes.length > 0 ? (
              <ul>
                {horariosExistentes.map((horario, index) => (
                  <li key={index} className="border-b py-2">
                    {`${horario.dia}: ${horario.horaInicio} - ${horario.horaFin}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay horarios existentes para este doctor.</p>
            )}
          </div>

          {/* Ingreso de nuevos horarios */}
          {horarios.map((horario, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1/4">{horario.dia}</span>
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora inicio"
                value={horario.horaInicio}
                onChange={(e) => handleInputChange(index, 'horaInicio', e.target.value)}
              />
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora fin"
                value={horario.horaFin}
                onChange={(e) => handleInputChange(index, 'horaFin', e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={agregarHorariosDisponibles}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar horarios
          </button>

          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/admin')}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
