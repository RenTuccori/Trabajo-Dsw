# 🚀 Guía de Inicio Rápido

Si solo quieres empezar sin leer todo el README, sigue estos 3 pasos:

## Paso 1: Instalación (1 minuto)

### Windows:
Haz doble clic en `install.bat`

```bash
# O manualmente en terminal:
npm install && cd BackEnd && npm install && cd ../FrontEnd && npm install && cd ..
```

### Mac/Linux:
```bash
chmod +x install.sh
./install.sh
```

## Paso 2: Configuración (3 minutos)

### 1. Copia los archivos de configuración

**BackEnd/.env:**
```bash
cd BackEnd
copy .env.example .env
```

Edita `BackEnd/.env` con:
- Tu contraseña MySQL
- Tu email de Gmail y [contraseña de aplicación](https://myaccount.google.com/apppasswords)

**FrontEnd/.env:**
```bash
cd ../FrontEnd
copy .env.example .env
```

### 2. Crea la base de datos

```bash
mysql -u root -p
```

Luego ejecuta:
```sql
CREATE DATABASE clinica_db;
```

## Paso 3: ¡Ejecutar! (1 segundo)

### Windows:
Haz doble clic en `start.bat`

```bash
# O en terminal:
npm run dev
```

### Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

Se abrirá automáticamente:
- 🎨 Frontend: http://localhost:5173
- 🖥️ Backend: http://localhost:3000

---

## 📝 Credenciales por defecto (si aplica)

- **Admin**: admin@clinic.com / password
- **Doctor**: cedula / password
- **Paciente**: cedula / password

> Nota: Adapta según tu base de datos

---

## 🐛 Algo no funciona?

### "Error: Module not found"
```bash
npm install
cd BackEnd && npm install && cd ../FrontEnd && npm install
```

### "Cannot connect to MySQL"
Asegúrate de que MySQL esté corriendo:

**Windows:**
- Abre Services (servicios)
- Busca MySQL y inicia el servicio

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo service mysql start
```

### "Port 3000 already in use"
Abre `BackEnd/.env` y cambia:
```env
PORT=3001
```

---

**¿Necesitas más ayuda?** Consulta [README.md](README.md)

**¿Quieres conocer los endpoints?** Consulta [BackEnd/API_DOCUMENTATION.md](BackEnd/API_DOCUMENTATION.md)
