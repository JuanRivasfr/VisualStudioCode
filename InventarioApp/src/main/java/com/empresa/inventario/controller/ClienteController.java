package com.empresa.inventario.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.empresa.inventario.model.Categoria;
import com.empresa.inventario.model.Cliente;
import com.empresa.inventario.service.ClienteService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:3000")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.obtenerClientePorId(id);
        return cliente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.guardarCliente(cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}")
    public Cliente actualizarcliente(@PathVariable Long id, @RequestBody Cliente cliente) {
    	cliente.setId(id);
        return clienteService.guardarCliente(cliente);
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarPorDocumento(@RequestParam String documento) {
        List<Cliente> clientes = clienteService.buscarPorNumeroDocumento(documento);
        return ResponseEntity.ok(clientes);
    }

}

