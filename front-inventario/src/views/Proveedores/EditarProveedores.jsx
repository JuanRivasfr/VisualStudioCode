import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormularioEdicion from '../Components/FormularioEdicion';
import Swal from 'sweetalert2';

const EditarProveedor = () => {
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return navigate('/login');
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.rol !== 'ADMINISTRADOR') {
            alert("Acceso denegado. Solo el ADMINISTRADOR puede editar proveedores.");
            return navigate('/proveedores');
        }

        fetch(`http://localhost:8080/api/proveedores/${id}`, {
            headers: { Authorization: 'Bearer ' + token },
        })
            .then(res => res.json())
            .then(data => {
            setNombre(data.nombre);
            setContacto(data.contacto);
            setTelefono(data.telefono);
            })
            .catch(() => alert('Error al cargar proveedor'));
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');

        const res = await fetch(`http://localhost:8080/api/proveedores/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ id: parseInt(id), nombre, contacto, telefono }),
        });

        if (res.ok) {
            await Swal.fire({
                icon: "success",
                title: "Producto actualizado",
                text: "Producto actualizado correctamente",
                timer: 2000,
                timerProgressBar: true,
            });
            navigate('/proveedores');
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al actualizar el proveedor",
            });
        }
    };

    return (
        <FormularioEdicion
            titulo="Editar Proveedor"
            campos={[
        {
            id: 'nombre',
            label: 'Nombre',
            type: 'text',
            value: nombre,
            onChange: (e) => setNombre(e.target.value)
        },
        {
            id: 'contacto',
            label: 'Contacto',
            type: 'text',
            value: contacto,
            onChange: (e) => setContacto(e.target.value)
        },
        {
            id: 'telefono',
            label: 'Teléfono',
            type: 'text',
            value: telefono,
            onChange: (e) => setTelefono(e.target.value)
        }
    ]}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/proveedores')}
        />
    );
};

export default EditarProveedor;
