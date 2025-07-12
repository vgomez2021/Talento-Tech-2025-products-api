import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /auth/login - Autenticar usuario
router.post('/login', AuthController.login);

// GET /auth/verify - Verificar token (opcional, para debugging)
router.get('/verify', AuthController.verifyToken);

export default router;