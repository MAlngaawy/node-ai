"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = require("./swagger/swagger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
// Swagger UI
app.use('/api/swagger', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.swaggerSpec);
});
// Auth routes
app.use('/api', authRoutes_1.default);
// Root route
app.get('/', (req, res) => {
    res.send('Welcome to our User API with JWT Authentication!');
});
// Start server
(0, db_1.connectDB)().then(() => {
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
    });
});
