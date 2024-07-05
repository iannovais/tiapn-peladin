package com.iannovais.peladin.controllers;

import com.iannovais.peladin.exceptions.ResourceNotFoundException;
import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.models.projection.PeladaProjection;
import com.iannovais.peladin.services.ParticipacaoPeladaService;
import com.iannovais.peladin.services.PeladaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.YearMonth;
import java.util.Map;

@RestController
@RequestMapping("pelada")
public class PeladaController {

    @Autowired
    private PeladaService peladaService;

    @Autowired
    private ParticipacaoPeladaService participacaoPeladaService;

    @GetMapping("/{id}")
    public ResponseEntity<Pelada> getPeladaById(@PathVariable(value = "id") Long id) {
        Pelada pelada = peladaService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pelada not found for this id :: " + id));
        return ResponseEntity.ok().body(pelada);
    }

    @GetMapping("/user")
    public ResponseEntity<List<PeladaProjection>> findAllByUser() {
        List<PeladaProjection> objs = this.peladaService.findAllByUser();
        return ResponseEntity.ok().body(objs);
    }

    @PostMapping
    public Pelada createPelada(@RequestBody Pelada pelada) {
        return peladaService.save(pelada);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<Pelada> updatePeladaPartial(@PathVariable(value = "id") Long id, @RequestBody Pelada peladaDetails) {
        Pelada updatedPelada = peladaService.partialUpdate(id, peladaDetails);
        return ResponseEntity.ok(updatedPelada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePelada(@PathVariable(value = "id") Long id) {
        peladaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Pelada>> findAll() {
        List<Pelada> list = peladaService.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/{peladaId}/participantes")
    public ResponseEntity<List<User>> getParticipantesPelada(@PathVariable Long peladaId) {
        List<User> participantes = participacaoPeladaService.getParticipantesPelada(peladaId);
    return new ResponseEntity<>(participantes, HttpStatus.OK);
}

    @GetMapping("/peladas-por-mes")
    public ResponseEntity<Map<YearMonth, Long>> getPeladasPerMonth() {
        Map<YearMonth, Long> peladasPerMonth = peladaService.getPeladasPerMonth();
        return ResponseEntity.ok(peladasPerMonth);
    }
    
}