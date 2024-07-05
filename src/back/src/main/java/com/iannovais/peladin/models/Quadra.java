package com.iannovais.peladin.models;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = Quadra.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Quadra {

    public static final String TABLE_NAME = "quadra";

    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomeQuadra", length = 50, nullable = false, unique = true)
    @Size(min = 2, max = 50)
    @NotBlank
    private String nomeQuadra;

    @Column(name = "endereco", length = 100, nullable = false)
    @Size(min = 8, max = 100)
    @NotBlank
    private String endereco;
    
    @Column(name = "valorAluguel", nullable = false)
    @NotNull
    private Float valorAluguel;

    @Column(name = "capacidade", nullable = false)
    @NotNull
    private Integer capacidade;

    @Column(name = "contatoDono", length = 11, nullable = false)
    @NotBlank
    @Size(min = 11, max = 11)
    private String contatoDono;

    @Column(name = "fotoQuadra", nullable = false, length = 10000)
    @NotBlank
    private String fotoQuadra;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "description", length = 255, nullable = false)
    @Size(min = 1, max = 255)
    @NotBlank
    private String description;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private Date dataCriacao;
}