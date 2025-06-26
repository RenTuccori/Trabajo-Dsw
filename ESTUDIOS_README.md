# Funcionalidad de Gestión de Estudios Médicos

## Descripción

Se ha implementado una funcionalidad completa para que los doctores puedan subir estudios médicos y los pacientes puedan visualizar y descargar sus estudios.

## Características Implementadas

### Backend

- **Controlador de Estudios** (`estudios.controllers.js`):

  - Subida de archivos con validación de tipos permitidos (PDF, JPG, JPEG, PNG, DOC, DOCX)
  - Límite de tamaño de archivo: 10MB
  - Gestión de archivos en el servidor
  - Funciones CRUD completas para estudios

- **Rutas de API** (`estudios.routes.js`):

  - `POST /api/estudios/upload` - Subir nuevo estudio (solo doctores)
  - `GET /api/estudios/paciente/:idPaciente` - Ver estudios de un paciente
  - `GET /api/estudios/doctor/:idDoctor` - Ver estudios subidos por un doctor
  - `GET /api/estudios/download/:idEstudio` - Descargar archivo de estudio
  - `DELETE /api/estudios/:idEstudio` - Eliminar estudio (solo doctores)

- **Base de Datos**: La tabla `estudios` ya existía con la estructura correcta:
  ```sql
  CREATE TABLE `estudios` (
    `idEstudio` INT NOT NULL AUTO_INCREMENT,
    `idPaciente` INT NOT NULL,
    `idDoctor` INT NOT NULL,
    `fechaRealizacion` DATE NOT NULL,
    `fechaCarga` DATETIME NOT NULL,
    `nombreArchivo` VARCHAR(255) NOT NULL,
    `rutaArchivo` VARCHAR(255) NOT NULL,
    `descripcion` TEXT,
    PRIMARY KEY (`idEstudio`),
    FOREIGN KEY (`idPaciente`) REFERENCES `pacientes` (`idPaciente`),
    FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`)
  );
  ```

### Frontend

#### Para Doctores

- **Página de Gestión de Estudios** (`/doctor/estudios`):
  - Formulario para subir nuevos estudios con validaciones
  - Selección de paciente desde lista
  - Campo de fecha de realización
  - Campo opcional de descripción
  - Subida de archivos con validación de formato
  - Lista de estudios subidos por el doctor
  - Funcionalidad de descarga de archivos

#### Para Pacientes

- **Página de Visualización de Estudios** (`/paciente/estudios`):
  - Visualización de todos los estudios del paciente
  - Información del doctor que subió cada estudio
  - Fechas de realización y carga
  - Descripción de cada estudio
  - Funcionalidad de descarga de archivos

### APIs Frontend

- **API de Estudios** (`estudios.api.js`):
  - Funciones para todas las operaciones CRUD
  - Manejo de FormData para subida de archivos
  - Gestión de descargas con responseType blob

## Navegación

### Doctores

1. Iniciar sesión como doctor en `/doctor`
2. Hacer clic en "Gestión de Estudios"
3. Subir nuevos estudios o ver estudios previos

### Pacientes

1. Iniciar sesión como paciente en `/paciente`
2. Hacer clic en "Ver mis estudios"
3. Visualizar y descargar estudios

## Archivos Creados/Modificados

### Backend

- ✅ `controllers/estudios.controllers.js` - Nuevo
- ✅ `routes/estudios.routes.js` - Nuevo
- ✅ `index.js` - Modificado (agregadas rutas de estudios)
- ✅ `files/estudios/` - Directorio creado para archivos

### Frontend

- ✅ `api/estudios.api.js` - Nuevo
- ✅ `api/pacientes.api.js` - Modificado (agregada función getPacientes)
- ✅ `pages/doctors/subirEstudio.jsx` - Nuevo
- ✅ `pages/users/verEstudios.jsx` - Nuevo
- ✅ `routes/doctores.routes.jsx` - Modificado (ruta estudios)
- ✅ `routes/pacientes.routes.jsx` - Modificado (ruta estudios)
- ✅ `pages/doctors/homeDoctor.jsx` - Modificado (botón estudios)
- ✅ `pages/users/homeUsuario.jsx` - Modificado (botón estudios)

## Dependencias Agregadas

- **multer** - Para manejo de subida de archivos en el backend

## Seguridad

- Autenticación requerida para todas las operaciones
- Los doctores solo pueden subir estudios
- Los pacientes solo pueden ver sus propios estudios
- Validación de tipos de archivo permitidos
- Límites de tamaño de archivo

## Próximos Pasos Sugeridos

1. Implementar notificaciones por email cuando se sube un nuevo estudio
2. Agregar funcionalidad para editar descripciones de estudios
3. Implementar categorización de estudios por tipo
4. Agregar funcionalidad de búsqueda y filtrado de estudios
5. Implementar previsualización de archivos (especialmente PDFs e imágenes)
