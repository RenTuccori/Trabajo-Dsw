import { Link } from 'react-router-dom';
import { FaCog, FaUserMd } from 'react-icons/fa'; // Make sure react-icons is installed
import logo from '../assets/logo.png'; // Make sure the logo path is correct

const Navbar = () => {
  return (
    <nav className="py-4" style={{
      background: 'linear - gradient(to right, #e0eafc, #cfdef3)', // W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+
    }}>
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-14 w-14" />{' '}
            {/* Logo size */}
            <span className="text-2xl font-bold text-blue-800">
              Sanatorio UTN
            </span>{' '}
            {/* Text size */}
          </Link>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          {/* Doctor icon */}
          <Link
            to="/doctor"
            className="text-blue-800 hover:text-blue-600 transition-colors"
          >
            <FaUserMd size={32} /> {/* Icon size */}
          </Link>
          {/* Administration icon */}
          <Link
            to="/admin"
            className="text-blue-800 hover:text-blue-600 transition-colors"
          >
            <FaCog size={32} /> {/* Icon size */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
