import { AuthService } from '../services/auth.service.js';

export class AuthController {

    // POST /auth/login - Autenticar usuario
    static async login(req, res) {
        try {
            const credentials = req.body;
            const result = await AuthService.login(credentials);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: {
                        token: result.data.token,
                        user: result.data.user,
                        tokenType: 'Bearer'
                    },
                    message: result.message
                });
            } else {
                // Determinar código de estado según el error
                let statusCode = 400;
                if (result.error === 'Credenciales inválidas') {
                    statusCode = 401;
                }

                res.status(statusCode).json({
                    success: false,
                    error: result.error,
                    message: result.message
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: 'Error inesperado durante la autenticación'
            });
        }
    }

    // GET /auth/verify - Verificar token (opcional, para debugging)
    static async verifyToken(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'Token requerido',
                    message: 'Debe proporcionar un token de autenticación'
                });
            }

            const decoded = AuthService.verifyToken(token);

            res.status(200).json({
                success: true,
                data: {
                    valid: true,
                    user: decoded,
                    expiresAt: new Date(decoded.exp * 1000).toISOString()
                },
                message: 'Token válido'
            });
        } catch (error) {
            let statusCode = 401;
            let errorMessage = 'Token inválido';

            if (error.name === 'TokenExpiredError') {
                errorMessage = 'Token expirado';
            }

            res.status(statusCode).json({
                success: false,
                error: errorMessage,
                message: 'El token proporcionado no es válido'
            });
        }
    }
}