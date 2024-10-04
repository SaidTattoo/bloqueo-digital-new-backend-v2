import cors from 'cors'; // Importa el paquete cors
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import activityRoutes from './activity/activity.routes';
import authRoutes from './auth/auth.routes';
import connectDB from './database';
import { setupSwagger } from './swagger'; // Importa la configuración de Swagger
import usersRoutes from './users/users.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS
app.use(cors());

// Configurar Swagger
setupSwagger(app);

// Rutas de la aplicación
app.use('/activities', activityRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express and MongoDB!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});