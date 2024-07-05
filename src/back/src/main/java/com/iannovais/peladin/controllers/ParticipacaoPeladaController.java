package com.iannovais.peladin.controllers;

import com.iannovais.peladin.models.ParticipacaoPelada;
import com.iannovais.peladin.models.ParticipacaoPeladaId;
import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.security.UserSpringSecurity;
import com.iannovais.peladin.services.ParticipacaoPeladaService;
import com.iannovais.peladin.services.UserService;
import com.iannovais.peladin.services.exceptions.AuthorizationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/participacoes")
public class ParticipacaoPeladaController {

    @Autowired
    private ParticipacaoPeladaService participacaoPeladaService;

    @GetMapping
    public ResponseEntity<List<ParticipacaoPelada>> getAllParticipacoes() {
        List<ParticipacaoPelada> participacoes = participacaoPeladaService.getAllParticipacoes();
        return new ResponseEntity<>(participacoes, HttpStatus.OK);
    }

    @GetMapping("/{peladaId}/participantes")
    public ResponseEntity<List<User>> getParticipantesPelada(@PathVariable Long peladaId) {
        List<User> participantes = participacaoPeladaService.getParticipantesPelada(peladaId);
        return new ResponseEntity<>(participantes, HttpStatus.OK);
    }

    @GetMapping("/{userId}/{peladaId}")
    public ResponseEntity<ParticipacaoPelada> getParticipacaoById(@PathVariable Long userId,
            @PathVariable Long peladaId) {
        ParticipacaoPeladaId id = new ParticipacaoPeladaId(userId, peladaId);
        ParticipacaoPelada participacao = participacaoPeladaService.getParticipacaoById(id)
                .orElseThrow(() -> new EntityNotFoundException("Participação não encontrada"));
        return new ResponseEntity<>(participacao, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ParticipacaoPelada> createParticipacao(@RequestBody ParticipacaoPelada participacaoPelada) {
        ParticipacaoPelada novaParticipacao = participacaoPeladaService.createParticipacao(participacaoPelada);
        return new ResponseEntity<>(novaParticipacao, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}/{peladaId}")
    public ResponseEntity<ParticipacaoPelada> updateParticipacao(@PathVariable Long userId, @PathVariable Long peladaId,
            @RequestBody ParticipacaoPelada participacaoDetalhes) {
        ParticipacaoPeladaId id = new ParticipacaoPeladaId(userId, peladaId);
        ParticipacaoPelada participacaoAtualizada = participacaoPeladaService
                .updateParticipacao(id, participacaoDetalhes)
                .orElseThrow(() -> new EntityNotFoundException("Participação não encontrada"));
        return new ResponseEntity<>(participacaoAtualizada, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{peladaId}")
    public ResponseEntity<HttpStatus> deleteParticipacao(@PathVariable Long userId, @PathVariable Long peladaId) {
        ParticipacaoPeladaId id = new ParticipacaoPeladaId(userId, peladaId);
        if (participacaoPeladaService.deleteParticipacao(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/participacoes")
    public ResponseEntity<List<Pelada>> getPeladasParticipadasByUser() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (userSpringSecurity == null || userSpringSecurity.getId() == null) {
            throw new AuthorizationException("Acesso negado!");
        }
        Long userId = userSpringSecurity.getId();
        List<Pelada> peladas = participacaoPeladaService.findPeladasByUserId(userId);
        return new ResponseEntity<>(peladas, HttpStatus.OK);
    }

    @PatchMapping("/{userId}/{peladaId}")
    public ResponseEntity<ParticipacaoPelada> patchParticipacao(@PathVariable Long userId, @PathVariable Long peladaId,
            @RequestBody Map<String, Object> updates) {
        ParticipacaoPeladaId id = new ParticipacaoPeladaId(userId, peladaId);
        ParticipacaoPelada participacaoAtualizada = participacaoPeladaService.patchParticipacao(id, updates)
                .orElseThrow(() -> new EntityNotFoundException("Participação não encontrada"));
        return new ResponseEntity<>(participacaoAtualizada, HttpStatus.OK);
    }
    @GetMapping("/participacoes-por-mes")
    public ResponseEntity<Map<YearMonth, Long>> getParticipacoesPerMonth() {
        Map<YearMonth, Long> participacoesPerMonth = participacaoPeladaService.getParticipacoesPerMonth();
        return ResponseEntity.ok(participacoesPerMonth);
    }
    @GetMapping("/media-participacoes-mes")
    public ResponseEntity<Map<YearMonth, Double>> getMediaParticipacoesPorUsuarioPorMes() {
        Map<YearMonth, Double> mediaParticipacoesPorMes = participacaoPeladaService.getMediaParticipacoesPorUsuarioPorMes();
        return new ResponseEntity<>(mediaParticipacoesPorMes, HttpStatus.OK);
    }
}

