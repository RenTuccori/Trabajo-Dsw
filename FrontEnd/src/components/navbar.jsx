import { Link } from 'react-router-dom';
import '../estilos/navbar.css';
import { FaCog } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado
import logo from '../assets/logo.png'; // Asegúrate de que la ruta al logo sea correcta

const Navbar = () => {
    return (
        <nav className="navbar d-flex justify-content-between">
            <Link to="/" className="navbar-brand d-flex align-items-center">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <span>Sanatorio UTN</span>
            </Link>
            <Link to="/admin" className="navbar-tool">
                <FaCog />
            </Link>
        </nav>
    );
};

export default Navbar;
