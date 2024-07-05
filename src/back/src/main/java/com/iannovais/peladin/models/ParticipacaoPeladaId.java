package com.iannovais.peladin.models;

import java.io.Serializable;
import java.util.Objects;

public class ParticipacaoPeladaId implements Serializable {
    private Long user;
    private Long pelada;

    public ParticipacaoPeladaId() {}

    public ParticipacaoPeladaId(Long user, Long pelada) {
        this.user = user;
        this.pelada = pelada;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public Long getPelada() {
        return pelada;
    }

    public void setPelada(Long pelada) {
        this.pelada = pelada;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipacaoPeladaId that = (ParticipacaoPeladaId) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(pelada, that.pelada);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, pelada);
    }
}
