import express from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas (sin autenticación)
// GET /api/products - Obtener todos los productos
router.get('/', ProductController.getAll);

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', ProductController.getById);

// Rutas protegidas (requieren autenticación)
// POST /api/products/create - Crear un nuevo producto
router.post('/create', authenticateToken, ProductController.create);

// PUT /api/products/:id - Actualizar un producto
router.put('/:id', authenticateToken, ProductController.update);

// DELETE /api/products/:id - Eliminar un producto
router.delete('/:id', authenticateToken, ProductController.delete);

export default router;