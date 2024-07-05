package com.iannovais.peladin.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "participacao_na_pelada")
@IdClass(ParticipacaoPeladaId.class)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ParticipacaoPelada {
    @Id
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_pelada")
    private Pelada pelada;

    @Column(name = "status", length = 12, nullable = false)
    @NotBlank
    private String status = "inscrito";

    public Long getUserId() {
        return user.getId();
    }
}