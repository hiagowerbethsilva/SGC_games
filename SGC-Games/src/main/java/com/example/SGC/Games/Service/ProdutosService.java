package com.example.SGC.Games.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.SGC.Games.Repository.ProdutosRepository;
import com.example.SGC.Games.model.Produtos;

@Service
public class ProdutosService {

    private final ProdutosRepository produtosRepository;

    public ProdutosService(ProdutosRepository produtosRepository) {
        this.produtosRepository = produtosRepository;
    }

    public Produtos salvar(Produtos produto) {
        validarProduto(produto);
        return produtosRepository.save(produto);
    }

    public List<Produtos> listarTodos() {
        return produtosRepository.findAll();
    }

    public Produtos buscarPorId(Long id) {
        return produtosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
    }

    public void remover(Long id) {
        Produtos produto = buscarPorId(id);
        produtosRepository.delete(produto);
    }

    public void baixarEstoque(Produtos produto, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade inválida.");
        }

        if (produto.getQuantidadeEstoque() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para o produto: " + produto.getNome());
        }

        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
        produtosRepository.save(produto);
    }

    private void validarProduto(Produtos produto) {
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        if (produto.getPreco() == null || produto.getPreco().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo.");
        }

        if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("Quantidade em estoque não pode ser negativa.");
        }

        if (produto.getEstoqueMinimo() == null || produto.getEstoqueMinimo() < 0) {
            throw new IllegalArgumentException("Estoque mínimo não pode ser negativo.");
        }

        if (produto.getTipo() == null || produto.getTipo().isBlank()) {
            throw new IllegalArgumentException("Tipo do produto é obrigatório.");
        }

        if (produto.getPlataforma() == null || produto.getPlataforma().isBlank()) {
            throw new IllegalArgumentException("Plataforma do produto é obrigatória.");
        }
    }

    public List<Produtos> listarEstoqueBaixo() {
    return produtosRepository.findAll()
            .stream()
            .filter(produto -> produto.getQuantidadeEstoque() <= produto.getEstoqueMinimo())
            .toList();
}
}
