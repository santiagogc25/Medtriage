const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const analizarSintomas = require('./nlp');  // Importar la función de análisis de NLP

const app = express();
const port = 3001;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json());  
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());


// Clave secreta para firmar tokens (debería almacenarse en variables de entorno)
const secretKey = 'my_secret_key';

// Ruta de registro para pacientes o médicos
app.post('/register', (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).send('Faltan datos en la solicitud');
  }

  // Encriptar la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insertar el usuario en la base de datos
  const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, email, hashedPassword, rol], (err, result) => {
    if (err) {
      console.error('Error al insertar el usuario:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.status(201).send('Usuario registrado exitosamente');
  });
});

// Ruta de login para pacientes o médicos
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Datos recibidos:', email, password);

  if (!email || !password) {
    return res.status(400).send('Faltan datos en la solicitud');
  }

  // Buscar el usuario por email
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(404).send('Usuario no encontrado');
    }

    const user = results[0];
    console.log('Usuario encontrado:', user);

    // Comparar la contraseña
    const passwordValid = bcrypt.compareSync(password, user.password);
    console.log('Contraseña válida:', passwordValid);

    if (!passwordValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).send('Contraseña incorrecta');
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ token, rol: user.rol });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token no proporcionado');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido');
    }

    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
}

app.get('/consultas', verifyToken, (req, res) => {
  if (req.userRol !== 'medico') {
    return res.status(403).send('Acceso denegado');
  }

  // Obtener todas las consultas de la base de datos
  const sql = 'SELECT * FROM consultas';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Error en el servidor');
    }

    res.status(200).json(results);
  });
});



const db = mysql.createConnection({
  host: 'localhost',
  user: 'triage_user',
  password: 'password',
  database: 'triage_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});
app.post('/triage', (req, res) => {
  const { paciente_id, sintomas } = req.body;  // Asegúrate de obtener el paciente_id desde el frontend

  if (!paciente_id || !sintomas) {
    return res.status(400).send('Faltan datos en la solicitud');
  }

  // Ejecutar el análisis de síntomas con NLP
  analizarSintomas(sintomas, (resultadoNLP) => {
    console.log(`Resultado del análisis NLP: ${resultadoNLP}`);

    // Almacenar la consulta en la tabla "consultas"
    const sql = 'INSERT INTO consultas (paciente_id, sintomas, resultado_triaje) VALUES (?, ?, ?)';
    db.query(sql, [paciente_id, sintomas, resultadoNLP], (err, result) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        return res.status(500).send('Error en el servidor');
      }

      // El paciente no recibe el resultado procesado
      res.status(200).json({
        mensaje: 'Consulta registrada exitosamente',
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
