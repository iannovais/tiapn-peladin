package com.iannovais.peladin.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.iannovais.peladin.models.Estatistica;
import com.iannovais.peladin.models.Pelada;
import com.iannovais.peladin.models.User;
import com.iannovais.peladin.models.UserId;
import com.iannovais.peladin.models.dto.UserCreateDTO;
import com.iannovais.peladin.models.dto.UserUpdateDTO;
import com.iannovais.peladin.models.enums.ProfileEnum;
import com.iannovais.peladin.models.projection.PeladaProjection;
import com.iannovais.peladin.repositories.UserRepository;
import com.iannovais.peladin.security.UserSpringSecurity;
import com.iannovais.peladin.services.exceptions.DataBindingViolationException;
import com.iannovais.peladin.services.exceptions.ObjectNotFoundException;

@Service
public class UserService {

    private int totalUsuariosCriados = 0;
    private int totalUsuariosDeletados = 0;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EstatisticaService estatisticaService;

    @Autowired
    private QuadraService quadraService;

    @Autowired
    private PeladaService peladaService;

    @Autowired
    private ParticipacaoPeladaService participacaoPeladaService;

    @Autowired
    private EstatisticasMensaisService estatisticasMensaisService;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        return user.orElseThrow(() -> new ObjectNotFoundException(
                "Usuário não encontrado! Id: " + id + ", Tipo: " + User.class.getName()));
    }

    @Transactional
    public User create(User user) {
        user.addProfile(ProfileEnum.USER);
        User newUser = userRepository.save(user);

        Estatistica estatistica = new Estatistica();
        estatistica.setId(new UserId(newUser.getId()));
        estatistica.setUser(newUser);
        estatistica.setJogos(0);
        estatistica.setGols(0);
        estatistica.setAssistencias(0);
        estatistica.setDefesas(0);
        estatistica.setAta(50.0);
        estatistica.setDef(50.0);
        estatistica.setForca(50.0);
        estatistica.setOverall(50.0);
        estatistica.setNota_participacao(0.0);
        estatistica.setCraque_da_pelada(0);
        estatistica.setBagre_da_pelada(0);

        estatisticaService.save(estatistica);

        totalUsuariosCriados++;

        return newUser;
    }

    @Transactional
    public User update(User obj) {
        User existingUser = userRepository.findById(obj.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id: " + obj.getId() + " não encontrado"));

        existingUser.setUsername(obj.getUsername());
        existingUser.setNomeUsuario(obj.getNomeUsuario());
        existingUser.setPosicao(obj.getPosicao());
        existingUser.setFotoPerfil(obj.getFotoPerfil());
        existingUser.setTelefone(obj.getTelefone());
        return userRepository.save(existingUser);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        deleteRelatedEntities(id);
        try {
            this.userRepository.deleteById(id);
            totalUsuariosDeletados++;
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possível excluir pois há entidades relacionadas!");
        }
    }

    private void deleteRelatedEntities(Long userId) {
        estatisticaService.deleteById(new UserId(userId));

        quadraService.deleteByUserId(userId);

        List<PeladaProjection> peladas = peladaService.findPeladasByUserId(userId);
        for (PeladaProjection pelada : peladas) {
            peladaService.deleteById(pelada.getId());
        }

        List<Pelada> participacoes = participacaoPeladaService.findPeladasByUserId(userId);
        for (Pelada participacao : participacoes) {
            participacaoPeladaService.deleteByPeladaId(participacao.getId());
        }
    }

    public static UserSpringSecurity authenticated() {
        try {
            return (UserSpringSecurity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }

    public User fromDTO(@Valid UserCreateDTO obj) {
        User user = new User();
        user.setUsername(obj.getUsername());
        user.setPassword(obj.getPassword());
        user.setNomeUsuario(obj.getNomeUsuario());
        user.setDataNascimento(obj.getDataNascimento());
        user.setEmail(obj.getEmail());
        user.setPosicao(obj.getPosicao());
        user.setFotoPerfil(obj.getFotoPerfil());
        user.setTelefone(obj.getTelefone());

        return user;
    }

    public User fromDTO(@Valid UserUpdateDTO obj) {
        User user = new User();
        user.setId(obj.getId());

        user.setPosicao(obj.getPosicao());
        user.setNomeUsuario(obj.getNomeUsuario());
        user.setUsername(obj.getUsername());
        user.setFotoPerfil(obj.getFotoPerfil());
        user.setTelefone(obj.getTelefone());
        return user;
    }

    public double getPorcentagemContasDeletadas() {
        if (totalUsuariosCriados == 0) {
            return 0;
        }
        return ((double) totalUsuariosDeletados / totalUsuariosCriados) * 100;
    }


    public void addPorcentagemContasDeletadasMensal(LocalDate date, double porcentagem) {
        estatisticasMensaisService.addPorcentagemContasDeletadas(date, porcentagem);
    }

    public Map<LocalDate, Double> getPorcentagemContasDeletadasMensal() {
        return estatisticasMensaisService.getPorcentagemContasDeletadasMensal();
    }
}
