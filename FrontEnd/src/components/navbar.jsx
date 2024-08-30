import { Link } from 'react-router-dom';
import '../estilos/navbar.css';
import { FaCog } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Sanatorio UTN
            </Link>
            <Link to="/admin" className="navbar-tool">
                <FaCog />
            </Link>
        </nav>
    );
};

export default Navbar;
