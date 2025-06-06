package com.empresa.inventario.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.inventario.model.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {}
