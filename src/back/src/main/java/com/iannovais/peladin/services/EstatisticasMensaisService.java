package com.iannovais.peladin.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class EstatisticasMensaisService {

    @Autowired
    private UserService userService;

    private Map<LocalDate, Double> porcentagemContasDeletadasMensal = new HashMap<>();

    @Scheduled(cron = "0 0 0 1 * ?") // Executa à meia-noite do primeiro dia de cada mês
    public void salvarPorcentagemContasDeletadasMensal() {
        LocalDate now = LocalDate.now();
        double porcentagem = userService.getPorcentagemContasDeletadas();
        porcentagemContasDeletadasMensal.put(now, porcentagem);
    }

    public void addPorcentagemContasDeletadas(LocalDate date, double porcentagem) {
        porcentagemContasDeletadasMensal.put(date, porcentagem);
    }

    public Map<LocalDate, Double> getPorcentagemContasDeletadasMensal() {
        return porcentagemContasDeletadasMensal;
    }
}
