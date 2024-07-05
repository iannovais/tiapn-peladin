package com.iannovais.peladin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.iannovais.peladin.models.Estatistica;
import com.iannovais.peladin.models.UserId;

@Repository
public interface EstatisticaRepository extends JpaRepository<Estatistica, UserId> {
}
