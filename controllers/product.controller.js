import { ProductService } from '../services/product.service.js';

export class ProductController {

    // GET /api/products - Obtener todos los productos
    static async getAll(req, res) {
        try {
            const result = await ProductService.getAllProducts();

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data,
                    message: result.message,
                    count: result.data.length
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error,
                    message: result.message
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: 'Error inesperado al obtener los productos'
            });
        }
    }

    // GET /api/products/:id - Obtener un producto por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductService.getProductById(id);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Producto no encontrado' ? 404 : 400;
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
                message: 'Error inesperado al obtener el producto'
            });
        }
    }

    // POST /api/products/create - Crear un nuevo producto
    static async create(req, res) {
        try {
            const productData = req.body;
            const result = await ProductService.createProduct(productData);

            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error,
                    message: result.message
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: 'Error inesperado al crear el producto'
            });
        }
    }

    // PUT /api/products/:id - Actualizar un producto
    static async update(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const result = await ProductService.updateProduct(id, productData);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Producto no encontrado' ? 404 : 400;
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
                message: 'Error inesperado al actualizar el producto'
            });
        }
    }

    // DELETE /api/products/:id - Eliminar un producto
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductService.deleteProduct(id);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Producto no encontrado' ? 404 : 400;
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
                message: 'Error inesperado al eliminar el producto'
            });
        }
    }
}