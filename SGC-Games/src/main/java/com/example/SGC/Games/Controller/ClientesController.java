package com.example.SGC.Games.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SGC.Games.Service.ClientesService;
import com.example.SGC.Games.model.Clientes;

@RestController
@RequestMapping("/clientes")
public class ClientesController {

    private final ClientesService clientesService;

    public ClientesController(ClientesService clientesService) {
        this.clientesService = clientesService;
    }

    @PostMapping
    public Clientes salvar(@RequestBody Clientes cliente) {
        return clientesService.salvar(cliente);
    }

    @GetMapping
    public List<Clientes> listarTodos() {
        return clientesService.listarTodos();
    }

    @GetMapping("/{id}")
    public Clientes buscarPorId(@PathVariable Long id) {
        return clientesService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Clientes atualizar(@PathVariable Long id, @RequestBody Clientes cliente) {
        cliente.setId(id);
        return clientesService.salvar(cliente);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        clientesService.remover(id);
    }
}
