import express from 'express';
import usersRouter from './routes/users.routes.js';
import doctorsRouter from './routes/doctors.routes.js';
import specialtiesRouter from './routes/specialties.routes.js';
import appointmentsRouter from './routes/appointments.routes.js';
import schedulesRouter from './routes/schedules.routes.js';
import patientsRouter from './routes/patients.routes.js';
import insuranceRouter from './routes/insurance.routes.js';
import venuesRouter from './routes/venues.routes.js';
import adminRouter from './routes/admin.routes.js';
import emailRoutes from './routes/email.routes.js';
import studiesRouter from './routes/studies.routes.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Import auto-cancellation and auto-reminder functions
import { startAutoCancelTurnos } from './autoCancelTurnos.js'; // Appointment cancellation every 30 minutes
import { startAutoReminderEmails } from './autoreminderEmails.js'; // Email reminders every 30 minutes

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // To use JSON in the body

app.use((req, res, next) => {
  let data = null;
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    token = authHeader.split(' ')[1];
  }

  req.session = { rol: null };

  try {
    if (token) {
      data = jwt.verify(token, 'CLAVE_SUPER_SEGURISIMA');
      req.session.rol = data.rol;
    } else {
    }
  } catch (e) {
    req.session.rol = null;
  }

  next();
});

app.use(usersRouter);
app.use(doctorsRouter);
app.use(specialtiesRouter);
app.use(appointmentsRouter);
app.use(schedulesRouter);
app.use(patientsRouter);
app.use(insuranceRouter);
app.use(venuesRouter);
app.use(adminRouter);
app.use(emailRoutes);
app.use(studiesRouter);

// Start automatic execution of appointment cancellation
startAutoCancelTurnos();

// Start automatic execution of email reminders
startAutoReminderEmails();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
