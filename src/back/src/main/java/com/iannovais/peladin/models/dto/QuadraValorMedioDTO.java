package com.iannovais.peladin.models.dto;

import java.util.Date;

public class QuadraValorMedioDTO {
    private Date data;
    private Double valorMedio;

    public QuadraValorMedioDTO(Date data, Double valorMedio) {
        this.data = data;
        this.valorMedio = valorMedio;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public Double getValorMedio() {
        return valorMedio;
    }

    public void setValorMedio(Double valorMedio) {
        this.valorMedio = valorMedio;
    }
}