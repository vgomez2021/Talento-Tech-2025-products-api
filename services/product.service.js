import { ProductModel } from '../models/Product.model.js';

export class ProductService {

    // Obtener todos los productos
    static async getAllProducts() {
        try {
            const products = await ProductModel.getAll();
            return {
                success: true,
                data: products,
                message: 'Productos obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al obtener los productos'
            };
        }
    }

    // Obtener un producto por ID
    static async getProductById(id) {
        try {
            if (!id) {
                return {
                    success: false,
                    error: 'ID requerido',
                    message: 'Debe proporcionar un ID válido'
                };
            }

            const product = await ProductModel.getById(id);

            if (!product) {
                return {
                    success: false,
                    error: 'Producto no encontrado',
                    message: `No se encontró un producto con ID: ${id}`
                };
            }

            return {
                success: true,
                data: product,
                message: 'Producto obtenido exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al obtener el producto'
            };
        }
    }

    // Crear un nuevo producto
    static async createProduct(productData) {
        try {
            // Validar datos requeridos
            const requiredFields = ['name', 'price', 'category'];
            const missingFields = requiredFields.filter(field => !productData[field]);

            if (missingFields.length > 0) {
                return {
                    success: false,
                    error: 'Campos requeridos faltantes',
                    message: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`
                };
            }

            // Validar precio
            if (isNaN(productData.price) || productData.price <= 0) {
                return {
                    success: false,
                    error: 'Precio inválido',
                    message: 'El precio debe ser un número mayor a 0'
                };
            }

            // Crear producto con valores por defecto
            const newProductData = {
                name: productData.name.trim(),
                description: productData.description || '',
                price: parseFloat(productData.price),
                category: productData.category.trim(),
                stock: parseInt(productData.stock) || 0,
                active: productData.active !== undefined ? productData.active : true,
                imageUrl: productData.imageUrl || ''
            };

            const product = await ProductModel.create(newProductData);

            return {
                success: true,
                data: product,
                message: 'Producto creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al crear el producto'
            };
        }
    }

    // Actualizar un producto
    static async updateProduct(id, productData) {
        try {
            if (!id) {
                return {
                    success: false,
                    error: 'ID requerido',
                    message: 'Debe proporcionar un ID válido'
                };
            }

            // Validar precio si se proporciona
            if (productData.price && (isNaN(productData.price) || productData.price <= 0)) {
                return {
                    success: false,
                    error: 'Precio inválido',
                    message: 'El precio debe ser un número mayor a 0'
                };
            }

            // Limpiar datos vacíos
            const cleanData = {};
            Object.keys(productData).forEach(key => {
                if (productData[key] !== undefined && productData[key] !== null) {
                    if (key === 'price') {
                        cleanData[key] = parseFloat(productData[key]);
                    } else if (key === 'stock') {
                        cleanData[key] = parseInt(productData[key]);
                    } else if (typeof productData[key] === 'string') {
                        cleanData[key] = productData[key].trim();
                    } else {
                        cleanData[key] = productData[key];
                    }
                }
            });

            const product = await ProductModel.update(id, cleanData);

            if (!product) {
                return {
                    success: false,
                    error: 'Producto no encontrado',
                    message: `No se encontró un producto con ID: ${id}`
                };
            }

            return {
                success: true,
                data: product,
                message: 'Producto actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al actualizar el producto'
            };
        }
    }

    // Eliminar un producto
    static async deleteProduct(id) {
        try {
            if (!id) {
                return {
                    success: false,
                    error: 'ID requerido',
                    message: 'Debe proporcionar un ID válido'
                };
            }

            const result = await ProductModel.delete(id);

            if (!result) {
                return {
                    success: false,
                    error: 'Producto no encontrado',
                    message: `No se encontró un producto con ID: ${id}`
                };
            }

            return {
                success: true,
                message: 'Producto eliminado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al eliminar el producto'
            };
        }
    }
}