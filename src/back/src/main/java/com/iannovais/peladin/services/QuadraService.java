package com.iannovais.peladin.services;

import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.iannovais.peladin.models.Quadra;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.models.dto.QuadraValorMedioDTO;
import com.iannovais.peladin.models.enums.ProfileEnum;
import com.iannovais.peladin.models.projection.QuadraProjection;
import com.iannovais.peladin.repositories.QuadraRepository;
import com.iannovais.peladin.security.UserSpringSecurity;
import com.iannovais.peladin.services.exceptions.AuthorizationException;
import com.iannovais.peladin.services.exceptions.DataBindingViolationException;
import com.iannovais.peladin.services.exceptions.ObjectNotFoundException;

@Service
public class QuadraService {

    @Autowired
    private QuadraRepository quadraRepository;

    @Autowired
    private PeladaService peladaService;

    @Autowired
    private UserService userService;

    public List<Quadra> findAll() {
        return quadraRepository.findAll();
    }

    public Quadra findById(Long id) {
        Quadra quadra = this.quadraRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException(
                "Tarefa não encontrada! Id: " + id + ", Tipo: " + Quadra.class.getName()));
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity)
                || !userSpringSecurity.hasRole(ProfileEnum.ADMIN) && !userHasQuadra(userSpringSecurity, quadra))
            throw new AuthorizationException("Acesso negado!");

        return quadra;
    }

    public List<QuadraProjection> findAllByUser() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");
        List<QuadraProjection> quadras = this.quadraRepository.findByUser_Id(userSpringSecurity.getId());
        return quadras;
    }

    @Transactional
    public Quadra create(Quadra obj) {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");
        User user = this.userService.findById(userSpringSecurity.getId());
        obj.setId(null);
        obj.setUser(user);
        obj = this.quadraRepository.save(obj);
        return obj;
    }

    @Transactional
    public Quadra update(Quadra obj) {
        Quadra newObj = findById(obj.getId());
        newObj.setDescription(obj.getDescription());
        newObj.setCapacidade(obj.getCapacidade());
        newObj.setContatoDono(obj.getContatoDono());
        newObj.setEndereco(obj.getEndereco());
        newObj.setFotoQuadra(obj.getFotoQuadra());
        newObj.setNomeQuadra(obj.getNomeQuadra());
        newObj.setValorAluguel(obj.getValorAluguel());
        return this.quadraRepository.save(newObj);
    }

    @Transactional
    public void delete(Long id) {
        peladaService.deleteByQuadraId(id);
        try {
            quadraRepository.deleteById(id);
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possível excluir pois há entidades relacionadas!");
        }
    }

    private Boolean userHasQuadra(UserSpringSecurity userSpringSecurity, Quadra quadra) {
        return quadra.getUser().getId().equals(userSpringSecurity.getId());
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        List<QuadraProjection> quadras = quadraRepository.findByUser_Id(userId);
        for (QuadraProjection quadra : quadras) {
            quadraRepository.deleteById(quadra.getId());
        }
    }

    public List<QuadraValorMedioDTO> findValorMedioPorDia() {
        List<Object[]> resultados = quadraRepository.findValorMedioPorDia();
        return resultados.stream()
                .map(result -> new QuadraValorMedioDTO((Date) result[0], (Double) result[1]))
                .collect(Collectors.toList());
    }
}