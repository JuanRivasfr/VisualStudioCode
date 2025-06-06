package com.empresa.inventario.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    public Usuario() {}

    public Usuario(String username, String password, Rol rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }

    public Long getId() { 
        return id;
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getUsername() { 
        return username;
    }
    
    public void setUsername(String username) { 
        this.username = username;
    }

    public String getPassword() { 
        return password;
    }
    
    public void setPassword(String password) { 
        this.password = password;
    }

    public Rol getRol() { 
        return rol;
    }
    
    public void setRol(Rol rol) { 
        this.rol = rol;
    }

    // Enum Rol SIN "ROLE_" y con manejo de JSON
    public enum Rol {
        ADMINISTRADOR, OPERADOR;

        @JsonValue
        public String toString() {
            return name();
        }

        @JsonCreator
        public static Rol fromString(String nombre) {
            try {
                return Rol.valueOf(nombre.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Rol no válido: " + nombre);
            }
        }
    }
}
