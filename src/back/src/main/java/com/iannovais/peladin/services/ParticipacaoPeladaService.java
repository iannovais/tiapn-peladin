package com.iannovais.peladin.services;

import com.iannovais.peladin.models.ParticipacaoPelada;
import com.iannovais.peladin.models.ParticipacaoPeladaId;
import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.repositories.ParticipacaoPeladaRepository;
import com.iannovais.peladin.repositories.UserRepository;
import com.iannovais.peladin.services.exceptions.ObjectNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

@Service
public class ParticipacaoPeladaService {

    @Autowired
    private ParticipacaoPeladaRepository participacaoPeladaRepository;

    @Autowired
    private UserRepository userRepository;

    public List<User> getParticipantesPelada(Long peladaId) {
        List<ParticipacaoPelada> participacoes = participacaoPeladaRepository.findByPeladaId(peladaId);
        List<User> participantes = new ArrayList<>();
        for (ParticipacaoPelada participacao : participacoes) {
            User user = userRepository.findById(participacao.getUserId())
                    .orElseThrow(() -> new ObjectNotFoundException("Usuário não encontrado com o ID: " + participacao.getUserId()));
            participantes.add(user);
        }

        return participantes;
    }

    public List<ParticipacaoPelada> getAllParticipacoes() {
        return participacaoPeladaRepository.findAll();
    }

    public Optional<ParticipacaoPelada> getParticipacaoById(ParticipacaoPeladaId id) {
        return participacaoPeladaRepository.findById(id);
    }

    public ParticipacaoPelada createParticipacao(ParticipacaoPelada participacaoPelada) {
        return participacaoPeladaRepository.save(participacaoPelada);
    }

    public Optional<ParticipacaoPelada> updateParticipacao(ParticipacaoPeladaId id, ParticipacaoPelada participacaoDetalhes) {
        return participacaoPeladaRepository.findById(id).map(participacaoExistente -> {
            participacaoExistente.setUser(participacaoDetalhes.getUser());
            participacaoExistente.setPelada(participacaoDetalhes.getPelada());
            return participacaoPeladaRepository.save(participacaoExistente);
        });
    }

    public boolean deleteParticipacao(ParticipacaoPeladaId id) {
        return participacaoPeladaRepository.findById(id).map(participacao -> {
            participacaoPeladaRepository.deleteById(id);
            return true;
        }).orElse(false);
    }
    
    public void deleteByPeladaId(Long peladaId) {
        List<ParticipacaoPelada> participacoes = participacaoPeladaRepository.findByPeladaId(peladaId);
        participacaoPeladaRepository.deleteAll(participacoes);
    }

    public List<Pelada> findPeladasByUserId(Long userId) {
        return participacaoPeladaRepository.findPeladasByUserId(userId);
    }

    @Transactional
    public Optional<ParticipacaoPelada> patchParticipacao(ParticipacaoPeladaId id, Map<String, Object> updates) {
        Optional<ParticipacaoPelada> optionalParticipacao = participacaoPeladaRepository.findById(id);

        if (optionalParticipacao.isPresent()) {
            ParticipacaoPelada participacao = optionalParticipacao.get();

            updates.forEach((key, value) -> {
                switch (key) {
                    case "status":
                        participacao.setStatus((String) value);
                        break;
                }
            });

            participacaoPeladaRepository.save(participacao);
        }

        return optionalParticipacao;
    }

    public List<ParticipacaoPelada> getParticipacoesByPeladaId(Long peladaId) {
        return participacaoPeladaRepository.findByPeladaId(peladaId);
    }

    public void saveParticipacao(ParticipacaoPelada participacaoPelada) {
        participacaoPeladaRepository.save(participacaoPelada);
    }
    public Map<YearMonth, Long> getParticipacoesPerMonth() {
        List<ParticipacaoPelada> participacoes = participacaoPeladaRepository.findAll();
        return participacoes.stream()
                            .collect(Collectors.groupingBy(
                                participacao -> YearMonth.from(participacao.getPelada().getData().toLocalDate()), 
                                Collectors.counting()));
    }
    
    public Map<YearMonth, Double> getMediaParticipacoesPorUsuarioPorMes() {
        List<ParticipacaoPelada> participacoes = participacaoPeladaRepository.findAll();
        long totalUsuarios = userRepository.count();

        if (totalUsuarios == 0) {
            return new HashMap<>(); // Evita divisão por zero
        }

        Map<YearMonth, Integer> participacoesPorMes = new HashMap<>();

        for (ParticipacaoPelada participacao : participacoes) {
            LocalDate data = participacao.getPelada().getData().toLocalDate(); // Supondo que ParticipacaoPelada tem um campo LocalDate data
            YearMonth yearMonth = YearMonth.from(data);

            participacoesPorMes.put(yearMonth, participacoesPorMes.getOrDefault(yearMonth, 0) + 1);
        }

        Map<YearMonth, Double> mediaPorMes = new HashMap<>();
        for (Map.Entry<YearMonth, Integer> entry : participacoesPorMes.entrySet()) {
            mediaPorMes.put(entry.getKey(), (double) entry.getValue() / totalUsuarios);
        }

        return mediaPorMes;
    }
}
