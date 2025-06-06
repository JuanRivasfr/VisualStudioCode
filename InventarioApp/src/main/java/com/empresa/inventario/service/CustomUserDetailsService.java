package com.empresa.inventario.service;

import com.empresa.inventario.model.Usuario;
import com.empresa.inventario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword()) // Contraseña sin encriptar
                .roles(usuario.getRol() != null ? usuario.getRol().name() : "USER") // Manejo si el rol es null
                .build();
    }
}
