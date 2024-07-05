package com.iannovais.peladin.controllers;

import com.iannovais.peladin.models.Estatistica;
import com.iannovais.peladin.models.UserId;
import com.iannovais.peladin.services.EstatisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/estatisticas")
public class EstatisticaController {

    @Autowired
    private EstatisticaService estatisticaService;

    @GetMapping
    public List<Estatistica> getAllEstatisticas() {
        return estatisticaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estatistica> getEstatisticaById(@PathVariable Long id) {
        UserId userId = new UserId(id);
        Optional<Estatistica> estatistica = estatisticaService.findById(userId);
        return estatistica.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estatistica createEstatistica(@RequestBody Estatistica estatistica) {
        return estatisticaService.save(estatistica);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Estatistica> updateEstatisticaPartial(@PathVariable Long id, @RequestBody Estatistica estatisticaDetails) {
        Estatistica updatedEstatistica = estatisticaService.partialUpdate(id, estatisticaDetails);
        return ResponseEntity.ok(updatedEstatistica);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstatistica(@PathVariable Long id) {
        UserId userId = new UserId(id);
        if (estatisticaService.findById(userId).isPresent()) {
            estatisticaService.deleteById(userId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
