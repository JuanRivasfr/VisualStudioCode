import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        username: "",
        password: "",
        rol: "",
    });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const token = localStorage.getItem("jwt");

    useEffect(() => {
        const rolUsuario = obtenerRolDesdeToken();
        if (rolUsuario !== "ADMINISTRADOR") {
        Swal.fire("Acceso Denegado", "Solo el ADMINISTRADOR puede editar usuarios", "warning").then(() =>
            navigate("/usuarios")
        );
        } else {
        cargarUsuario();
        }
    }, []);

    const obtenerRolDesdeToken = () => {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.rol;
    };

    const cargarUsuario = async () => {
        try {
        const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar usuario");
        const data = await res.json();
        setUsuario({ ...usuario, username: data.username, rol: data.rol });
        } catch (error) {
        Swal.fire("Error", error.message, "error");
        }
    };

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...usuario, id: parseInt(id) }),
        });

        if (res.ok) {
            Swal.fire("Éxito", "Usuario actualizado correctamente", "success").then(() =>
            navigate("/usuarios")
            );
        } else {
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
        }
        } catch (error) {
        Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
        <button
            onClick={() => navigate("/menu")}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
            ← Volver al Menú
        </button>

        <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block mb-1 font-semibold">Usuario</label>
            <input
                type="text"
                name="username"
                value={usuario.username}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            </div>

            <div className="relative">
            <label className="block mb-1 font-semibold">Contraseña</label>
            <input
                type={mostrarPassword ? "text" : "password"}
                name="password"
                value={usuario.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded pr-10"
            />
            <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute top-9 right-2 text-gray-500 text-sm"
                tabIndex={-1}
            >
                👁️
            </button>
            </div>

            <div>
            <label className="block mb-1 font-semibold">Rol</label>
            <select
                name="rol"
                value={usuario.rol}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            >
                <option value="">Seleccione Rol</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="OPERADOR">OPERADOR</option>
            </select>
            </div>

            <div className="flex gap-3">
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Guardar Cambios
            </button>
            <button
                type="button"
                onClick={() => navigate("/usuarios")}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
                Cancelar
            </button>
            </div>
        </form>
        </div>
    );
};

export default EditarUsuario;
