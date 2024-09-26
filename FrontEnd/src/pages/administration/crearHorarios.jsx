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

  const { obtenerHorariosXDoctor, crearHorarios, horariosDoctor, comprobarToken } = useAdministracion();
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia) => ({ dia, hora_inicio: '', hora_fin: '' })) // Inicializar con días de la semana
  );

  // Comprobar token y cargar los horarios del doctor
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        await comprobarToken();
        await obtenerHorariosXDoctor({ idSede, idEspecialidad, idDoctor });

        // Mapear los horariosDoctor existentes a los días correspondientes
        const nuevosHorarios = diasSemana.map((dia) => {
          const horarioExistente = horariosDoctor.find((horario) => horario.dia === dia);
          console.log('Horario existente:', horarioExistente);
          return {
            dia,
            hora_inicio: horarioExistente ? horarioExistente.hora_inicio : '', // Asegúrate de usar los nombres correctos de la base de datos
            hora_fin: horarioExistente ? horarioExistente.hora_fin : '' // Usando hora_inicio y hora_fin
          };
        });
        setHorarios(nuevosHorarios);
        console.log('Horarios cargados:', nuevosHorarios);
      } catch (error) {
        toast.error('Error al cargar los horarios');
      }
    };

    if (idSede && idEspecialidad && idDoctor) {
      cargarHorarios();
    } else {
      toast.error('Faltan datos para cargar horarios');
    }
  }, []);

  const handleInputChange = (index, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value; // field puede ser 'hora_inicio' o 'hora_fin'
    setHorarios(nuevosHorarios);
  };

  const agregarHorariosDisponibles = async () => {
    const horariosValidos = horarios.filter(horario => horario.hora_inicio && horario.hora_fin);

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
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            estado : 'Habilitado'
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

          {/* Ingreso de nuevos horarios, con los horarios existentes ya pre-rellenados */}
          {diasSemana.map((dia, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1/4">{dia}</span>
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora inicio"
                value={horarios[index]?.hora_inicio || ''}
                onChange={(e) => handleInputChange(index, 'hora_inicio', e.target.value)} // Asegurarse de que sea 'hora_inicio'
              />
              <input
                type="time"
                className="w-1/3 border border-gray-300 rounded-md p-2"
                placeholder="Hora fin"
                value={horarios[index]?.hora_fin || ''}
                onChange={(e) => handleInputChange(index, 'hora_fin', e.target.value)} // Asegurarse de que sea 'hora_fin'
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
