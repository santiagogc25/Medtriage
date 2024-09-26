import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/consultas', {
          headers: { Authorization: token },
        });
        setConsultas(response.data);
      } catch (err) {
        setError('Error al cargar las consultas');
      }
    };

    fetchConsultas();
  }, []);

  return (
    <div>
      <h2>Consultas de Pacientes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {consultas.map((consulta) => (
          <li key={consulta.id}>
            <p>Paciente ID: {consulta.paciente_id}</p>
            <p>Síntomas: {consulta.sintomas}</p>
            <p>Resultado del Triage: {consulta.resultado_triaje}</p>
            <p>Fecha: {consulta.fecha}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
