import express from 'express';
import usersRouter from './routes/usuarios.routes.js';
import doctorsRouter from './routes/doctores.routes.js';
import specialtiesRouter from './routes/especialidades.routes.js';
import turnosRouter from './routes/turnos.routes.js';
import horariosRouter from './routes/horarios.routes.js';
import pacienteRouter from './routes/pacientes.routes.js';
import obrassocialesRouter from './routes/obrassociales.routes.js';
import sedesRouter from './routes/sedes.routes.js';
import adminRouter from './routes/admin.routes.js';
import emailRoutes from './routes/email.routes.js';
import estudiosRouter from './routes/estudios.routes.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import config from 'dotenv';
import { sequelize } from './models/index.js';

import { startAutoCancelTurnos } from './autoCancelTurnos.js';
import { startAutoReminderEmails } from './autoreminderEmails.js';

config.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  let data = null;
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(' ')[1];
  }

  req.session = { rol: null };

  try {
    data = jwt.verify(token, JWT_SECRET);
    Object.assign(req.session, data);
  } catch {
    req.session.rol = null;
  }
  next();
});

app.use(usersRouter);
app.use(doctorsRouter);
app.use(specialtiesRouter);
app.use(turnosRouter);
app.use(horariosRouter);
app.use(pacienteRouter);
app.use(obrassocialesRouter);
app.use(sedesRouter);
app.use(adminRouter);
app.use(emailRoutes);
app.use(estudiosRouter);

startAutoCancelTurnos();
startAutoReminderEmails();

const startServer = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
