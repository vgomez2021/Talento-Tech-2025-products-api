import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

const COLLECTION_NAME = 'products';

export class ProductModel {

    // Obtener todos los productos
    static async getAll() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return products;
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw new Error('Error al obtener los productos de la base de datos');
        }
    }

    // Obtener un producto por ID
    static async getById(id) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } catch (error) {
            console.error('Error obteniendo producto por ID:', error);
            throw new Error('Error al obtener el producto de la base de datos');
        }
    }

    // Crear un nuevo producto
    static async create(productData) {
        try {
            const newProduct = {
                ...productData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), newProduct);

            return {
                id: docRef.id,
                ...newProduct
            };
        } catch (error) {
            console.error('Error creando producto:', error);
            throw new Error('Error al crear el producto en la base de datos');
        }
    }

    // Actualizar un producto
    static async update(id, productData) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            const updatedData = {
                ...productData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updatedData);

            return {
                id: id,
                ...docSnap.data(),
                ...updatedData
            };
        } catch (error) {
            console.error('Error actualizando producto:', error);
            throw new Error('Error al actualizar el producto en la base de datos');
        }
    }

    // Eliminar un producto
    static async delete(id) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error eliminando producto:', error);
            throw new Error('Error al eliminar el producto de la base de datos');
        }
    }
}