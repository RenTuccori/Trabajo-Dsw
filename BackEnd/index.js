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
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); //para usar json en el body
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
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
