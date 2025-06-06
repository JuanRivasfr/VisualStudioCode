import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FormularioEdicion from "../Components/FormularioEdicion";

export default function EditarProducto() {
    const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    proveedor: ""
    });
    const [proveedores, setProveedores] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    useEffect(() => {
    async function cargarDatos() {
        try {
        const [resProducto, resProveedores] = await Promise.all([
            fetch(`http://localhost:8080/api/productos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:8080/api/proveedores`, {
            headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        const dataProducto = await resProducto.json();
        const dataProveedores = await resProveedores.json();

        setProducto({
            nombre: dataProducto.nombre,
            descripcion: dataProducto.descripcion,
            precio: dataProducto.precio,
            stock: dataProducto.stock,
            proveedor: dataProducto.proveedor?.id || ""
        });
        setProveedores(dataProveedores);
        } catch (error) {
        console.error("Error cargando datos", error);
        }
    }

    cargarDatos();
    }, [token]);

    const handleChange = (e) => {
    const { id, value } = e.target;
    setProducto((prev) => ({ ...prev, [id]: value }));
    };

    const guardarCambios = async (e) => {
        e.preventDefault();

        const body = {
            ...producto,
            precio: parseFloat(producto.precio),
            stock: parseInt(producto.stock),
            proveedor: { id: parseInt(producto.proveedor) },
        };
        try {
            const res = await fetch(`http://localhost:8080/api/productos/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Producto actualizado",
                    text: "Producto actualizado correctamente",
                    timer: 2000,
                    timerProgressBar: true,
                });
                navigate("/productos");
            } else {
                throw new Error("Error al actualizar el producto");
            }
        } catch (error) {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            });
        }
    };

    return (
        <FormularioEdicion
            titulo="Editar Producto"
            campos={[
            {
                id: "nombre",
                label: "Nombre",
                type: "text",
                value: producto.nombre,
                onChange: handleChange,
            },
            {
                id: "descripcion",
                label: "Descripción",
                type: "text",
                value: producto.descripcion,
                onChange: handleChange,
            },
            {
                id: "precio",
                label: "Precio",
                type: "number",
                value: producto.precio,
                onChange: handleChange,
            },
            {
                id: "stock",
                label: "Stock",
                type: "number",
                value: producto.stock,
                onChange: handleChange,
            },
            ]}
            selects={[
            {
                id: "proveedor",
                label: "Proveedor",
                value: producto.proveedor,
                onChange: handleChange,
                options: proveedores,
            },
            ]}
            onSubmit={guardarCambios}
            onCancel={() => navigate("/productos")}
        />

    );
}
