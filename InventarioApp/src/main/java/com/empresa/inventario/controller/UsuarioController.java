package com.empresa.inventario.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.empresa.inventario.model.Usuario;
import com.empresa.inventario.service.UsuarioService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Listar todos los usuarios", description = "Obtiene una lista de todos los usuarios registrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente")
    })
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @Operation(summary = "Obtener un usuario por ID", description = "Busca un usuario específico por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear un nuevo usuario", description = "Registra un nuevo usuario en la base de datos.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.guardarUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Actualizar un usuario", description = "Modifica los datos de un usuario existente.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioService.obtenerUsuarioPorId(id);
        if (usuarioExistente.isPresent()) {
            usuario.setId(id);
            Usuario usuarioActualizado = usuarioService.guardarUsuario(usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar un usuario", description = "Elimina un usuario de la base de datos por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
