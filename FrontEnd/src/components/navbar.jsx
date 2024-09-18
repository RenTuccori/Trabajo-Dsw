import { Link } from 'react-router-dom';
import { FaCog, FaUserMd } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado
import logo from '../assets/logo.png'; // Asegúrate de que la ruta al logo sea correcta

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-14 w-14" />{' '}
            {/* Tamaño del logo */}
            <span className="text-2xl font-bold text-blue-800">
              Sanatorio UTN
            </span>{' '}
            {/* Tamaño del texto */}
          </Link>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          {/* Ícono de doctor */}
          <Link
            to="/doctor"
            className="text-blue-800 hover:text-blue-600 transition-colors"
          >
            <FaUserMd size={32} /> {/* Tamaño del ícono */}
          </Link>
          {/* Ícono de administración */}
          <Link
            to="/admin"
            className="text-blue-800 hover:text-blue-600 transition-colors"
          >
            <FaCog size={32} /> {/* Tamaño del ícono */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
