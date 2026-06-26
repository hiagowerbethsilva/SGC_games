package com.example.SGC.Games.Repository;

import com.example.SGC.Games.model.Vendas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VendasRepository extends JpaRepository<Vendas, Long> {

    boolean existsByClienteId(Long clienteId);

    List<Vendas> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim);

    List<Vendas> findByClienteId(Long clienteId);

    List<Vendas> findDistinctByItensProdutoId(Long produtoId);
}