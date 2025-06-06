package com.empresa.inventario.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String redirigirAlLogin() {
        return "redirect:/login.html";
    }
}	