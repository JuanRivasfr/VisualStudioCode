import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import FormularioEdicion from '../Components/FormularioEdicion';

const EditarCategoria = () => {
const [nombre, setNombre] = useState('');
const [descripcion, setDescripcion] = useState('');
const navigate = useNavigate();
const { id } = useParams();
const token = localStorage.getItem("jwt");

useEffect(() => {
if (!token) return navigate("/");

try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rol = payload.rol;
    if (rol !== "ADMINISTRADOR") {
    alert("Acceso denegado. Solo el ADMINISTRADOR puede editar categorías.");
    return navigate("/categorias");
    }
} catch (error) {
    console.error("Error al leer el token", error);
    navigate("/");
}
}, [token, navigate]);

useEffect(() => {
const cargarCategoria = async () => {
    try {
    const res = await fetch(`http://localhost:8080/api/categorias/${id}`, {
        headers: {
        Authorization: "Bearer " + token,
        },
    });
    if (!res.ok) throw new Error("Error al cargar categoría");
    const data = await res.json();
    setNombre(data.nombre);
    setDescripcion(data.descripcion);
    } catch (error) {
    alert(error.message);
    navigate("/categorias");
    }
};

cargarCategoria();
}, [id, token, navigate]);

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(`http://localhost:8080/api/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ id, nombre, descripcion }),
        });

        if (res.ok) {
        await Swal.fire({
            icon: "success",
            title: "Categoria actualizada",
            text: "Categoria actualizada correctamente",
            timer: 2000,
            timerProgressBar: true,
        });
        navigate("/categorias")
        } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar categoría',
        });
        }
    } catch (error) {
        alert("Error de red o del servidor");
    }
};

const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "nombre") setNombre(value);
    else if (id === "descripcion") setDescripcion(value);
};


const volverAlMenu = () => {
    navigate("/categorias");
    
};

return (
    <FormularioEdicion
        titulo="Editar Categoría"
        campos={[
        {
            id: "nombre",
            label: "Nombre",
            type: "text",
            value: nombre,
            onChange: handleChange,
        },
        {
            id: "descripcion",
            label: "Descripción",
            type: "text",
            value: descripcion,
            onChange: handleChange,
        },
        ]}
        onSubmit={handleSubmit}
        onCancel={volverAlMenu}
    />
    );
};

export default EditarCategoria;
