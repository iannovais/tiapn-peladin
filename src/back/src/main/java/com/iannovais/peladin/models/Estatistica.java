package com.iannovais.peladin.models;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = Estatistica.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Estatistica {
    public static final String TABLE_NAME = "estatistica";

    @EmbeddedId
    private UserId id;

    @MapsId("id")
    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @Column(name = "jogos", nullable = false)
    @NotNull
    private Integer jogos = 0;

    @Column(name = "gols", nullable = false)
    @NotNull
    private Integer gols = 0;
    
    @Column(name = "assistencias", nullable = false)
    @NotNull
    private Integer assistencias = 0;

    @Column(name = "defesas", nullable = false)
    @NotNull
    private Integer defesas = 0;

    @Column(name = "ATA", nullable = false)
    @NotNull
    private Double ata = 50.0;

    @Column(name = "DEF", nullable = false)
    @NotNull
    private Double def = 50.0;

    @Column(name = "FORCA", nullable = false)
    @NotNull
    private Double forca = 50.0;

    @Column(name = "overall", nullable = false)
    @NotNull
    private Double overall = 50.0;

    @Column(name = "nota_geral", nullable = false)
    @NotNull
    private Integer nota_geral = 0;

    @Column(name = "avaliacoes", nullable = false)
    @NotNull
    private Integer avaliacoes = 0;

    @Column(name = "nota_participacao", nullable = false)
    @NotNull
    private Double nota_participacao = 0.0;

    @Column(name = "craque_da_pelada", nullable = false)
    @NotNull
    private Integer craque_da_pelada = 0;

    @Column(name = "bagre_da_pelada", nullable = false)
    @NotNull
    private Integer bagre_da_pelada = 0;
}