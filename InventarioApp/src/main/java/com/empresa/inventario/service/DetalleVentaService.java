package com.empresa.inventario.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.empresa.inventario.model.DetalleVenta;
import com.empresa.inventario.repository.DetalleVentaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleVentaService {
    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    public List<DetalleVenta> listarDetallesVenta() {
        return detalleVentaRepository.findAll();
    }

    public Optional<DetalleVenta> obtenerDetalleVentaPorId(Long id) {
        return detalleVentaRepository.findById(id);
    }

    public DetalleVenta guardarDetalleVenta(DetalleVenta detalleVenta) {
        return detalleVentaRepository.save(detalleVenta);
    }

    public void eliminarDetalleVenta(Long id) {
        detalleVentaRepository.deleteById(id);
    }
}

