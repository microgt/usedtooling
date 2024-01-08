package com.usedtooling.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.usedtooling.controllers")
@ComponentScan(basePackages = "com.usedtooling.services")
@EnableJpaRepositories(basePackages = "com.usedtooling.repositories")
@EntityScan(basePackages = "com.usedtooling.models")
public class WebApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebApplication.class, args);
	}
}
