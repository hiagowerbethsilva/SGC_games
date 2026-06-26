package com.example.SGC.Games.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SGC.Games.Service.VendasService;
import com.example.SGC.Games.model.Vendas;

@RestController
@RequestMapping("/vendas")
public class VendasController {

    private final VendasService vendasService;

    public VendasController(VendasService vendasService) {
        this.vendasService = vendasService;
    }

    @PostMapping
    public Vendas registrarVenda(@RequestBody Vendas venda) {
        return vendasService.registrarVenda(venda);
    }

    @GetMapping
    public List<Vendas> listarTodas() {
        return vendasService.listarTodas();
    }

    @GetMapping("/{id}")
    public Vendas buscarPorId(@PathVariable Long id) {
        return vendasService.buscarPorId(id);
    }
}
