package com.empresa.inventario.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.empresa.inventario.model.DetalleVenta;
import com.empresa.inventario.service.DetalleVentaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/detalles-venta")
@CrossOrigin(origins = "http://localhost:3000")
public class DetalleVentaController {
    @Autowired
    private DetalleVentaService detalleVentaService;

    @GetMapping
    public List<DetalleVenta> listarDetallesVenta() {
        return detalleVentaService.listarDetallesVenta();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> obtenerDetalleVenta(@PathVariable Long id) {
        Optional<DetalleVenta> detalleVenta = detalleVentaService.obtenerDetalleVentaPorId(id);
        return detalleVenta.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public DetalleVenta crearDetalleVenta(@RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.guardarDetalleVenta(detalleVenta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDetalleVenta(@PathVariable Long id) {
        detalleVentaService.eliminarDetalleVenta(id);
        return ResponseEntity.noContent().build();
    }
}
