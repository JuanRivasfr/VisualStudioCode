package com.empresa.inventario.repository;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.empresa.inventario.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
	
	List<Producto> findByNombreContainingIgnoreCase(String nombre);

}