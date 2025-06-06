import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = JSON.parse(atob(payloadBase64));
      const rol = decoded.rol;
      setRol(rol);

    } catch (e) {
      console.error('Token inválido', e);
      localStorage.removeItem('jwt');
      navigate('/');
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-6">Menú Administrador</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/categorias" className="btn bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">Categorías</a>
          <a href="/clientes" className="btn bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">Clientes</a>
          <a href="/productos" className="btn bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md">Productos</a>
          <a href="/proveedores" className="btn bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md">Proveedores</a>
          <a href="/ventas" className="btn bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md">Ventas</a>
          {rol === "ADMINISTRADOR" && (
            <>
              <a href="/ventasrealizadas" className="btn bg-red-800 hover:bg-red-900 text-white px-5 py-2 rounded-md">Ventas Realizadas</a>
              <a href="/usuarios" className="btn bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-md">Usuarios</a>
            </>
          )}
        </div>
        <button
          onClick={cerrarSesion}
          className="mt-6 px-6 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Menu;
