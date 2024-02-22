package com.usedtooling.repositories;

import com.usedtooling.models.EbayProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends CrudRepository<EbayProduct, Long> {
    Page<EbayProduct> findAll(Pageable pageable);
    Optional<List<EbayProduct>> findAllByTitleContainingIgnoreCase(String title);
}
