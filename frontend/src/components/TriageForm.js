import React, { useState } from 'react';
import axios from 'axios';

const TriageForm = () => {
  const [nombre, setNombre] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/triage', {
        nombre,
        identificacion,
        sintomas
      });
      setMensaje(response.data.mensaje);
      setError('');
    } catch (err) {
      setError('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <div>
      <h2>Clasificación de Triage</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Identificación</label>
          <input
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Síntomas</label>
          <textarea
            value={sintomas}
            onChange={(e) => setSintomas(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default TriageForm;
