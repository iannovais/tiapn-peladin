package com.iannovais.peladin.models.dto;

import java.time.LocalDate;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserCreateDTO {

    @NotBlank
    @Size(min = 2, max = 100)
    private String username;

    @NotBlank
    @Size(min = 8, max = 60)
    private String password;

    @NotBlank
    private String nomeUsuario;

    @NotNull
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimento;

    @NotBlank
    @Email
    @Size(min = 5, max = 100)
    private String email;

    @NotBlank
    private String posicao;

    @NotBlank
    private String fotoPerfil;

    @NotBlank
    @Size(min = 11, max = 11)
    private String telefone;
}