import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDniFecha, updateUser } from '../../api/usuarios.api';
import Select from 'react-select';
import { getObraSociales } from '../../api/obrasociales.api';
import '../../estilos/sacarturno.css';

export function EditarDatosPersonales() {
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
    const [userExists, setUserExists] = useState(false);

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
            const user = response.data;
            setFormData({
                ...formData,
                nombre: user.nombre,
                apellido: user.apellido,
                telefono: user.telefono,
                email: user.email,
                direccion: user.direccion,
                idObraSocial: user.idObraSocial
            });
            setSelectedObraSociales({
                value: user.idObraSocial,
                label: obrasociales.find(os => os.idObraSocial === user.idObraSocial)?.nombre || 'No asignada'
            });
            setUserExists(true);
        } else {
            console.log('Usuario no encontrado');
            alert('Usuario no encontrado');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateUser(formData);

        if (response.data) {
            console.log('Usuario actualizado con éxito');
            navigate('/paciente');
        } else {
            console.log('Error al actualizar usuario');
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
    };

    return (
        <div className="container">
            {!userExists ? (
                <form onSubmit={handleCheckUser} className='form'>
                    <p className='text'>DNI</p>
                    <input
                        type="text"
                        name="dni"
                        placeholder="DNI"
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
                    <button type="submit">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
}
