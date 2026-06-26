package com.example.SGC.Games.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SGC.Games.Repository.UsuariosRepository;
import com.example.SGC.Games.model.Usuarios;

@Service
public class UsuariosService {

    private final UsuariosRepository usuariosRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuariosService(UsuariosRepository usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    public Usuarios salvar(Usuarios usuario) {
        validarUsuario(usuario);

        if (usuario.getId() == null && usuariosRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("Nome de usuário já cadastrado.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return usuariosRepository.save(usuario);
    }

    public Usuarios autenticar(String username, String senha) {
    Usuarios usuario = usuariosRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

    if (!passwordEncoder.matches(senha, usuario.getSenha())) {
        throw new IllegalArgumentException("Senha inválida.");
    }

    usuario.setToken(UUID.randomUUID().toString());
    usuario.setTokenExpiracao(LocalDateTime.now().plusHours(1));

    return usuariosRepository.save(usuario);
    }

    public List<Usuarios> listarTodos() {
        return usuariosRepository.findAll();
    }

    public Usuarios buscarPorId(Long id) {
        return usuariosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    private void validarUsuario(Usuarios usuario) {
        if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username é obrigatório.");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória.");
        }

        if (usuario.getPerfil() == null || usuario.getPerfil().isBlank()) {
            throw new IllegalArgumentException("Perfil é obrigatório.");
        }
    }

    public Usuarios validarToken(String token) {
    if (token == null || token.isBlank()) {
        throw new IllegalArgumentException("Token é obrigatório.");
    }

    Usuarios usuario = usuariosRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Token inválido."));

    if (usuario.getTokenExpiracao() == null || usuario.getTokenExpiracao().isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException("Token expirado.");
    }

    return usuario;
}
}
