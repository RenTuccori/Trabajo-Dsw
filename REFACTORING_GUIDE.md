# Refactoring del Sistema - Mejoras Implementadas

## 1. Problema: Importación duplicada de estilos Toast

### ❌ ANTES

```jsx
// En ToastConfig.jsx
import 'react-toastify/dist/ReactToastify.css';

// En App.jsx
import 'react-toastify/dist/ReactToastify.css';
```

### ✅ DESPUÉS

```jsx
// Solo en App.jsx (nivel global)
import 'react-toastify/dist/ReactToastify.css';

// En ToastConfig.jsx - Sin importación duplicada
import { toast } from 'react-toastify';
```

## 2. Problema: Validación de token duplicada en componentes

### ❌ ANTES - Cada componente valida individualmente

```jsx
// En cada componente
const { comprobarToken } = useAuth();
useEffect(() => {
  comprobarToken('P'); // o 'D' o 'A'
}, []);
```

### ✅ DESPUÉS - Validación centralizada

#### A. Interceptor de Axios mejorado

```javascript
// En axiosInstance.js
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

const handleInvalidToken = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new CustomEvent('tokenExpired'));
  window.location.href = '/';
};

// Interceptor de request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      handleInvalidToken();
      return Promise.reject(new Error('Token expirado'));
    }
  }
  return config;
});
```

#### B. AuthProvider mejorado

```jsx
// Escucha eventos de token expirado
useEffect(() => {
  const handleTokenExpired = () => {
    // Limpiar estados
    setDni('');
    setIdDoctor('');
    setIdAdmin('');
    setNombreUsuario('');
    setApellidoUsuario('');
    setRol('');
  };

  window.addEventListener('tokenExpired', handleTokenExpired);
  return () => window.removeEventListener('tokenExpired', handleTokenExpired);
}, []);
```

#### C. Validación en rutas protegidas

```jsx
// En validacion.jsx
export function Validacion({ rol, children, esperado }) {
  const { comprobarToken } = useAuth();

  useEffect(() => {
    comprobarToken(esperado); // Solo una vez al nivel de ruta
  }, [comprobarToken, esperado]);

  // ... resto del componente
}
```

#### D. Componentes simplificados

```jsx
// ❌ ANTES
export function TurnosDoctorFecha() {
  const { comprobarToken } = useAuth();

  useEffect(() => {
    comprobarToken('D'); // ← ELIMINAR ESTO
    Historico();
  }, []);
}

// ✅ DESPUÉS
export function TurnosDoctorFecha() {
  // Sin comprobarToken - se maneja en la validación de rutas

  useEffect(() => {
    Historico(); // Solo lógica del componente
  }, []);
}
```

## 3. Configuración de ambientes mejorada

### Frontend .env

```env
VITE_DB_URL=192.168.100.70:3000
VITE_API_BASE_URL=http://192.168.100.70:3000/api
VITE_APP_NAME=Sistema de Turnos Médicos
VITE_TOKEN_EXPIRY_CHECK_INTERVAL=300000
```

## 4. Patrón de refactoring para aplicar

### Paso 1: Identificar componentes con comprobarToken

```bash
# Buscar todos los usos
grep -r "comprobarToken" src/pages/
```

### Paso 2: Eliminar de componentes individuales

```jsx
// Eliminar estas líneas de cada componente:
const { comprobarToken } = useAuth();
useEffect(() => {
  comprobarToken('X'); // ← ELIMINAR
}, []);
```

### Paso 3: Verificar que las rutas usen Validacion

```jsx
// Asegurar que cada ruta protegida use:
<Validacion rol={rol} esperado="P">
  {' '}
  {/* o "D" o "A" */}
  <ComponenteProtegido />
</Validacion>
```

## 5. Beneficios obtenidos

- ✅ **DRY (Don't Repeat Yourself)**: Eliminamos duplicación de código
- ✅ **Separación de responsabilidades**: La validación no está en cada componente
- ✅ **Manejo centralizado**: Un solo lugar para manejar tokens expirados
- ✅ **Interceptor transparente**: Todas las requests se validan automáticamente
- ✅ **Mejor UX**: Redirección automática cuando el token expira
- ✅ **Código más limpio**: Componentes se enfocan en su lógica específica

## 6. Componentes pendientes de refactoring

Para completar el refactoring, eliminar `comprobarToken` de:

- homeUsuario.jsx ✅ (ya hecho)
- turnosDoctorFecha.jsx ✅ (ya hecho)
- sacarturno.jsx ✅ (ya hecho)
- turnosPaciente.jsx (pendiente)
- modificacionUsuario.jsx (pendiente)
- confirmacionTurno.jsx (pendiente)
- turnosDoctorHoy.jsx (pendiente)
- turnosDoctorHistorico.jsx (pendiente)
- homeDoctor.jsx (pendiente)
- homeAdministracion.jsx (pendiente)

## 7. Validación final

Una vez completado el refactoring:

1. ✅ No más importaciones duplicadas de CSS
2. ✅ Interceptor de axios maneja tokens automáticamente
3. ✅ Componentes de validación manejan permisos
4. ✅ Componentes individuales sin lógica de autenticación
5. ✅ Variables de entorno configuradas
