import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";

const DetalleVenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState(null);
    const token = localStorage.getItem("jwt");
    const pdfRef = useRef();

    const descargarPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`factura_${venta.id}.pdf`);
    });
    };

    useEffect(() => {
    const cargarDetalleVenta = async () => {
        try {
        const res = await fetch(`http://localhost:8080/api/ventas/${id}`, {
            headers: {
            Authorization: "Bearer " + token,
            },
        });

        if (!res.ok) {
            alert("Error al cargar la venta");
            return;
        }

        const data = await res.json();
        setVenta(data);
        } catch (error) {
        console.error("Error al cargar venta:", error);
        }
    };

    cargarDetalleVenta();
    }, [id, token]);

    if (!venta)
    return <p className="p-6 text-gray-600">Cargando detalle de la venta...</p>;

    return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <div
        ref={pdfRef}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-200"
        >
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-800">Factura</h1>
            <p className="text-gray-500">Tienda Virtual</p>
            <p className="text-gray-500">www.tienda.com</p>
            </div>
            <div className="text-right">
            <p className="text-sm text-gray-600">
                <strong>Fecha:</strong>{" "}
                {new Date(venta.fecha).toLocaleDateString("es-ES")}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Factura N°:</strong> {venta.id}
            </p>
            </div>
        </div>

        <div className="mb-6 border-t border-b py-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Cliente:</h2>
            <p className="text-gray-600">{venta.cliente.nombre}</p>
        </div>

        <table className="w-full table-auto mb-6">
            <thead className="bg-gray-100 border border-gray-200">
            <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Precio Unitario</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
            </tr>
            </thead>
            <tbody>
            {venta.detalles.map((d, index) => (
                <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{d.producto.nombre}</td>
                <td className="px-4 py-2 text-right">
                    ${d.precioUnitario.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">{d.cantidad}</td>
                <td className="px-4 py-2 text-right">
                    ${d.subtotal.toFixed(2)}
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="text-right text-lg font-semibold text-gray-800 mb-2">
            Total: ${venta.total.toFixed(2)}
        </div>
        </div>

        {/* Botones de acción */}
        <div className="max-w-3xl mx-auto mt-4 flex gap-4">
        <button
            onClick={descargarPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Descargar PDF
        </button>

        <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
            ← Volver
        </button>
        </div>
    </div>
    );
};

export default DetalleVenta;
