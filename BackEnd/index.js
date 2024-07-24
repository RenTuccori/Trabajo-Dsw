import express from 'express';
import usersRouter from './routes/usuarios.routes.js';
import doctorsRouter from './routes/doctores.routes.js';
import specialtiesRouter from './routes/especialidades.routes.js';
import turnosRouter from './routes/turnos.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json()); //para usar json en el body
app.use(usersRouter);
app.use(doctorsRouter);
app.use(specialtiesRouter);
app.use(turnosRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
