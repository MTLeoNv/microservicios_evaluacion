const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// Iniciar Firebase Admin con las credenciales en variables de entorno
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: 'https://microservicios-evaluacion.firebaseio.com' // URL de la base de datos
});

const db = admin.firestore();

// Ruta principal
app.get('/', (req, res) => {
    res.send('Microservicio de Usuarios Funcionando');
});

// Obtener lista de usuarios
app.get('/list.usuarios', async (req, res) => {
    try {
        const usuariosRef = db.collection('usuarios');
        const snapshot = await usuariosRef.get();
        const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ data: { users: usuarios } });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Añadir un nuevo usuario
app.post('/add.usuario', async (req, res) => {
    const { nombre, correo } = req.body;

    try {
        const newUser = { nombre, correo };
        const userRef = await db.collection('usuarios').add(newUser);
        res.status(201).json({ data: { message: `Usuario ${nombre} agregado exitosamente.`, id: userRef.id } });
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({ error: 'Error al agregar usuario' });
    }
});

app.listen(port, () => {
    console.log('Microservicio Usuarios escuchando en localhost:' + port);
});
