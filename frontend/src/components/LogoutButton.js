import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token y el rol de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Resetear el estado del rol en la aplicación
    setRole(null);
    
    // Redirigir al login
    navigate('/');
  };

  return (
    <button onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
