package com.example.accessingdatajpa;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface EbayProductRepository extends CrudRepository<EbayProduct, Long> {

	List<EbayProduct> findByTitle(String title);

	EbayProduct findById(long id);
	public  boolean existsByUrl(String url);
}
