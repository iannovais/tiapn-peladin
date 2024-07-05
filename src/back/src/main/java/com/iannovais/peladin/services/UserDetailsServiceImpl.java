package com.iannovais.peladin.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.iannovais.peladin.models.User;
import com.iannovais.peladin.repositories.UserRepository;
import com.iannovais.peladin.security.UserSpringSecurity;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsername(username);
        if (Objects.isNull(user))
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        return new UserSpringSecurity(user.getId(), user.getUsername(), user.getPassword(),user.getNomeUsuario(),user.getDataNascimento(),user.getEmail(),user.getPosicao(),user.getFotoPerfil(),user.getTelefone(), user.getProfiles());
    }
}