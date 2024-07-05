package com.iannovais.peladin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class peladinApplication {

	public static void main(String[] args) {
		SpringApplication.run(peladinApplication.class, args);
	}
}
