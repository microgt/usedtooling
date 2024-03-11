package com.usedtooling.controllers;

import com.usedtooling.models.EbayProduct;
import com.usedtooling.models.ProductInfo;
import com.usedtooling.services.ProductService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProductController {
    @Autowired
    ProductService productService;

    @GetMapping("/getnew")
    public Optional<List<EbayProduct>> getAllProducts(@RequestParam(defaultValue = "0") String start, @RequestParam(defaultValue = "20") String end){
        return Optional.of(productService.getAllProducts(Integer.parseInt(start), Integer.parseInt(end)).getContent());
    }
    @GetMapping("/search")
    public Optional<List<EbayProduct>> search(@RequestParam(defaultValue = "") String q){
        return  productService.findProductsByTitle(q);
    }
    @GetMapping("/getimage")
    public String updateImageUrl(@RequestParam String pid){
        if(pid.isEmpty() || pid.isBlank()) return "";

        EbayProduct product = productService.getProductById(pid).get();
        try{
            Document doc = Jsoup.connect(product.getUrl())
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")
                    .get();
            product.setImage(
                    doc.getElementsByClass("ux-image-carousel-item image-treatment active  image").first()
                            .getElementsByTag("img").first().attr("src")
            );
        }catch (Exception e){}

        productService.UpdateProduct(product);
        return product.getImage();
    }
    @GetMapping("/product")
    public Optional<ProductInfo> getProduct(@RequestParam String purl){
        ProductInfo info = new ProductInfo();
        try {
            Document doc = Jsoup.connect(purl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")
                    .get();
            info.setDescription(doc.getElementsByClass("vim d-item-description").first().getElementById("desc_ifr").attr("src"));
            info.setBuyButtonUrl(doc.getElementById("binBtn_btn_1").attr("href"));
            info.setMakeOfferButtonUrl(doc.getElementById("boBtn_btn").attr("href"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return Optional.of(info);
    }
}
