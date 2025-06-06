package com.empresa.inventario.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.empresa.inventario.model.Proveedor;
import com.empresa.inventario.repository.ProveedorRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {
    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> listarProveedores() {
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> obtenerProveedorPorId(Long id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor guardarProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public void eliminarProveedor(Long id) {
        proveedorRepository.deleteById(id);
    }
}
