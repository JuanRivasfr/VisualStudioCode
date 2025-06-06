package com.empresa.inventario.service;

import com.empresa.inventario.model.*;
import com.empresa.inventario.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    public Optional<Venta> obtenerVentaPorId(Long id) {
        return ventaRepository.findById(id);
    }

    @Transactional
    public Venta guardarVenta(Venta venta) {
        venta.setFecha(new Date());
        Venta ventaGuardada = ventaRepository.save(venta);

        for (DetalleVenta detalle : venta.getDetalles()) {
            detalle.setVenta(ventaGuardada);
            detalle.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());
            detalleVentaRepository.save(detalle);

            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);
        }

        return ventaGuardada;
    }


    public void eliminarVenta(Long id) {
        ventaRepository.deleteById(id);
    }
}
