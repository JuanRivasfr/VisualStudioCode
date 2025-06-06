package com.empresa.inventario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.empresa.inventario.model.Usuario;
import com.empresa.inventario.repository.UsuarioRepository;
import com.empresa.inventario.util.PasswordEncoderUtil;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        // Encriptar contraseña antes de guardar
        if (usuario.getPassword() != null) {
            usuario.setPassword(PasswordEncoderUtil.encriptar(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}
