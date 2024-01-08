package com.usedtooling.services;

import com.usedtooling.models.EbayProduct;
import com.usedtooling.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    public Page<EbayProduct> getAllProducts(int start, int limit){
        Pageable pageable = PageRequest.of(start,limit, Sort.by(Sort.Direction.DESC, "id"));
        return productRepository.findAll(pageable);
    }
    public Optional<List<EbayProduct>> findProductsByTitle(String title){
        return productRepository.findAllByTitleContainingIgnoreCase(title);
    }

    public void UpdateProduct(EbayProduct product){
        productRepository.save(product);
    }
    public Optional<EbayProduct> getProductById(String pid){
        return productRepository.findById(Long.parseLong(pid));
    }
}
