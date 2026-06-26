package com.example.SGC.Games.Controller;

import com.example.SGC.Games.Service.RelatoriosService;
import com.example.SGC.Games.model.Vendas;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/relatorios")
public class RelatoriosController {

    private final RelatoriosService relatoriosService;

    public RelatoriosController(RelatoriosService relatoriosService) {
        this.relatoriosService = relatoriosService;
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Vendas> vendasPorCliente(@PathVariable Long clienteId) {
        return relatoriosService.vendasPorCliente(clienteId);
    }

    @GetMapping("/produto/{produtoId}")
    public List<Vendas> vendasPorProduto(@PathVariable Long produtoId) {
        return relatoriosService.vendasPorProduto(produtoId);
    }

    @GetMapping("/periodo")
    public List<Vendas> vendasPorPeriodo(
            @RequestParam String inicio,
            @RequestParam String fim
    ) {
        LocalDateTime dataInicio = LocalDateTime.parse(inicio);
        LocalDateTime dataFim = LocalDateTime.parse(fim);

        return relatoriosService.vendasPorPeriodo(dataInicio, dataFim);
    }

    @GetMapping("/anual")
    public Map<Integer, BigDecimal> vendasAnuais(@RequestParam Integer ano) {
        return relatoriosService.vendasAnuais(ano);
    }
}