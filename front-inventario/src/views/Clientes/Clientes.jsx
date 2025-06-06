import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    });
    const [loading, setLoading] = useState(false);
    const [rol, setRol] = useState("");

    async function cargarClientes() {
    try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/clientes", {
        headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) throw new Error("Error al cargar clientes");
        const data = await res.json();
        setClientes(data);
    } catch (error) {
        Swal.fire("Error", error.message || "No se pudo cargar clientes.", "error");
    } finally {
        setLoading(false);
    }
    }

    // useEffect(() => {
    // cargarClientes();
    // }, []);

    useEffect(() => {
        if (!token) return navigate('/');
        try {
            const payloadBase64 = token.split(".")[1];
            const decoded = JSON.parse(atob(payloadBase64));
            cargarClientes();
            setRol(decoded.rol);
        } catch {
            setRol(null);
        }
    }, []);

    function handleChange(e) {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
    }

    async function handleSubmit(e) {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error al registrar cliente");
        Swal.fire("Éxito", "Cliente registrado correctamente", "success");
        setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: "",
        });
        cargarClientes();
    } catch (error) {
        Swal.fire("Error", error.message || "No se pudo registrar el cliente.", "error");
    }
    }

    async function eliminar(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
        try {
        const res = await fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) throw new Error("No se pudo eliminar el cliente");
        Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
        cargarClientes();
        } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar el cliente.", "error");
        }
    }
    }

    function editar(id) {
        navigate(`/clientes/editar/${id}`)
    }

    // Volver al menú según rol
    function volverAlMenu() {
        navigate('/menu')
    }

    return (
    <div className="p-6">
        <button
        onClick={volverAlMenu}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
        ← Volver al Menú
        </button>

        <h2 className="text-2xl font-bold mb-4">CLIENTES</h2>

        <form
        className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8"
        onSubmit={handleSubmit}
        >
        <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Correo"
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        />
        <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-1 p-2 border rounded"
        >
            <option value="">Tipo de Documento</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
            <option value="NIT">NIT</option>
        </select>
        <input
            type="text"
            name="numeroDocumento"
            maxLength={20}
            value={formData.numeroDocumento}
            onChange={handleChange}
            placeholder="Número de Documento"
            required
            className="col-span-1 md:col-span-2 p-2 border rounded"
        />
        <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
        >
            Registrar Cliente
        </button>
        </form>

        {loading ? (
        <p>Cargando clientes...</p>
        ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Correo</th>
                <th className="border border-gray-300 p-2">Teléfono</th>
                <th className="border border-gray-300 p-2">Tipo Doc</th>
                <th className="border border-gray-300 p-2">Número Doc</th>
                {rol === "ADMINISTRADOR" && (
                    <th className="border border-gray-300 p-2">Acciones</th>
                )}
            </tr>
            </thead>
            <tbody>
            {clientes.map((cli) => (
                <tr key={cli.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-center">{cli.id}</td>
                    <td className="border border-gray-300 p-2">{cli.nombre}</td>
                    <td className="border border-gray-300 p-2">{cli.correo}</td>
                    <td className="border border-gray-300 p-2">{cli.telefono}</td>
                    <td className="border border-gray-300 p-2 text-center">{cli.tipoDocumento}</td>
                    <td className="border border-gray-300 p-2">{cli.numeroDocumento}</td>
                    {rol === "ADMINISTRADOR" && (
                        <td className="border border-gray-300 p-2 text-center space-x-2">
                            <>
                                <button
                                onClick={() => editar(cli.id)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                >
                                Editar
                                </button>
                                <button
                                onClick={() => eliminar(cli.id)}
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
        )}
    </div>
    );
}
