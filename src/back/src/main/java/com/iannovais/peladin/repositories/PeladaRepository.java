package com.iannovais.peladin.repositories;

import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.projection.PeladaProjection;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeladaRepository extends JpaRepository<Pelada, Long> {

    List<PeladaProjection> findByUser_Id(Long id);
    List<Pelada> findByQuadra_Id(Long quadraId);
}
