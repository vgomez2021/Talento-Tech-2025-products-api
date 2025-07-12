import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API de Productos - Servidor funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            login: '/auth/login'
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe en este servidor`,
        availableRoutes: [
            'GET /',
            'POST /auth/login',
            'GET /api/products',
            'GET /api/products/:id',
            'POST /api/products/create',
            'DELETE /api/products/:id'
        ]
    });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error capturado:', err);

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            message: 'El token proporcionado no es válido'
        });
    }

    // Error de JWT expirado
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado',
            message: 'El token ha expirado, por favor inicia sesión nuevamente'
        });
    }

    // Error genérico del servidor
    res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error inesperado en el servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📚 Documentación: http://localhost:${PORT}/`);
});