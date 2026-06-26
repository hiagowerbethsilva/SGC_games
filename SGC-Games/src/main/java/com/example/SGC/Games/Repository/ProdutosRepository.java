package com.example.SGC.Games.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SGC.Games.model.Produtos;

public interface ProdutosRepository extends JpaRepository<Produtos, Long> {
}