import express from 'express';
import usersRouter from './routes/users.routes.js';
import doctorsRouter from './routes/doctors.routes.js';
import specialtiesRouter from './routes/specialties.routes.js';
import appointmentsRouter from './routes/appointments.routes.js';
import schedulesRouter from './routes/schedules.routes.js';
import patientsRouter from './routes/patients.routes.js';
import healthInsuranceRouter from './routes/health-insurance.routes.js';
import locationsRouter from './routes/locations.routes.js';
import adminRouter from './routes/admin.routes.js';
import emailRoutes from './routes/email.routes.js';
import studiesRouter from './routes/studies.routes.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import config from 'dotenv';
import { sequelize } from './models/index.js';

import { startAutoCancelAppointments } from './autoCancelAppointments.js';
import { startAutoReminderEmails } from './autoReminderEmails.js';

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

  req.session = { role: null };

  try {
    data = jwt.verify(token, JWT_SECRET);
    Object.assign(req.session, data);
  } catch {
    req.session.role = null;
  }
  next();
});

app.use(usersRouter);
app.use(doctorsRouter);
app.use(specialtiesRouter);
app.use(appointmentsRouter);
app.use(schedulesRouter);
app.use(patientsRouter);
app.use(healthInsuranceRouter);
app.use(locationsRouter);
app.use(adminRouter);
app.use(emailRoutes);
app.use(studiesRouter);

startAutoCancelAppointments();
startAutoReminderEmails();

const startServer = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
