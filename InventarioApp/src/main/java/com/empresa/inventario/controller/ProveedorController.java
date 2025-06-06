package com.empresa.inventario.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.empresa.inventario.model.Producto;
import com.empresa.inventario.model.Proveedor;
import com.empresa.inventario.service.ProveedorService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {
    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public List<Proveedor> listarProveedores() {
        return proveedorService.listarProveedores();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtenerProveedor(@PathVariable Long id) {
        Optional<Proveedor> proveedor = proveedorService.obtenerProveedorPorId(id);
        return proveedor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proveedor crearProveedor(@RequestBody Proveedor proveedor) {
        return proveedorService.guardarProveedor(proveedor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}")
    public Proveedor actualizarProveedor(@PathVariable Long id, @RequestBody Proveedor proveedor) {
    	proveedor.setId(id);
        return proveedorService.guardarProveedor(proveedor);
    }
}

