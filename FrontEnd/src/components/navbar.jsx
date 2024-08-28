import { Link } from 'react-router-dom';
import '../estilos/navbar.css';


const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Sanatorio UTN
            </Link>
        </nav>
    );
};

export default Navbar;