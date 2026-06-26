package com.example.SGC.Games.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SGC.Games.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {

    Optional<Usuarios> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<Usuarios> findByToken(String token);
}
