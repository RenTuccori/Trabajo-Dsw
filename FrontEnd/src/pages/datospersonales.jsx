import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUserDniFecha } from '../api/usuarios.api'; // checkUserExists es una nueva función que verifica si el usuario existe
import Select from 'react-select';
import { getObraSociales } from '../api/obrasociales.api';

export function DatosPersonales() {
    const [obrasociales, setObraSociales] = useState([]);
    const [selectedObraSociales, setSelectedObraSociales] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dni: '',
        fechaNacimiento: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
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
            // Si el usuario existe, puedes redirigirlo a otra página o hacer algo diferente
            navigate('/confirmacion'); // Redirige a una página de confirmación, si existe
        } else {
            console.log('Usuario no encontrado, mostrar formulario completo');
            setUserExists(true); // Cambia el estado para mostrar el formulario completo
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createUser(formData);
        if (response.data.success) {
            console.log('Usuario registrado con éxito');
            navigate('/'); // Redirige a una página de confirmación, si existe
        } else {
            console.log('Error al registrar usuario');
        }
    };  
    useEffect(() => {
        const fetchObraSociales = async () => {
            const response = await getObraSociales();
            setObraSociales(response.data);
            console.log('Obras sociales fetched:', response.data);
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
                <form onSubmit={handleCheckUser}>
                    <p>DNI</p>
                    <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Fecha de Nacimiento</p>
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
                <form onSubmit={handleSubmit}>
                    <p>Nombre</p>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Apellido</p>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Dirección</p>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Teléfono</p>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Email</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <p>Obra Social</p>
                    <Select
                        options={obrasociales.map(obrasociales => ({ value: obrasociales.nombre, label: obrasociales.nombre }))}
                        onChange={handleObraSocialChange}
                        value={selectedObraSociales}
                    />
                    <button type="submit">Enviar</button>
                </form>
                
            )}
        </div>
    );
}

