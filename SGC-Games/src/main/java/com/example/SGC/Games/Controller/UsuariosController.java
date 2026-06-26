package com.example.SGC.Games.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestParam;

import com.example.SGC.Games.Service.UsuariosService;
import com.example.SGC.Games.model.Usuarios;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosService usuariosService;

    public UsuariosController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    @PostMapping
    public Usuarios salvar(@RequestBody Usuarios usuario) {
        return usuariosService.salvar(usuario);
    }

    @GetMapping
    public List<Usuarios> listarTodos() {
        return usuariosService.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuarios buscarPorId(@PathVariable Long id) {
        return usuariosService.buscarPorId(id);
    }

    @PostMapping("/login")
    public Usuarios login(@RequestBody Usuarios usuario) {
        return usuariosService.autenticar(usuario.getUsername(), usuario.getSenha());
    }

    @GetMapping("/validar-token")
public Usuarios validarToken(@RequestParam String token) {
    return usuariosService.validarToken(token);
}
}
