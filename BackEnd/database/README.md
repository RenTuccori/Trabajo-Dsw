# Scripts de Base de Datos - Sistema Médico

Este directorio contiene scripts para configurar y cargar una base de datos completa y realista para el sistema de gestión médica.

## 📋 Scripts Disponibles

### 1. `update-db-structure.js`
Actualiza la estructura de la base de datos para soportar:
- Contraseñas hasheadas con bcrypt (campos VARCHAR(255))
- Limpieza de datos inválidos

```bash
node update-db-structure.js
```

### 2. `load-data-direct.js` ⭐ **PRINCIPAL**
Script principal que carga una base de datos completa con:
- 9 obras sociales
- 5 sedes médicas  
- 10 especialidades médicas
- 10 doctores especialistas
- 15 pacientes activos
- 365 fechas del año 2025
- 40 horarios disponibles
- 28 turnos (futuros, pasados y cancelados)
- 28 estudios médicos de ejemplo
- Contraseñas hasheadas con bcrypt

```bash
node load-data-direct.js
```

### 3. `create-admin.js`
Crea o actualiza el usuario administrador del sistema:

```bash
node create-admin.js
```

### 4. `verify-database.js`
Verifica la integridad y muestra estadísticas de la base de datos:

```bash
node verify-database.js
```

## 🚀 Instalación Completa

Para configurar una base de datos completa desde cero:

```bash
# 1. Actualizar estructura
node update-db-structure.js

# 2. Cargar datos completos
node load-data-direct.js

# 3. Configurar administrador  
node create-admin.js

# 4. Verificar instalación
node verify-database.js
```

## 🔑 Credenciales de Prueba

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Doctores
Todos los doctores usan la contraseña: `password123`

| DNI      | Nombre             | Especialidad           |
|----------|-------------------|------------------------|
| 12345678 | Carlos Rodríguez  | Cardiología           |
| 23456789 | María González    | Neurología            |
| 34567890 | Juan López        | Traumatología         |
| 45678901 | Ana Martínez      | Pediatría             |
| 56789012 | Roberto Silva     | Ginecología           |
| 67890123 | Patricia Moreno   | Medicina General      |
| 78901234 | Miguel Herrera    | Dermatología          |
| 89012345 | Lucia Vargas      | Oftalmología          |
| 90123456 | Ricardo Mendoza   | Otorrinolaringología  |
| 11223344 | Florencia Castro  | Psiquiatría           |

### Pacientes de Ejemplo
| DNI      | Nombre            | Obra Social      |
|----------|------------------|------------------|
| 87654321 | Laura Fernández  | OSDE            |
| 76543210 | Diego Pérez      | Swiss Medical   |
| 65432109 | Sofía Torres     | Medicus         |
| 54321098 | Martín Ruiz      | Galeno          |
| 43210987 | Valentina Morales| PAMI            |
| ... y 10 más |                  |                 |

## 📊 Datos Incluidos

### Obras Sociales (9)
- OSDE, Swiss Medical, Medicus, Galeno, PAMI
- IOMA, Unión Personal, Federada Salud, Particular

### Sedes Médicas (5)
- Sede Central (CABA)
- Sede Norte (CABA) 
- Sede Sur (CABA)
- Sede Oeste (Morón)
- Sede Este (Vicente López)

### Especialidades (10)
- Cardiología, Neurología, Traumatología
- Pediatría, Ginecología, Medicina General
- Dermatología, Oftalmología
- Otorrinolaringología, Psiquiatría

### Turnos (28)
- **Futuros:** 16 turnos (julio 2025)
- **Pasados:** 10 turnos (junio 2025)
- **Cancelados:** 3 turnos
- Estados: Pendiente, Confirmado, Completado, Cancelado

### Estudios Médicos (28)
- Electrocardiogramas, resonancias, radiografías
- Análisis clínicos, ecografías, biopsias
- Estudios oftalmológicos, audiometrías
- Evaluaciones psicológicas

## 🗓️ Fechas
- **Todas las fechas del año 2025** (365 fechas)
- Desde 2025-01-01 hasta 2025-12-31

## ⚠️ Notas Importantes

1. **Orden de Ejecución:** Ejecutar los scripts en el orden indicado
2. **Contraseñas:** Todas las contraseñas están hasheadas con bcrypt
3. **IDs Automáticos:** Los IDs se generan automáticamente, los scripts manejan las relaciones
4. **Datos Realistas:** Incluye turnos pasados y futuros, estudios variados, horarios completos
5. **Integridad:** Todos los datos mantienen integridad referencial

## 🔧 Troubleshooting

### Error de conexión a BD
Verificar configuración en `db.js`

### Error de foreign key
Ejecutar primero `update-db-structure.js`

### Datos duplicados
Los scripts usan `INSERT IGNORE` para evitar duplicados

### Verificar instalación
Ejecutar `verify-database.js` para diagnóstico completo

## 📁 Archivos de Respaldo

- `datos_prueba_corregidos.sql`: Script SQL estático (referencia)
- `db sanatorio.sql`: Estructura de la base de datos

Para usar estos archivos SQL directamente, importar en MySQL y ajustar IDs manualmente.

## 🎯 Casos de Uso

Esta base de datos de prueba permite probar:
- ✅ Login de doctores y administradores
- ✅ Gestión de turnos (crear, cancelar, confirmar)
- ✅ Carga y visualización de estudios
- ✅ Administración de usuarios y sedes
- ✅ Reportes y consultas
- ✅ Validaciones de integridad
- ✅ Flujos completos del sistema

¡Base de datos lista para desarrollo y testing! 🎉
