import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VentasRealizadas = () => {
    const [ventas, setVentas] = useState([]);
    const [fecha, setFecha] = useState("");
    const [cliente, setCliente] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/ventas", {
        headers: {
            Authorization: "Bearer " + token,
        },
        });
        const data = await res.json();
        setVentas(data);
    } catch (error) {
        console.error("Error al cargar ventas:", error);
    }
    };

    const filtrarVentas = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/ventas", {
        headers: { Authorization: "Bearer " + token },
    })
        .then((res) => res.json())
        .then((data) => {
        let filtradas = data;
        if (fecha) {
            filtradas = filtradas.filter(
            (v) => new Date(v.fecha).toISOString().slice(0, 10) === fecha
            );
        }
        if (cliente) {
            const texto = cliente.toLowerCase();
            filtradas = filtradas.filter(
            (v) =>
                v.cliente.nombre.toLowerCase().includes(texto) ||
                v.cliente.numeroDocumento.includes(texto)
            );
        }
        setVentas(filtradas);
        });
    };

    const verDetalle = (id) => {
    navigate(`/verdetalleventa/${id}`);
    };

    return (
    <div className="p-6">
        <button
        onClick={() => navigate("/menu")}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
        >
        ← Volver al Menú
        </button>

        <h2 className="text-2xl font-bold mb-6">Ventas Realizadas</h2>

        <form
        onSubmit={filtrarVentas}
        className="flex flex-col md:flex-row md:items-end gap-4 mb-6"
        >
        <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            />
        </div>
        <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
            Cliente o Documento
            </label>
            <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Buscar..."
            />
        </div>
        <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Filtrar
        </button>
        </form>

        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold">Fecha</th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold">Cliente</th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold">Total</th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {ventas.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{v.id}</td>
                <td className="px-4 py-2 border-b">{new Date(v.fecha).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{v.cliente.nombre}</td>
                <td className="px-4 py-2 border-b">${v.total.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">
                    <button
                    onClick={() => verDetalle(v.id)}
                    className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700"
                    >
                    Ver Detalle
                    </button>
                </td>
                </tr>
            ))}
            {ventas.length === 0 && (
                <tr>
                <td colSpan="5" className="text-center px-4 py-4 text-gray-500">
                    No se encontraron ventas.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    </div>
    );
};

export default VentasRealizadas;
