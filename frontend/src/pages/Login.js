import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      const { token, rol } = response.data;

      // Guardar el token y el rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', rol);
      setRole(rol); // Actualizar el estado del rol para redirigir

      setError(''); // Limpiar el mensaje de error si el login fue exitoso
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
