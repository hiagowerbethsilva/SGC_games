package com.example.SGC.Games.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.SGC.Games.Repository.ClientesRepository;
import com.example.SGC.Games.Repository.VendasRepository;
import com.example.SGC.Games.model.Clientes;

@Service
public class ClientesService {

    private final ClientesRepository clientesRepository;
    private final VendasRepository vendasRepository;
    

    public ClientesService(ClientesRepository clientesRepository, VendasRepository vendasRepository) {
        this.clientesRepository = clientesRepository;
        this.vendasRepository = vendasRepository;
    }

    public Clientes salvar(Clientes cliente) {
        validarCliente(cliente);

        if (cliente.getId() == null) {
    if (clientesRepository.existsByCpf(cliente.getCpf())) {
        throw new IllegalArgumentException("CPF já cadastrado.");
    }
} else {
    if (clientesRepository.existsByCpfAndIdNot(cliente.getCpf(), cliente.getId())) {
        throw new IllegalArgumentException("CPF já cadastrado para outro cliente.");
    }
}

        return clientesRepository.save(cliente);
    }

    public List<Clientes> listarTodos() {
        return clientesRepository.findAll();
    }

    public Clientes buscarPorId(Long id) {
        return clientesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    }

    public void remover(Long id) {
        Clientes cliente = buscarPorId(id);

        if (vendasRepository.existsByClienteId(cliente.getId())) {
            throw new IllegalArgumentException("Cliente não pode ser removido porque possui vendas registradas.");
        }

        clientesRepository.delete(cliente);
    }

    private void validarCliente(Clientes cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (cliente.getCpf() == null || cliente.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF do cliente é obrigatório.");
        }

        if (cliente.getEmail() == null || !cliente.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido.");
        }
    }
}
