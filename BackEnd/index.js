import express from 'express';
import usersRouter from './routes/usuarios.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json()); //para usar json en el body
app.use(usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
