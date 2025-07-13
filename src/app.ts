import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import { swaggerUi, swaggerSpec } from './swagger/swagger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173', // Vue app URL
  credentials: true
}));

app.use(express.json());

// Swagger UI
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Auth routes
app.use('/api', authRoutes);

// Question routes
app.use('/api/questions', questionRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to our User API with JWT Authentication!');
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api/swagger`);
    console.log('Available endpoints:');
    console.log('- POST /api/auth/signup');
    console.log('- POST /api/auth/signin');
    console.log('- POST /api/auth/refresh');
    console.log('- POST /api/auth/logout');
    console.log('- POST /api/auth/logout-all');
    console.log('- GET /api/profile');
    console.log('- GET /api/users');
    console.log('- GET /api/users/:id');
    console.log('- DELETE /api/users/:id');
    console.log('- GET /api/questions/user/:userId');
    console.log('- GET /api/questions/asked/:userId');
    console.log('- POST /api/questions/send');
    console.log('- POST /api/questions/:questionId/answer');
    console.log('- POST /api/questions/:questionId/ignore');
    console.log('- GET /api/questions/feed');
  });
});