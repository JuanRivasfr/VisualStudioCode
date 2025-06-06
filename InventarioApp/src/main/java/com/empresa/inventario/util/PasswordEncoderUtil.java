package com.empresa.inventario.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderUtil {

    private static final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String encriptar(String password) {
        return encoder.encode(password);
    }

    public static boolean coinciden(String passwordPlano, String passwordEncriptado) {
        return encoder.matches(passwordPlano, passwordEncriptado);
    }
}
