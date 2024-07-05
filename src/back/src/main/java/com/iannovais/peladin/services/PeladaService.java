package com.iannovais.peladin.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.time.YearMonth;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.iannovais.peladin.exceptions.ResourceNotFoundException;
import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.ParticipacaoPelada;
import com.iannovais.peladin.models.projection.PeladaProjection;
import com.iannovais.peladin.repositories.PeladaRepository;
import com.iannovais.peladin.security.UserSpringSecurity;
import com.iannovais.peladin.services.exceptions.AuthorizationException;

@Service
public class PeladaService {

    @Autowired
    private PeladaRepository peladaRepository;

    @Autowired
    private ParticipacaoPeladaService participacaoPeladaService;

    @Autowired
    private EstatisticaService estatisticaService;

    public List<Pelada> findAll() {
        return peladaRepository.findAll();
    }

    public Optional<Pelada> findById(Long id) {
        return peladaRepository.findById(id);
    }

    public Pelada save(Pelada pelada) {
        return peladaRepository.save(pelada);
    }

    public void deleteById(Long id) {
        participacaoPeladaService.deleteByPeladaId(id);
        peladaRepository.deleteById(id);
    }

    public List<PeladaProjection> findAllByUser() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");
        List<PeladaProjection> peladas = this.peladaRepository.findByUser_Id(userSpringSecurity.getId());
        return peladas;
    }

    public Pelada partialUpdate(Long id, Pelada peladaDetails) {
        Pelada pelada = peladaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pelada not found for this id :: " + id));

        if (peladaDetails.getNome() != null) {
            pelada.setNome(peladaDetails.getNome());
        }

        if (peladaDetails.getDescricao() != null) {
            pelada.setDescricao(peladaDetails.getDescricao());
        }

        if (peladaDetails.getFoto() != null) {
            pelada.setFoto(peladaDetails.getFoto());
        }

        if (peladaDetails.getDuracao() != null) {
            pelada.setDuracao(peladaDetails.getDuracao());
        }

        if (peladaDetails.getHora() != null) {
            pelada.setHora(peladaDetails.getHora());
        }

        if (peladaDetails.getData() != null) {
            pelada.setData(peladaDetails.getData());
        }

        if (peladaDetails.getValorPelada() != null) {
            pelada.setValorPelada(peladaDetails.getValorPelada());
        }

        if (peladaDetails.getStatus() != null) {
            pelada.setStatus(peladaDetails.getStatus());
        }

        if (peladaDetails.getQuadra() != null) {
            pelada.setQuadra(peladaDetails.getQuadra());
        }

        if (peladaDetails.getUser() != null) {
            pelada.setUser(peladaDetails.getUser());
        }

        return peladaRepository.save(pelada);
    }

    @Transactional
    public void deleteByQuadraId(Long quadraId) {
        List<Pelada> peladas = peladaRepository.findByQuadra_Id(quadraId);
        for (Pelada pelada : peladas) {
            participacaoPeladaService.deleteByPeladaId(pelada.getId());
            peladaRepository.deleteById(pelada.getId());
        }
    }

    public List<PeladaProjection> findPeladasByUserId(Long userId) {
        return peladaRepository.findByUser_Id(userId);
    }

    @Scheduled(fixedRate = 60000)
    public void atualizarStatusPeladas() {
        LocalDateTime agora = LocalDateTime.now();
        List<Pelada> peladas = peladaRepository.findAll();

        for (Pelada pelada : peladas) {
            if (!pelada.getStatus().equals("encerrada")) {
                if (agora.isAfter(pelada.getDataHoraFim()) && pelada.getStatus().equals("em_andamento")) {
                    pelada.setStatus("aguardando_avaliacoes");
                    peladaRepository.save(pelada);
                    atualizarParticipacoesParaJogou(pelada);
                    estatisticaService.atualizarEstatisticasUsuarios(pelada.getId());
                } else if (agora.isAfter(pelada.getDataHoraInicio()) && pelada.getStatus().equals("criada")) {
                    pelada.setStatus("em_andamento");
                    peladaRepository.save(pelada);
                } else if (agora.isAfter(pelada.getDataHoraFim().plusHours(24)) && pelada.getStatus().equals("aguardando_avaliacoes")) {
                    pelada.setStatus("encerrada");
                    peladaRepository.save(pelada);
                }
            }
        }
    }

    private void atualizarParticipacoesParaJogou(Pelada pelada) {
        List<ParticipacaoPelada> participacoes = participacaoPeladaService.getParticipacoesByPeladaId(pelada.getId());
        for (ParticipacaoPelada participacao : participacoes) {
            if ("inscrito".equals(participacao.getStatus())) {
                participacao.setStatus("jogou");
                participacaoPeladaService.saveParticipacao(participacao);
            }
        }
    }

    public Map<YearMonth, Long> getPeladasPerMonth() {
        List<Pelada> peladas = peladaRepository.findAll();
        return peladas.stream()
                      .collect(Collectors.groupingBy(
                          pelada -> YearMonth.from(pelada.getData().toLocalDate()), 
                          Collectors.counting()));
    }
}
