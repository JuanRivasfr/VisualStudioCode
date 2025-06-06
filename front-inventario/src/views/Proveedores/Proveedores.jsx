import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ nombre: '', contacto: '', telefono: '' });
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("jwt");
    const api = 'http://localhost:8080/api/proveedores';

    useEffect(() => {
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRol(payload.rol);
    } else {
        navigate('/login');
    }

    cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const res = await fetch(api, {
            headers: { Authorization: 'Bearer ' + token },
            });
            if (!res.ok) throw new Error('Error al cargar proveedores');
            const data = await res.json();
            setProveedores(data);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(api, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(form),
        });
        setForm({ nombre: '', contacto: '', telefono: '' });
        cargarProveedores();
    };

    const eliminarProveedor = async (id) => {
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
                const res = await fetch(`${api}/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: 'Bearer ' + token },
                });
                if (res.ok) {
                    await Swal.fire('¡Eliminado!', 'El proveedor ha sido eliminado.', 'success');
                    cargarProveedores();
                } else {
                    const errorMsg = await res.text();
                    Swal.fire('Error', errorMsg || 'No se pudo eliminar el proveedor.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error de red o del servidor', 'error');
            }
        }
    };

    const editarProveedor = (id) => {
        navigate(`editar/${id}`);
    };

    const volverAlMenu = () => {
        navigate('/menu');
    };

    return (
    <div className="p-6">
        <div className="container mx-auto">
        <button onClick={volverAlMenu} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Volver al Menú
        </button>

        <h2 className="text-2xl font-bold mb-4">Proveedores</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <input
            type="text"
            name="contacto"
            placeholder="Contacto"
            value={form.contacto}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
            Registrar Proveedor
        </button>
        </form>

        <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
            <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Contacto</th>
            <th className="border border-gray-300 p-2">Teléfono</th>
            {rol === 'ADMINISTRADOR' && (
                <th className="border border-gray-300 p-2">Acciones</th>
            )}
            </tr>
        </thead>
        <tbody>
            {proveedores.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{p.id}</td>
                <td className="border border-gray-300 p-2">{p.nombre}</td>
                <td className="border border-gray-300 p-2">{p.contacto}</td>
                <td className="border border-gray-300 p-2">{p.telefono}</td>
                {rol === 'ADMINISTRADOR' && (
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                        <>
                        <button
                            onClick={() => editarProveedor(p.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => eliminarProveedor(p.id)}
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
};

export default Proveedores;
