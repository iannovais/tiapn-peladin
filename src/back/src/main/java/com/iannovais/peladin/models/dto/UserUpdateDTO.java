package com.iannovais.peladin.models.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserUpdateDTO {

    private Long id;

    @Size(min = 8, max = 60)
    private String password;

    @NotBlank
    @Size(min = 2, max = 100)
    private String username;

    @JsonProperty("nome_usuario")
    @NotBlank
    private String nomeUsuario;

    @NotBlank
    @Size(min = 11, max = 11)
    private String telefone;

    @NotBlank
    private String posicao;

    @JsonProperty("foto_perfil")
    @NotBlank
    private String fotoPerfil;
}
