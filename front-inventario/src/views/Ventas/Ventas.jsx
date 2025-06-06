import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Ventas() {
    const [clienteInput, setClienteInput] = useState('');
    const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [productos, setProductos] = useState([{
            id: null,
            nombre: '',
            precio: 0,
            cantidad: 1,
            stock: 0,
            subtotal: 0,
            sugerencias: [],
        }]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const token = localStorage.getItem("jwt");
    const apiVentas = "http://localhost:8080/api/ventas";
    const apiBuscarClientes = "http://localhost:8080/api/clientes/buscar";
    const apiBuscarProductos = "http://localhost:8080/api/productos/buscar";

    const volverAlMenu = () => {
        navigate("/menu");
    };

    const buscarClientes = async (input) => {
        if (input.length < 1) return setSugerenciasCliente([]);
        const res = await fetch(`${apiBuscarClientes}?documento=${input}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        setSugerenciasCliente(data);
    };

    const handleClienteSelect = (cliente) => {
        setClienteInput(`${cliente.nombre} (${cliente.numeroDocumento})`);
        setClienteId(cliente.id);
        setSugerenciasCliente([]);
    };

    const agregarProducto = () => {
        setProductos([...productos, {
            id: null,
            nombre: '',
            precio: 0,
            cantidad: 1,
            stock: 0,
            subtotal: 0,
            sugerencias: [],
        }]);
    };

    const actualizarProducto = (index, field, value) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index][field] = value;
        if (field === 'cantidad') {
            const cantidad = parseInt(value);
            const precio = nuevosProductos[index].precio;
            nuevosProductos[index].subtotal = cantidad * precio;
        }
        setProductos(nuevosProductos);
        calcularTotal(nuevosProductos);
    };

    const calcularTotal = (productos) => {
        const totalCalculado = productos.reduce((acc, p) => acc + p.subtotal, 0);
        setTotal(totalCalculado);
    };

    const buscarProductos = async (nombre, index) => {
        if (nombre.length < 2) return;
        const res = await fetch(`${apiBuscarProductos}?nombre=${nombre}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        const nuevosProductos = [...productos];
        nuevosProductos[index].sugerencias = data;
        setProductos(nuevosProductos);
    };

    const seleccionarProducto = (index, producto) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index] = {
            ...nuevosProductos[index],
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            cantidad: 1,
            subtotal: producto.precio,
            sugerencias: [],
        };
        setProductos(nuevosProductos);
        calcularTotal(nuevosProductos);
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
        calcularTotal(nuevosProductos);
    };

    const registrarVenta = async (e) => {
        e.preventDefault();
        if(productos[0].id === null){
            Swal.fire('Error', 'No hay ventas disponibles para registrar', 'error');
            return;
        }
        const detalles = productos.map(p => ({
            producto: { id: p.id },
            cantidad: p.cantidad,
            precioUnitario: p.precio,
        }));
        const venta = {
        cliente: { id: clienteId },
        total,
        detalles,
        };

        await fetch(apiVentas, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(venta)
        });

        Swal.fire("Éxito", "Venta registrada correctamente", "success");
        setProductos([{
            id: null,
            nombre: '',
            precio: 0,
            cantidad: 1,
            stock: 0,
            subtotal: 0,
            sugerencias: [],
        }]);
        setClienteInput("");
    };

    return (
        <div className="p-6">
            <div className="container mx-auto">
                <button
                    onClick={volverAlMenu}
                    className="mb-3 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                    ← Volver al Menú
                </button>

                <h2 className="text-2xl font-bold mb-4">VENTAS</h2>

                <form onSubmit={registrarVenta} className="mb-4">
                <div className="grid md:grid-cols-2 gap-4 mb-3 relative">
                    <div>
                        <label className="block text-lg font-medium">Cliente para esta venta</label>
                        <label className="block text-sm font-medium text-gray-700">Escribe el número de documento del cliente para asignar esta venta.</label>
                    <input
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={clienteInput}
                        onChange={(e) => {
                        setClienteInput(e.target.value);
                        buscarClientes(e.target.value);
                        }}
                    />
                    {sugerenciasCliente.length > 0 && (
                        <ul className="absolute bg-white border rounded mt-1 z-10 w-full shadow">
                        {sugerenciasCliente.map((c) => (
                            <li
                            key={c.id}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleClienteSelect(c)}
                            >
                            {c.nombre} ({c.numeroDocumento})
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                    <div className="flex items-end">
                    <button
                        type="button"
                        onClick={agregarProducto}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Agregar Producto
                    </button>
                    </div>
                </div>

                <table className="table-auto w-full text-sm border border-gray-300 mb-3">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-2 py-1 border">Producto</th>
                        <th className="px-2 py-1 border">Precio</th>
                        <th className="px-2 py-1 border">Cantidad</th>
                        <th className="px-2 py-1 border">Subtotal</th>
                        <th className="px-2 py-1 border"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((p, index) => (
                        <tr key={index} className="relative">
                        <td className="border px-2 py-1">
                            <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={p.nombre}
                            onChange={(e) => {
                                actualizarProducto(index, 'nombre', e.target.value);
                                buscarProductos(e.target.value, index);
                            }}
                            />
                            {p.sugerencias.length > 0 && (
                            <ul className="absolute bg-white border rounded mt-1 z-10 w-64 shadow">
                                {p.sugerencias.map((prod) => (
                                <li
                                    key={prod.id}
                                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => seleccionarProducto(index, prod)}
                                >
                                    {prod.nombre} - ${prod.precio} (stock: {prod.stock})
                                </li>
                                ))}
                            </ul>
                            )}
                        </td>
                        <td className="text-center border px-2 py-1">${p.precio.toFixed(2)}</td>
                        <td className="text-center border px-2 py-1">
                            <input
                            type="number"
                            min="1"
                            value={p.cantidad}
                            className="w-20 p-1 text-center border border-gray-300 rounded"
                            onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                            />
                        </td>
                        <td className="text-center border px-2 py-1">${p.subtotal.toFixed(2)}</td>
                        <td className="text-center border px-2 py-1">
                            <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            className="text-red-600 hover:text-red-800"
                            >
                            ✖
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="text-right font-semibold text-lg mb-3">
                    Total: ${total.toFixed(2)}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Registrar Venta
                </button>
                </form>
            </div>
        </div>
    );
}
