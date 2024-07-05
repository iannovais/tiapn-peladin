package com.iannovais.peladin.repositories;

import com.iannovais.peladin.models.ParticipacaoPelada;
import com.iannovais.peladin.models.ParticipacaoPeladaId;
import com.iannovais.peladin.models.Pelada;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipacaoPeladaRepository extends JpaRepository<ParticipacaoPelada, ParticipacaoPeladaId> {
    long count();
    List<ParticipacaoPelada> findByPeladaId(Long peladaId);

    @Query("SELECT p.pelada FROM ParticipacaoPelada p WHERE p.user.id = :userId")
    List<Pelada> findPeladasByUserId(@Param("userId") Long userId);
}
