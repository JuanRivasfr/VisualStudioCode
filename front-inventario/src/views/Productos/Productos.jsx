import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [rol, setRol] = useState("");
    const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    proveedor: ""
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    useEffect(() => {
        if (!token) return navigate("/login");
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRol(payload.rol);
        } catch {
            setRol("");
        }
        cargarProveedores();
        cargarProductos();
    }, []);

    async function cargarProveedores() {
        try {
            const res = await fetch("http://localhost:8080/api/proveedores", {
            headers: { Authorization: "Bearer " + token },
            });
            const data = await res.json();
            setProveedores(data);
        } catch (error) {
            alert("Error al cargar proveedores");
        }
    }

    async function cargarProductos() {
        try {
            const res = await fetch("http://localhost:8080/api/productos", {
            headers: { Authorization: "Bearer " + token },
            });
            const data = await res.json();
            setProductos(data);
        } catch (error) {
            alert("Error al cargar productos");
        }
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const producto = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            proveedor: { id: parseInt(formData.proveedor) }
        };

        await fetch("http://localhost:8080/api/productos", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            },
            body: JSON.stringify(producto),
        });

        Swal.fire("Éxito", "Producto registrado correctamente", "success");

        setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            proveedor: ""
        });

        cargarProductos();
    }

    async function eliminar(id) {
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
            try{
                const res = await fetch(`http://localhost:8080/api/productos/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: "Bearer " + token },
                });

                if (res.ok) {
                    cargarProductos();
                    await Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
                } else {
                    const errorMsg = await res.text();
                    Swal.fire('Error', errorMsg || 'No se pudo eliminar el producto.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error de red o del servidor', 'error');
            }
        }
    }

    function editar(id) {
        navigate(`/productos/editar/${id}`);
    }

    function volverAlMenu() {
        navigate("/menu");
    }

    return (
    <div className="p-6">
        <button
        onClick={volverAlMenu}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
        ← Volver al Menú
        </button>
        <h2 className="text-2xl font-bold mb-4">PRODUCTOS</h2>

        <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8"
        >
        <input
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="col-span-1 md:col-span-1 p-2 border rounded"
            placeholder="Nombre"
            required
        />
        <input
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="col-span-1 md:col-span-1 p-2 border rounded"
            placeholder="Descripción"
            required
        />
        <input
            type="number"
            id="precio"
            value={formData.precio}
            onChange={handleChange}
            className="col-span-1 md:col-span-1 p-2 border rounded"
            placeholder="Precio"
            required
            step="0.01"
        />
        <input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={handleChange}
            className="col-span-1 md:col-span-1 p-2 border rounded"
            placeholder="Stock"
            required
        />
        <select
            id="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            className="col-span-1 md:col-span-2 col-span-1 md:col-span-1 p-2 border rounded"
            required
        >
            <option value="">Seleccione Proveedor</option>
            {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
                {p.nombre}
            </option>
            ))}
        </select>
        <div className="col-span-1 md:col-span-4">
            <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
            >
            Registrar Producto
            </button>
        </div>
        </form>

        <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Descripción</th>
                <th className="border border-gray-300 p-2">Precio</th>
                <th className="border border-gray-300 p-2">Stock</th>
                <th className="border border-gray-300 p-2">Proveedor</th>
                {rol === "ADMINISTRADOR" && (
                    <th className="border border-gray-300 p-2">Acciones</th>
                )}
            </tr>
            </thead>
            <tbody>
            {productos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{p.id}</td>
                <td className="border border-gray-300 p-2">{p.nombre}</td>
                <td className="border border-gray-300 p-2">{p.descripcion}</td>
                <td className="border border-gray-300 p-2">${p.precio}</td>
                <td className="border border-gray-300 p-2">{p.stock}</td>
                <td className="border border-gray-300 p-2">{p.proveedor?.nombre || "N/A"}</td>
                {rol === "ADMINISTRADOR" && (
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                        <>
                            <button
                            onClick={() => editar(p.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                            >
                            Editar
                            </button>
                            <button
                            onClick={() => eliminar(p.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
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
    </div>
    );
}
