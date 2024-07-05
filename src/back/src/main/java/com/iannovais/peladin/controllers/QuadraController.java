package com.iannovais.peladin.controllers;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.iannovais.peladin.models.Quadra;
import com.iannovais.peladin.models.dto.QuadraValorMedioDTO;
import com.iannovais.peladin.models.projection.QuadraProjection;
import com.iannovais.peladin.services.QuadraService;

@RestController
@RequestMapping("/quadra")
@Validated
public class QuadraController {

    @Autowired
    private QuadraService QuadraService;

    @GetMapping("/{id}")
    public ResponseEntity<Quadra> findById(@PathVariable Long id) {
        Quadra obj = this.QuadraService.findById(id);
        return ResponseEntity.ok(obj);
    }

    @GetMapping("/user")
    public ResponseEntity<List<QuadraProjection>> findAllByUser() {
        List<QuadraProjection> objs = this.QuadraService.findAllByUser();
        return ResponseEntity.ok().body(objs);
    }

    @PostMapping
    @Validated
    public ResponseEntity<Void> create(@Valid @RequestBody Quadra obj) {
        this.QuadraService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> update(@Valid @RequestBody Quadra obj, @PathVariable Long id) {
        obj.setId(id);
        this.QuadraService.update(obj);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.QuadraService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> patch(@RequestBody Quadra obj, @PathVariable Long id) {
        obj.setId(id);
        this.QuadraService.update(obj);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Quadra>> findAll() {
        List<Quadra> list = QuadraService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/valor-medio-por-dia")
    public ResponseEntity<List<QuadraValorMedioDTO>> getValorMedioPorDia() {
        List<QuadraValorMedioDTO> valoresMedios = QuadraService.findValorMedioPorDia();
        return ResponseEntity.ok(valoresMedios);
    }
}