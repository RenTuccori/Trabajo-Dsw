import {AuthContext} from './AuthContext.jsx';
import {useContext, useState} from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../../api/doctores.api.js';
import { getUserDniFecha } from '../../api/usuarios.api.js';
import { getAdmin} from '../../api/admin.api.js'

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error(
        'useAuth must be used within an AuthProvider'
      );
    }
    return context;
  };

const AuthProvider = ({children}) => {
    const [dni, setDni] = useState('');
    const [idDoctor, setidDoctor] = useState('');
    const [idAdmin, setIdAdmin] = useState('');
    const [rol, setRol] = useState('');
    const navigate = useNavigate();



    async function login({ identifier, credential, userType }) {
        try {
          let response;
          let token;
      
          switch (userType) {
            case 'P': // Paciente
            {
              response = await getUserDniFecha({ dni: identifier, fechaNacimiento: credential });
              token = response.data;
              localStorage.setItem("token", token);
              const decodedPatient = jwtDecode(token);
              setDni(decodedPatient.dni);
              setRol('P')
              break;
            }
            case 'D': // Doctor
            {
              response = await verifyDoctor({ dni: identifier, contra: credential });
              token = response.data;
              localStorage.setItem("token", token);
              const decodedDoctor = jwtDecode(token);
              setidDoctor(decodedDoctor.idDoctor);
              setRol('D')
              break;
            }
            case 'A': // Admin
            {
              response = await getAdmin({ usuario: identifier, contra: credential });
              token = response.data;
              localStorage.setItem("token", token);
              const decodedAdmin = jwtDecode(token);
              setIdAdmin(decodedAdmin.idAdmin);
              setRol('A')
              break;
            }
            default:
              throw new Error("Tipo de usuario no válido");
          }
        } catch (error) {
          // Manejar errores de inicio de sesión
          console.error("Error en el inicio de sesión:", error);
          if (userType === 'P') setDni(null);
          else if (userType === 'D') setidDoctor(null);
          else if (userType === 'A') setIdAdmin(null);
          throw error;
        }
      }
      
    
    function comprobarToken(userType) {
        if (localStorage.getItem("token")) {
          try {
            const decoded = jwtDecode(localStorage.getItem("token"));
            if (decoded.exp < Date.now() / 1000) {
              console.error("Token expired");
              localStorage.removeItem("token");
              navigate("/");
            } else {
              switch (userType) {
                case 'P': // Paciente
                  setDni(decoded.dni);
                  break;
                case 'D': // Doctor
                  setidDoctor(decoded.idDoctor);
                  break;
                case 'A': // Admin
                  setIdAdmin(decoded.idAdmin);
                  break;
                default:
                  throw new Error("Tipo de usuario no válido");
              }
            }
          } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("token");
            navigate("/");
          }
        } else {
          switch (userType) {
            case 'P':
              setDni("");
              break;
            case 'D':
              setidDoctor("");
              break;
            case 'A':
              setIdAdmin("");
              break;
            default:
              throw new Error("Tipo de usuario no válido");
          }
        }
      }
      
return (
<AuthContext.Provider
value={{
          login,
          comprobarToken,
          dni,
          idDoctor,
          idAdmin,
          rol
    }}
     >
        {children}
    </AuthContext.Provider>
      );
};
    
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
    
export default AuthProvider;