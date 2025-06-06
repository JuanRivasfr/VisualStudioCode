import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const rol = (() => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol;
  })();

  useEffect(() => {
    if (!token) return navigate('/');
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/categorias', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!res.ok) return console.error("Error al cargar categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const registrarCategoria = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/categorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ nombre, descripcion })
    });
    Swal.fire("Éxito", "Categoria registrada correctamente", "success");
    setNombre('');
    setDescripcion('');
    cargarCategorias();
  };

  const eliminarCategoria = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:8080/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (res.ok) {
        await Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada.', 'success');
        cargarCategorias();
      } else {
        const errorMsg = await res.text();
        Swal.fire('Error', errorMsg || 'No se pudo eliminar la categoría.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error de red o del servidor', 'error');
    }
  }
    
  };

  const volverAlMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="p-6">
      <button onClick={volverAlMenu} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Volver al Menú
      </button>

      <h2 className="text-2xl font-bold mb-4">CATEGORÍAS</h2>

      <form onSubmit={registrarCategoria} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
          className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
          className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
          Registrar Categoría
        </button>
      </form>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Descripción</th>
            {rol === 'ADMINISTRADOR' && (
              <th className="border border-gray-300 p-2">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">{cat.id}</td>
              <td className="border border-gray-300 p-2">{cat.nombre}</td>
              <td className="border border-gray-300 p-2">{cat.descripcion}</td>
              {rol === 'ADMINISTRADOR' && (
                <td className="border border-gray-300 p-2 text-center space-x-2">
                    <>
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        onClick={() => navigate(`/categorias/editar/${cat.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                        onClick={() => eliminarCategoria(cat.id)}
                      >
                        Eliminar
                      </button>
                    </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categorias;