const { spawn } = require('child_process');

// Función para ejecutar el análisis de síntomas usando el script Python
function analizarSintomas(sintomas, callback) {
  // Ejecutar el script Python y pasarle los síntomas como argumento
  const pythonProcess = spawn('python3', ['nlp_model.py', sintomas]);

  pythonProcess.stdout.on('data', (data) => {
    callback(data.toString());  // Devolver el resultado a través del callback
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error en el análisis NLP: ${data}`);
  });
}

module.exports = analizarSintomas;

