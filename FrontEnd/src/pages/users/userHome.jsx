// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';
import { useState, useEffect } from 'react';

function UserHome() {
  const navigate = useNavigate();
  const { nationalId, login, checkToken, firstName, lastName } =
    useAuth();
  const [nationalIdForm, setNationalIdForm] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login({
        identifier: nationalIdForm,
        credential: password,
        userType: 'Patient',
      });
      window.notifySuccess('Login successful!');
    } catch (error) {
      window.notifyError('Login error, please verify your credentials.');
    }
  };
  useEffect(() => {
    checkToken('Patient');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDniChange = (event) => {
    setNationalIdForm(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && nationalIdForm && password) {
      handleLogin();
    }
  };

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
          {nationalId && firstName && lastName
            ? `Welcome, ${firstName}`
            : 'Welcome to the appointment system'}
        </h1>

        {!nationalId ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-lg">Enter your national ID</p>
            <input
              type="text"
              value={nationalIdForm}
              onChange={handleDniChange}
              onKeyDown={handleKeyDown}
              placeholder="DNI"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
            <p className="text-center text-gray-600 text-lg">
              Enter your password
            </p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={!nationalIdForm || !password}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Verify
              </button>
              <button
                onClick={() => navigate('/patient/personalData')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/patient/bookAppointment')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book an appointment
            </button>
            <button
              onClick={() => navigate('/patient/myAppointments')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View my appointments
            </button>
            <button
              onClick={() => navigate('/patient/myStudies')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View my studies
            </button>
            <button
              onClick={() => navigate('/patient/editPersonalData')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit personal data
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHome;
