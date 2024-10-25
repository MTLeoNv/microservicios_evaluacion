const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Iniciar Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://microservicios-evaluacion.firebaseio.com"
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas del microservicio de productos
app.use('/productos', require('./productos/server'));

// Rutas del microservicio de usuarios
app.use('/usuarios', require('./usuarios/server'));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Microservicios Funcionando');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
