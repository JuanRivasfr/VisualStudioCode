import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const GestionUsuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const token = localStorage.getItem("jwt");

    useEffect(() => {
        const rolUsuario = obtenerRolDesdeToken();
        if (rolUsuario !== "ADMINISTRADOR") {
        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Solo el ADMINISTRADOR puede gestionar usuarios.",
        }).then(() => navigate("/menu"));
        } else {
        cargarUsuarios();
        }
    }, []);

    const obtenerRolDesdeToken = () => {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.rol;
    };

    const cargarUsuarios = async () => {
        try {
        const res = await fetch("http://localhost:8080/api/usuarios", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Error al cargar usuarios");
        const data = await res.json();
        setUsuarios(data);
        } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
        });
        }
    };

    const eliminarUsuario = async (id) => {
        const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el usuario.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
        await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        cargarUsuarios();
        }
    };

    const registrarUsuario = async (e) => {
        e.preventDefault();
        const nuevoUsuario = { username, password, rol };

        const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
        });

        if (res.ok) {
        Swal.fire("Registrado", "Usuario registrado correctamente.", "success");
        setUsername("");
        setPassword("");
        setRol("");
        cargarUsuarios();
        } else {
        Swal.fire("Error", "No se pudo registrar el usuario.", "error");
        }
    };

    const volverAlMenu = () => {
        navigate("/menu");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <button
            onClick={volverAlMenu}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
            ← Volver al Menú
        </button>
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

        <form onSubmit={registrarUsuario} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded"
            placeholder="Usuario"
            required
            />
            <div className="relative">
            <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Contraseña"
                required
            />
            <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm"
                tabIndex={-1}
            >
                👁️
            </button>
            </div>
            <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="p-2 border rounded"
            required
            >
            <option value="">Seleccione Rol</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="OPERADOR">OPERADOR</option>
            </select>
            <div className="col-span-full">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Registrar Usuario
            </button>
            </div>
        </form>

        <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Usuario</th>
                <th className="border px-4 py-2">Rol</th>
                <th className="border px-4 py-2">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {usuarios.map((u) => (
                <tr key={u.id} className="text-center">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.username}</td>
                <td className="border px-4 py-2">{u.rol}</td>
                <td className="border px-4 py-2 space-x-2">
                    <button
                    onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                    className="px-2 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                    >
                    Editar
                    </button>
                    <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                    Eliminar
                    </button>
                </td>
                </tr>
            ))}
            {usuarios.length === 0 && (
                <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                    No hay usuarios registrados.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
};

export default GestionUsuarios;
