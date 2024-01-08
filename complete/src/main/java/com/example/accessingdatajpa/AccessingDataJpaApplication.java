package com.example.accessingdatajpa;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class AccessingDataJpaApplication {

	private static final Logger log = LoggerFactory.getLogger(AccessingDataJpaApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(AccessingDataJpaApplication.class);
	}

	@Autowired
	private EbayProductRepository repository;

	@Scheduled(cron = "0 1 17 * * ?")
	public void scheduledTask() {
		LocalDate today = LocalDate.now();
		System.out.println("Executing on: " + today + "....");

		try {
			System.out.println("Executing....");
			List<EbayProduct> products = DataFetcher.FetchProducts();

			if (products.isEmpty()) return;

			products.forEach(product -> {
				if (!repository.existsByUrl(product.getUrl())) {
					repository.save(product);
					System.out.println("Product added.");
				}
			});
		} catch (Exception e) {
			log.error("Error in scheduled task", e);
		}
	}
}
