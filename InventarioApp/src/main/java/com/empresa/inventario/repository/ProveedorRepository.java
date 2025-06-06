package com.empresa.inventario.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.inventario.model.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {}