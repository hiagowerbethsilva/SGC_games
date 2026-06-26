package com.example.SGC.Games.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SGC.Games.Service.ProdutosService;
import com.example.SGC.Games.model.Produtos;

@RestController
@RequestMapping("/produtos")
public class ProdutosController {

    private final ProdutosService produtosService;

    public ProdutosController(ProdutosService produtosService) {
        this.produtosService = produtosService;
    }

    @PostMapping
    public Produtos salvar(@RequestBody Produtos produto) {
        return produtosService.salvar(produto);
    }

    @GetMapping
    public List<Produtos> listarTodos() {
        return produtosService.listarTodos();
    }

    @GetMapping("/{id}")
    public Produtos buscarPorId(@PathVariable Long id) {
        return produtosService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Produtos atualizar(@PathVariable Long id, @RequestBody Produtos produto) {
        produto.setId(id);
        return produtosService.salvar(produto);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        produtosService.remover(id);
    }

    @GetMapping("/estoque-baixo")
    public List<Produtos> listarEstoqueBaixo() {
        return produtosService.listarEstoqueBaixo();
    }
}
