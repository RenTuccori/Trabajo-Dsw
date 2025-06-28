import { Link } from 'react-router-dom';
import { useAuth } from '../context/global/AuthProvider'; // Import useAuth
import logo from '../assets/logo.png';

const Navbar = () => {
  const { userType } = useAuth(); // Get user type from auth context

  // Determine home route based on user type
  const getHomeRoute = () => {
    switch(userType) {
      case 'D': return '/doctor';
      case 'A': return '/admin'; 
      case 'P': return '/paciente';
      default: return '/';
    }
  };

  return (
    <nav className="py-4" style={{
      background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
    }}>
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <Link to={getHomeRoute()} className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-14 w-14" />
            <span className="text-2xl font-bold text-blue-800">
              Sanatorio UTN
            </span>
          </Link>
        </div>
        {/* Navigation icons section removed - users should only access their assigned role */}
      </div>
    </nav>
  );
};

export default Navbar;
