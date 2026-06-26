package com.example.SGC.Games.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_venda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ItemVendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private Integer quantidade;

    private BigDecimal precoUnitario;

    private BigDecimal subtotal;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    @JsonIgnore
    private Vendas venda;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produtos produto;
}

