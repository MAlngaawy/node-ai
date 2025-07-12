import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import { swaggerUi, swaggerSpec } from './swagger/swagger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Swagger UI
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// User routes
app.use('/api', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to our User API with MongoDB!');
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});