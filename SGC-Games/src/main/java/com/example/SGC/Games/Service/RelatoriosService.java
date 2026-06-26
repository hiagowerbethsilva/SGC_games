package com.example.SGC.Games.Service;

import com.example.SGC.Games.Repository.VendasRepository;
import com.example.SGC.Games.model.Vendas;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RelatoriosService {

    private final VendasRepository vendasRepository;

    public RelatoriosService(VendasRepository vendasRepository) {
        this.vendasRepository = vendasRepository;
    }

    public List<Vendas> vendasPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return vendasRepository.findByDataVendaBetween(inicio, fim);
    }

    public List<Vendas> vendasPorCliente(Long clienteId) {
        return vendasRepository.findByClienteId(clienteId);
    }

    public List<Vendas> vendasPorProduto(Long produtoId) {
        return vendasRepository.findDistinctByItensProdutoId(produtoId);
    }

    public Map<Integer, BigDecimal> vendasAnuais(Integer ano) {
        if (ano == null) {
            throw new IllegalArgumentException("Ano é obrigatório.");
        }

        LocalDateTime inicio = LocalDateTime.of(ano, 1, 1, 0, 0, 0);
        LocalDateTime fim = LocalDateTime.of(ano, 12, 31, 23, 59, 59);

        List<Vendas> vendas = vendasRepository.findByDataVendaBetween(inicio, fim);

        Map<Integer, BigDecimal> totalPorMes = new LinkedHashMap<>();

        for (int mes = 1; mes <= 12; mes++) {
            totalPorMes.put(mes, BigDecimal.ZERO);
        }

        for (Vendas venda : vendas) {
            if (venda.getDataVenda() != null && venda.getValorTotal() != null) {
                int mes = venda.getDataVenda().getMonthValue();
                BigDecimal totalAtual = totalPorMes.get(mes);
                totalPorMes.put(mes, totalAtual.add(venda.getValorTotal()));
            }
        }

        return totalPorMes;
    }
}
