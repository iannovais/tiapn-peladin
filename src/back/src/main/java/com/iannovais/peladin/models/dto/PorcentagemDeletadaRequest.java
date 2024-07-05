package com.iannovais.peladin.models.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class PorcentagemDeletadaRequest {

    @NotNull(message = "A data é obrigatória")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "A data deve estar no formato yyyy-MM-dd")
    private String date;

    @NotNull(message = "A porcentagem é obrigatória")
    private Double porcentagem;

    // Getters and Setters

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getPorcentagem() {
        return porcentagem;
    }

    public void setPorcentagem(Double porcentagem) {
        this.porcentagem = porcentagem;
    }
}
