package com.empresa.inventario;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class InventarioApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventarioApplication.class, args);
    }

 
}