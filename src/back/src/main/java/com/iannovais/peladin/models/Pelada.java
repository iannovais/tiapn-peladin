package com.iannovais.peladin.models;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = Pelada.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Pelada {

    public static final String TABLE_NAME = "pelada";

    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    @NotNull
    private String nome;

    @Column(name = "descricao", nullable = false)
    @NotNull
    private String descricao;

    @Column(name = "foto", nullable = false)
    @NotNull
    private String foto;

    @Column(name = "duracao", nullable = false)
    @NotNull
    private Time duracao;

    @Column(name = "hora", nullable = false)
    @NotNull
    private Time hora;

    @Column(name = "data", nullable = false)
    @NotNull
    private Date data;

    @Column(name = "valor_pelada", nullable = false)
    @NotNull
    private BigDecimal valorPelada;

    @Column(name = "status", length = 30, nullable = false)
    @NotBlank
    @Size(min = 1, max = 30)
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_quadra")
    private Quadra quadra;

    @ManyToOne
    @JoinColumn(name = "dono_da_pelada")
    private User user;

    public LocalDateTime getDataHoraInicio() {
        LocalDate dataPelada = this.data.toLocalDate();
        LocalTime horaPelada = this.hora.toLocalTime();
        return LocalDateTime.of(dataPelada, horaPelada);
    }

    public LocalDateTime getDataHoraFim() {
        return getDataHoraInicio().plusHours(this.duracao.toLocalTime().getHour())
                                  .plusMinutes(this.duracao.toLocalTime().getMinute());
    }
}
