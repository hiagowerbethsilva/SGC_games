package com.example.SGC.Games.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SGC.Games.model.Clientes;

public interface ClientesRepository extends JpaRepository<Clientes, Long> {

    boolean existsByCpf(String cpf);
    boolean existsByCpfAndIdNot(String cpf, Long id);
}
