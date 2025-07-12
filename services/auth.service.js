import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {

    // Autenticar usuario y generar token
    static async login(credentials) {
        try {
            const { email, password } = credentials;

            // Validar que se proporcionen credenciales
            if (!email || !password) {
                return {
                    success: false,
                    error: 'Credenciales incompletas',
                    message: 'Email y contraseña son requeridos'
                };
            }

            // Validar credenciales (en un proyecto real esto sería contra base de datos)
            const isValidUser = this.validateCredentials(email, password);

            if (!isValidUser) {
                return {
                    success: false,
                    error: 'Credenciales inválidas',
                    message: 'Email o contraseña incorrectos'
                };
            }

            // Generar token JWT
            const token = this.generateToken({ email });

            return {
                success: true,
                data: {
                    token,
                    user: {
                        email,
                        role: 'admin'
                    }
                },
                message: 'Autenticación exitosa'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error durante la autenticación'
            };
        }
    }

    // Validar credenciales de usuario
    static validateCredentials(email, password) {

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        return email === adminEmail && password === adminPassword;
    }

    // Generar token JWT
    static generateToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '24h', // Token expira en 24 horas
                issuer: 'products-api',
                audience: 'products-client'
            }
        );
    }

    // Verificar token JWT
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw error;
        }
    }
}