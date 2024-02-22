package org.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    public List<EbayProduct> GetAllProducts(){
        return productRepository.findAll();
    }
    public void SaveProduct(EbayProduct product){
        productRepository.save(product);
    }
    public Optional<EbayProduct> FindProduct(EbayProduct product){
        return productRepository.findById(product.getId());
    }
    public EbayProduct GetProductWithMissingBuyButton(){
        return productRepository.findFirstByBuyUrlIsNull();
    }
}
