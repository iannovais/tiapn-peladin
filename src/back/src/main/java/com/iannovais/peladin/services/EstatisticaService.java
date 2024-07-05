package com.iannovais.peladin.services;

import com.iannovais.peladin.models.Estatistica;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.models.UserId;
import com.iannovais.peladin.repositories.EstatisticaRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class EstatisticaService {

    @Autowired
    private EstatisticaRepository estatisticaRepository;

    @Autowired
    private ParticipacaoPeladaService participacaoPeladaService;

    public List<Estatistica> findAll() {
        return estatisticaRepository.findAll();
    }

    public Optional<Estatistica> findById(UserId userId) {
        return estatisticaRepository.findById(userId);
    }

    public Estatistica save(Estatistica estatistica) {
        return estatisticaRepository.save(estatistica);
    }

    public void deleteById(UserId userId) {
        estatisticaRepository.deleteById(userId);
    }

    public Estatistica partialUpdate(Long id, Estatistica estatisticaDetails) {
        UserId userId = new UserId(id);
        Optional<Estatistica> estatistica = estatisticaRepository.findById(userId);
        if (estatistica.isPresent()) {
            Estatistica updatedEstatistica = estatistica.get();
            BeanUtils.copyProperties(estatisticaDetails, updatedEstatistica, getNullPropertyNames(estatisticaDetails));
            return estatisticaRepository.save(updatedEstatistica);
        } else {
            throw new RuntimeException("Estatistica not found");
        }
    }

    private String[] getNullPropertyNames(Estatistica source) {
        final Field[] fields = Estatistica.class.getDeclaredFields();
        return Arrays.stream(fields)
                .filter(field -> {
                    field.setAccessible(true);
                    try {
                        return field.get(source) == null;
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException(e);
                    }
                })
                .map(Field::getName)
                .toArray(String[]::new);
    }

    public void atualizarEstatisticasUsuarios(Long peladaId) {
        List<User> participantes = participacaoPeladaService.getParticipantesPelada(peladaId);
        for (User user : participantes) {
            UserId userId = new UserId(user.getId());
            Estatistica estatistica = estatisticaRepository.findById(userId)
                .orElseGet(() -> new Estatistica(userId, user, 0, 0, 0, 0, 50.0, 50.0, 50.0, 50.0, 0, 0, 0.0, 0, 0));
            estatistica.setJogos(estatistica.getJogos() + 1);
            estatisticaRepository.save(estatistica);
        }
    }
}