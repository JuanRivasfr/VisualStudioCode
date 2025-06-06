import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwt', data.token);

        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const rol = payload.rol;

        navigate('/menu');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (e) {
      setError('Error en la conexión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-50 p-8 rounded-lg shadow-lg">
        <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800">Iniciar Sesión</h4>

        <div className="mb-5">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Usuario</label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
        >
          Entrar
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
