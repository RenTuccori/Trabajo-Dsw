# 🏥 Sistema de Gestión de Clínica

Sistema completo para la gestión de citas médicas, doctores, pacientes y especialidades en una clínica.

## 📋 Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación rápida](#instalación-rápida)
- [Instalación manual](#instalación-manual)
- [Configuración](#configuración)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación adicional](#documentación-adicional)
- [Solución de problemas](#solución-de-problemas)

---

## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalados:

### Obligatorio:
- **Node.js** versión 14 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **MySQL** servidor ([Descargar aquí](https://www.mysql.com/downloads/))

### Verificar instalación:

Abre una terminal (cmd, PowerShell o bash) y ejecuta:

```bash
node --version
npm --version
mysql --version
```

Deberías ver números de versión en cada uno.

---

## 🚀 Instalación rápida

Si solo quieres instalar y ejecutar lo más rápido posible:

### 1. Clonar el repositorio

```bash
git clone https://github.com/RenTuccori/Trabajo-Dsw.git
cd Trabajo-Dsw
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará automáticamente las dependencias del backend. Para el frontend, ejecuta:

```bash
cd FrontEnd
npm install
cd ..
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` en la carpeta `BackEnd`:

```bash
copy BackEnd\.env.example BackEnd\.env
```

Edita `BackEnd\.env` con tus valores (ver sección [Configuración](#configuración))

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Esto abrirá automáticamente:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

---

## 🔧 Instalación manual

Si prefieres instalar paso a paso para entender cada parte:

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/RenTuccori/Trabajo-Dsw.git
cd Trabajo-Dsw
```

### Paso 2: Instalar dependencias del Backend

```bash
cd BackEnd
npm install
cd ..
```

**¿Qué hace esto?** Instala todas las librerías necesarias para que el servidor funcione (Express, JWT, base de datos, etc.)

### Paso 3: Instalar dependencias del Frontend

```bash
cd FrontEnd
npm install
cd ..
```

**¿Qué hace esto?** Instala todas las librerías necesarias para la interfaz (React, Vite, etc.)

### Paso 4: Crear base de datos

1. Abre MySQL desde la terminal o MySQL Workbench
2. Crea una nueva base de datos:

```sql
CREATE DATABASE nombre_clinica;
```

3. Importa el esquema (opcional, si existe archivo SQL):

```sql
USE nombre_clinica;
SOURCE BackEnd/database/clinic.sql;
```

### Paso 5: Configurar variables de entorno

Ve a la carpeta `BackEnd` y crea un archivo `.env`:

```bash
cd BackEnd
```

Crea un archivo llamado `.env` con este contenido:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_secreto_super_seguro_aqui
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=nombre_clinica
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_aplicacion
VITE_API_URL=http://localhost:3000
```

Luego vuelve a la raíz:

```bash
cd ..
```

---

## ⚙️ Configuración

### Variables de entorno (Backend)

Crea un archivo `.env` en la carpeta `BackEnd`:

```env
# Puerto del servidor
PORT=3000

# Entorno (development o production)
NODE_ENV=development

# Secreto para firmar tokens JWT
JWT_SECRET=tu_clave_secreta_aqui_min_32_caracteres

# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=clinica_db

# Configuración de Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_app_gmail
```

### Variables de entorno (Frontend)

Crea un archivo `.env` en la carpeta `FrontEnd`:

```env
# URL del servidor backend
VITE_API_URL=http://localhost:3000
```

### Obtener credenciales de Gmail (para envío de emails)

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Selecciona "Seguridad" en el menú izquierdo
3. Activa "Verificación en dos pasos"
4. Ve a "Contraseñas de aplicaciones"
5. Genera una contraseña para aplicación y cópiala en `SMTP_PASS`

---

## ▶️ Ejecutar el proyecto

### Opción 1: Desarrollo (lo más común)

Ejecuta ambos servidores simultáneamente:

```bash
npm run dev
```

Se abrirán automáticamente:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Opción 2: Backend y Frontend por separado

**Terminal 1 - Backend:**
```bash
cd BackEnd
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd
npm run dev
```

### Opción 3: Modo producción

**Backend:**
```bash
cd BackEnd
npm start
```

**Frontend:**
```bash
cd FrontEnd
npm run build
npm run preview
```

---

## 📜 Scripts disponibles

### En la raíz del proyecto

| Script | Descripción |
|--------|-------------|
| `npm install` | Instala dependencias del backend |
| `npm start` | Inicia solo el backend en producción |
| `npm run dev` | Inicia backend y frontend en desarrollo |

### En BackEnd/

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia con nodemon (reinicia automáticamente) |
| `npm test` | Ejecuta los tests unitarios |
| `npm run test:watch` | Ejecuta tests en modo observación |
| `npm run test:coverage` | Genera reporte de cobertura de tests |

### En FrontEnd/

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con Vite |
| `npm run build` | Compila para producción |
| `npm run lint` | Verifica el código con ESLint |
| `npm run preview` | Previsualiza la build de producción |

---

## 📁 Estructura del proyecto

```
Trabajo-Dsw/
├── BackEnd/                          # 🖥️ Servidor (API REST)
│   ├── controllers/                  # Lógica de negocios
│   ├── models/                       # Modelos de base de datos
│   ├── routes/                       # Rutas de la API
│   ├── services/                     # Servicios reutilizables
│   ├── middleware/                   # Validación y autenticación
│   ├── database/                     # Scripts SQL
│   ├── files/                        # Archivos subidos
│   ├── test/                         # Tests automatizados
│   ├── index.js                      # Punto de entrada
│   ├── package.json                  # Dependencias
│   └── .env                          # Variables de entorno (NO SUBIR)
│
├── FrontEnd/                         # 🎨 Interfaz de usuario
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── pages/                    # Páginas principales
│   │   ├── api/                      # Llamadas al backend
│   │   ├── context/                  # Estado global
│   │   ├── locales/                  # Traducciones (i18n)
│   │   ├── App.jsx                   # Componente principal
│   │   └── main.jsx                  # Punto de entrada
│   ├── public/                       # Archivos estáticos
│   ├── package.json                  # Dependencias
│   ├── .env                          # Variables de entorno
│   └── vite.config.js                # Configuración de Vite
│
├── package.json                      # Root package.json
├── render.yaml                       # Configuración de deploy
└── README.md                         # Este archivo
```

---

## 📚 Documentación adicional

### Ver documentación de API

Abre el archivo [BackEnd/API_DOCUMENTATION.md](BackEnd/API_DOCUMENTATION.md) para ver todos los endpoints disponibles.

### Tecnologías utilizadas

**Backend:**
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **JWT** - Autenticación segura
- **MySQL** - Base de datos
- **Nodemailer** - Envío de emails
- **Multer** - Carga de archivos
- **Jest** - Testing

**Frontend:**
- **React 18** - Librería de UI
- **Vite** - Bundler rápido
- **React Router** - Navegación
- **Axios** - HTTP client
- **TailwindCSS** - Estilos
- **i18next** - Internacionalización

---

## 🐛 Solución de problemas

### "Error: Cannot find module 'express'"

**Solución:** Instala las dependencias:
```bash
npm install
cd BackEnd && npm install
cd ../FrontEnd && npm install
cd ..
```

---

### "Error: ECONNREFUSED - Cannot connect to MySQL"

**Solución:** Verifica que MySQL esté corriendo:

**Windows:**
```bash
# Abre Services (servicios) y busca MySQL
# O desde PowerShell:
Start-Service MySQL80  # (cambia el número según tu versión)
```

**Mac/Linux:**
```bash
brew services start mysql
# O
sudo service mysql start
```

---

### "Error: ENOENT .env file not found"

**Solución:** Crea el archivo `.env` en `BackEnd/`:

```bash
cd BackEnd
echo. > .env  # Windows
# O
touch .env   # Mac/Linux
```

Luego completa con tus valores.

---

### "Error: Port 3000 already in use"

**Solución:** Cambia el puerto en `BackEnd/.env`:

```env
PORT=3001  # O cualquier otro puerto disponible
```

---

### "El frontend se carga pero los datos no aparecen"

**Posibles causas:**
1. Backend no está corriendo - verifica que `npm run dev` esté activo
2. `VITE_API_URL` incorrecto en `FrontEnd/.env`
3. Clave JWT en Backend es diferente

**Solución:**
- Verifica que ambos servidores estén corriendo
- Comprueba los puertos: Backend (3000), Frontend (5173)
- Revisa la consola del navegador (F12) para ver errores

---

### "Error: JWT malformed"

**Causa:** Token JWT mal generado o secreto incorrecto

**Solución:**
- Asegúrate que `JWT_SECRET` en `BackEnd/.env` tiene al menos 32 caracteres
- Reinicia el backend: `npm run dev`

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa este README nuevamente
2. Consulta la sección [Documentación adicional](#documentación-adicional)
3. Verifica los logs en la terminal
4. Abre un issue en GitHub con detalles del error

---

## 📝 Licencia

Este proyecto es de uso educativo.

---

## 🎯 Próximos pasos después de instalar

1. ✅ Crea un usuario administrador
2. ✅ Agrega ubicaciones de la clínica
3. ✅ Registra especialidades médicas
4. ✅ Añade doctores
5. ✅ Los pacientes pueden registrarse y agendar citas

---

**¿Listo?** Comienza con: `npm run dev` 🚀
