package com.iannovais.peladin.controllers;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.iannovais.peladin.models.User;
import com.iannovais.peladin.models.dto.UserCreateDTO;
import com.iannovais.peladin.models.dto.UserUpdateDTO;
import com.iannovais.peladin.models.dto.PorcentagemDeletadaRequest;
import com.iannovais.peladin.security.UserSpringSecurity;
import com.iannovais.peladin.services.UserService;
import com.iannovais.peladin.services.exceptions.AuthorizationException;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserCreateDTO obj) {
        User user = this.userService.fromDTO(obj);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Criptografar senha
        User newUser = this.userService.create(user);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> update(@Valid @RequestBody UserUpdateDTO obj, @PathVariable Long id) {
        obj.setId(id);
        User user = this.userService.fromDTO(obj);
        this.userService.update(user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User obj = this.userService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/info")
    public ResponseEntity<User> getUserInfo() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (userSpringSecurity == null || userSpringSecurity.getId() == null) {
            throw new AuthorizationException("Acesso negado!");
        }
        Long userId = userSpringSecurity.getId();
        User user = this.userService.findById(userId);
        return ResponseEntity.ok().body(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> list = userService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/porcentagem-deletada")
    public ResponseEntity<Double> getPorcentagemContasDeletadas() {
        double porcentagem = userService.getPorcentagemContasDeletadas();
        return ResponseEntity.ok().body(porcentagem);
    }

    @GetMapping("/porcentagem-deletada-mensal")
    public ResponseEntity<Map<LocalDate, Double>> getPorcentagemContasDeletadasMensal() {
        Map<LocalDate, Double> porcentagemMensal = userService.getPorcentagemContasDeletadasMensal();
        return ResponseEntity.ok().body(porcentagemMensal);
    }

    @PostMapping("/porcentagem-deletada-mensal")
    public ResponseEntity<Void> addPorcentagemContasDeletadasMensal(@Valid @RequestBody PorcentagemDeletadaRequest request) {
        LocalDate date = LocalDate.parse(request.getDate());
        userService.addPorcentagemContasDeletadasMensal(date, request.getPorcentagem());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
