import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';

function AdministrationHome() {
  const { login, idAdmin, checkToken } = useAuth();
  const [user, setUser] = useState('');
  const [password, setContra] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkToken('Admin');
  }, [checkToken]);

  const handleLogin = async () => {
    try {
      await login({
        identifier: user,
        credential: password,
        userType: 'Admin',
      });
      window.notifySuccess('Login successful!');
    } catch (error) {
      window.notifyError('Error: Invalid username or password');
    }
  };

  const handleUserChange = (event) => setUser(event.target.value);
  const handleContraChange = (event) => setContra(event.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && user && password) {
      handleLogin();
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4">
      <p className="text-center text-gray-600 text-lg">Enter your username</p>
      <input
        type="text"
        value={user}
        onChange={handleUserChange}
        onKeyDown={handleKeyDown}
        placeholder="Username"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
      />
      <p className="text-center text-gray-600 text-lg">Enter your password</p>
      <input
        type="password"
        value={password}
        onChange={handleContraChange}
        onKeyDown={handleKeyDown}
        placeholder="Password"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleLogin}
        disabled={!user || !password}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Verify
      </button>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/admin/createLocation')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Locations
      </button>
      <button
        onClick={() => navigate('/admin/createSpecialty')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Specialties
      </button>
      <button
        onClick={() => navigate('/admin/createDoctor')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Doctors
      </button>
      <button
        onClick={() => navigate('/admin/createCombination')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Assign combination
      </button>
      <button
        onClick={() => navigate('/admin/createInsurance')}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Health Insurances
      </button>
      <button
        onClick={() => {
          navigate('/');
          localStorage.removeItem('token');
        }}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Log out
      </button>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/src/components/fondo2.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-0"></div>

      {/* Content */}
      <div className="relative z-10 bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Administration Portal
        </h1>
        {!idAdmin ? renderLoginForm() : renderMenu()}
      </div>
    </div>
  );
}

export default AdministrationHome;
