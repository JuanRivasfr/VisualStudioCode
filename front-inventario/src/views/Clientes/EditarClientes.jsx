import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormularioEdicion from "../Components/FormularioEdicion";

const EditarCliente = () => {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jwt");
    const { id } = useParams();

    useEffect(() => {
        if (!token) return navigate("/");
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.rol !== "ADMINISTRADOR") {
            Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Solo el ADMINISTRADOR puede editar clientes.",
            }).then(() => {
            navigate("/clientes")
            });
            return;
        }

        async function cargarCliente() {
            try {
            const res = await fetch(`http://localhost:8080/api/clientes/${id}`, {
                headers: { Authorization: "Bearer " + token },
            });
            if (!res.ok) throw new Error("Error al cargar cliente");
            const data = await res.json();
            setCliente({
                nombre: data.nombre,
                correo: data.correo,
                telefono: data.telefono,
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
            });
            } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
            } finally {
            setLoading(false);
            }
        }

        cargarCliente();
    }, [id, token]);

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ id: parseInt(id), ...cliente }),
            });

            if (res.ok) {
            await Swal.fire({
                icon: "success",
                title: "Cliente actualizado",
                text: "Cliente actualizado correctamente",
                timer: 2000,
                timerProgressBar: true,
            });
            navigate("/clientes")
            } else {
            throw new Error("Error al actualizar cliente");
            }
        } catch (error) {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            });
        }
    };

    if (loading) return <p className="p-4">Cargando...</p>;

    return (
    <FormularioEdicion
        titulo="Editar Cliente"
        campos={[
        {
            id: "nombre",
            label: "Nombre",
            type: "text",
            value: cliente.nombre,
            onChange: handleChange,
        },
        {
            id: "correo",
            label: "Correo",
            type: "email",
            value: cliente.correo,
            onChange: handleChange,
        },
        {
            id: "telefono",
            label: "Teléfono",
            type: "text",
            value: cliente.telefono,
            onChange: handleChange,
        },
        {
            id: "numeroDocumento",
            label: "Número de Documento",
            type: "text",
            value: cliente.numeroDocumento,
            onChange: handleChange,
        },
        ]}
        selects={[
        {
            id: "tipoDocumento",
            label: "Tipo de Documento",
            value: cliente.tipoDocumento,
            onChange: handleChange,
            options: [
            { id: "CC", nombre: "Cédula de Ciudadanía" },
            { id: "CE", nombre: "Cédula de Extranjería" },
            { id: "TI", nombre: "Tarjeta de Identidad" },
            { id: "PAS", nombre: "Pasaporte" },
            ],
        },
        ]}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/clientes")}
    />
    );
};

export default EditarCliente;
