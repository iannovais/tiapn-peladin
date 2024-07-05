package com.iannovais.peladin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.iannovais.peladin.models.Quadra;
import com.iannovais.peladin.models.projection.QuadraProjection;

@Repository
public interface QuadraRepository extends JpaRepository<Quadra, Long> {

    List<QuadraProjection> findByUser_Id(Long id);

    @Query("SELECT DATE(q.dataCriacao) as data, AVG(q.valorAluguel) as valorMedio FROM Quadra q GROUP BY DATE(q.dataCriacao)")
    List<Object[]> findValorMedioPorDia();
    
}