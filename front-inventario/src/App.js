import {BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login.jsx';
import Menu from './views/Menu.jsx';
import Categorias from './views/Categorias/Categorias.jsx';
import EditarCategoria from './views/Categorias/EditarCategorias.jsx';
import Clientes from './views/Clientes/Clientes.jsx';
import EditarCliente from './views/Clientes/EditarClientes.jsx';
import Productos from './views/Productos/Productos.jsx';
import EditarProducto from './views/Productos/EditarProductos.jsx';
import Ventas from './views/Ventas/Ventas.jsx';
import Proveedores from './views/Proveedores/Proveedores.jsx';
import EditarProveedor from './views/Proveedores/EditarProveedores.jsx';
import VentasRealizadas from './views/Ventas/VentasRealizadas.jsx';
import DetalleVenta from './views/Ventas/DetalleVenta.jsx';
import GestionUsuarios from './views/Usuarios/GestionUsuarios.jsx';
import EditarUsuario from './views/Usuarios/EditarUsuarios.jsx';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/editar/:id" element={<EditarCategoria />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/editar/:id" element={<EditarCliente />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/editar/:id" element={<EditarProducto />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedores/editar/:id" element={<EditarProveedor />} />
          <Route path="/ventasrealizadas" element={<VentasRealizadas />} />
          <Route path="/verdetalleventa/:id" element={<DetalleVenta />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
