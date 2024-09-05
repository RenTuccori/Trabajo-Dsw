import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUserDniFecha } from '../../api/usuarios.api'; // checkUserExists es una nueva función que verifica si el usuario existe
import Select from 'react-select';
import { getObraSociales } from '../../api/obrasociales.api';
import { getPacienteDni,createPaciente } from '../../api/pacientes.api';
import '../../estilos/sacarturno.css';

export function DatosPersonales() {
    const [obrasociales, setObraSociales] = useState([]);
    const [selectedObraSociales, setSelectedObraSociales] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dni: '',
        fechaNacimiento: '',
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        idObraSocial: ''
    });
    const [userExists, setUserExists] = useState(false); // Estado para manejar si el usuario existe o no

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };
    
    const handleCheckUser = async (e) => {
        e.preventDefault();
        const { dni, fechaNacimiento } = formData;
        const response = await getUserDniFecha({ dni, fechaNacimiento });

        if (response.data) {
            console.log('Usuario encontrado');
            const datapaciente = await getPacienteDni({dni});
            console.log('Paciente encontrado:', datapaciente.data.idPaciente);
            localStorage.setItem('idPaciente',datapaciente.data.idPaciente);
            console.log('idPaciente:',localStorage.getItem('idPaciente'));
            // Si el usuario existe, puedes redirigirlo a otra página o hacer algo diferente
            navigate('/confirmacionturno'); // Redirige a una página de confirmación, si existe
        } else {
            console.log('Usuario no encontrado, mostrar formulario completo');
            setUserExists(true); // Cambia el estado para mostrar el formulario completo
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const response = await createUser(formData);
        const response1 = await createPaciente({dni:formData.dni});
        if (response.data) {
            console.log('Usuario registrado con éxito');
            if (response1.data){
                console.log('Paciente registrado con éxito');}
                const reponse2 = await getPacienteDni({dni:formData.dni});
                localStorage.setItem('idPaciente',reponse2.data.idPaciente);
            navigate('/confirmacionturno'); // Redirige a una página de confirmación, si existe
        } else {
            console.log('Error al registrar usuario');
        }
    };  
    useEffect(() => {
        const fetchObraSociales = async () => {
            const response = await getObraSociales();
            setObraSociales(response.data);
        };
        fetchObraSociales();
    }, []);

    const handleObraSocialChange = (selectedOption) => {
        setSelectedObraSociales(selectedOption);
        setFormData(prevFormData => ({
            ...prevFormData,
            idObraSocial: selectedOption.value
        }));
    }
    return (
        <div className="container">
            {!userExists ? (
                <form onSubmit={handleCheckUser} className='form'>
                    <p className='text'>DNI</p>
                    <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Fecha de Nacimiento</p>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Verificar</button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className='form'>
                    <p className='text'>Nombre</p>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Apellido</p>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Dirección</p>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Teléfono</p>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Email</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text'>Obra Social</p>
                    <Select
                        options={obrasociales.map(obrasociales => ({ value: obrasociales.idObraSocial, label: obrasociales.nombre }))}
                        onChange={handleObraSocialChange}
                        value={selectedObraSociales}
                    />
                    <button type="submit">Enviar</button>
                </form>
                
            )}
        </div>
    );
}

