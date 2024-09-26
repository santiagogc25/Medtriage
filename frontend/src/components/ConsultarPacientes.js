import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsultarPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/consultas', {
          headers: {
            Authorization: localStorage.getItem('token'), // Token del login
          },
        });
        setPacientes(response.data);
      } catch (err) {
        setError('Error al obtener la lista de pacientes.');
      }
    };

    obtenerPacientes();
  }, []);

  return (
    <div>
      <h2>Consulta de Pacientes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Síntomas</th>
            <th>Resultado Procesado (NLP)</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.nombre}</td>
              <td>{paciente.identificacion}</td>
              <td>{paciente.sintomas}</td>
              <td>{paciente.resultado_triaje}</td> {/* Mostrar el resultado del NLP */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultarPacientes;
