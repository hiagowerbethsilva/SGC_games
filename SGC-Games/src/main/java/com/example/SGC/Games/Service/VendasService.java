package com.example.SGC.Games.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.SGC.Games.Repository.ClientesRepository;
import com.example.SGC.Games.Repository.ProdutosRepository;
import com.example.SGC.Games.Repository.UsuariosRepository;
import com.example.SGC.Games.Repository.VendasRepository;
import com.example.SGC.Games.model.Clientes;
import com.example.SGC.Games.model.ItemVendas;
import com.example.SGC.Games.model.Produtos;
import com.example.SGC.Games.model.Usuarios;
import com.example.SGC.Games.model.Vendas;

import jakarta.transaction.Transactional;

@Service
public class VendasService {

    private final VendasRepository vendasRepository;
    private final ClientesRepository clientesRepository;
    private final UsuariosRepository usuariosRepository;
    private final ProdutosRepository produtosRepository;

    public VendasService(VendasRepository vendasRepository,
                         ClientesRepository clientesRepository,
                         UsuariosRepository usuariosRepository,
                         ProdutosRepository produtosRepository) {
        this.vendasRepository = vendasRepository;
        this.clientesRepository = clientesRepository;
        this.usuariosRepository = usuariosRepository;
        this.produtosRepository = produtosRepository;
    }
    
    @Transactional
    public Vendas registrarVenda(Vendas venda) {
        if (venda.getCliente() == null || venda.getCliente().getId() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório para registrar a venda.");
        }

        if (venda.getUsuario() == null || venda.getUsuario().getId() == null) {
            throw new IllegalArgumentException("Usuário responsável é obrigatório para registrar a venda.");
        }

        if (venda.getItens() == null || venda.getItens().isEmpty()) {
            throw new IllegalArgumentException("A venda não pode ser registrada sem itens.");
        }

        Clientes cliente = clientesRepository.findById(venda.getCliente().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        Usuarios usuario = usuariosRepository.findById(venda.getUsuario().getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemVendas item : venda.getItens()) {
            if (item.getProduto() == null || item.getProduto().getId() == null) {
                throw new IllegalArgumentException("Produto é obrigatório no item da venda.");
            }

            if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Quantidade do item deve ser maior que zero.");
            }

            Produtos produto = produtosRepository.findById(item.getProduto().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

            if (produto.getQuantidadeEstoque() < item.getQuantidade()) {
                throw new IllegalArgumentException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            BigDecimal precoUnitario = produto.getPreco();
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(item.getQuantidade()));

            item.setProduto(produto);
            item.setVenda(venda);
            item.setPrecoUnitario(precoUnitario);
            item.setSubtotal(subtotal);

            valorTotal = valorTotal.add(subtotal);

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - item.getQuantidade());
            produtosRepository.save(produto);
        }

        venda.setCliente(cliente);
        venda.setUsuario(usuario);
        venda.setDataVenda(LocalDateTime.now());
        venda.setValorTotal(valorTotal);

        return vendasRepository.save(venda);
    }

    public List<Vendas> listarTodas() {
    return vendasRepository.findAll();
}

public Vendas buscarPorId(Long id) {
    return vendasRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Venda não encontrada."));
}
}