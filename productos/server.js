const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 8082;

// Iniciar Firebase con las credenciales desde el archivo .env
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://microservicios-evaluacion.firebaseio.com"
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('Microservicio de Productos Funcionando');
});

// Obtener todos los productos
app.get('/list.productos', async (req, res) => {
    try {
        const productosSnapshot = await db.collection('productos').get();
        const productos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ data: { products: productos } });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

// Añadir un nuevo producto
app.post('/add.producto', async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        const nuevoProducto = { nombre, precio, stock };
        const docRef = await db.collection('productos').add(nuevoProducto);
        res.status(201).json({ data: { id: docRef.id, message: `Producto ${nombre} agregado exitosamente.` } });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: `Error al agregar producto: ${error.message}` });
    }
});

// Editar un producto
app.put('/edit.producto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;
        const productoRef = db.collection('productos').doc(id);

        await productoRef.update({ nombre, precio, stock });
        res.status(200).json({ data: { message: `Producto ${nombre} actualizado.` } });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: `Error al actualizar producto: ${error.message}` });
    }
});

// Eliminar un producto
app.delete('/delete.producto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productoRef = db.collection('productos').doc(id);

        await productoRef.delete();
        res.status(200).json({ data: { message: `Producto con ID ${id} eliminado.` } });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: `Error al eliminar producto: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Microservicio Productos escuchando en http://localhost:${port}`);
});
