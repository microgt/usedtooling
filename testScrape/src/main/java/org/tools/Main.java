package org.tools;

import ch.qos.logback.core.encoder.EchoEncoder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableScheduling
public class Main implements CommandLineRunner {
    @Autowired
    ProductService productService;

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

    }


    @Scheduled(fixedRate = 60000, initialDelayString = "#{ T(java.lang.Math).round(T(java.lang.Math).random() * 120000) }")    public void PullData(){
        EbayProduct product = Retreiveinfo(productService.GetProductWithMissingBuyButton());
        if(product == null) System.out.println("Up to date.");
        if(product == null) return;
        productService.SaveProduct(product);
        System.out.println("Product: " + product.getId() + ", Updated Successfully.");
    }

    EbayProduct Retreiveinfo(EbayProduct product){
        try{
            Document doc = Jsoup.connect(product.getUrl())
                    .userAgent("Mozilla/5.0")
                    .get();
            Elements pics = doc.getElementsByClass("ux-image-filmstrip-carousel-item");
            List<String> links = new ArrayList<>();
            pics.forEach(x -> links.add(x.getElementsByTag("img").first().attr("src")));

            List<String> scaled = new ArrayList<>();

            links.forEach(link -> {
                scaled.add(link.replaceAll("l64", "l1600"));
            });

            List<String> imgs = new ArrayList<>();
            imgs = scaled.stream().map(pic -> GetImage(pic, product.getId().toString())).collect(Collectors.toList());
            product.setPics(imgs);

            String buyButtonUrl = product.getUrl();
            String offerButtonUrl = product.getUrl();
            String description = "Description Not Available";
            try{
                buyButtonUrl = doc.getElementById("binBtn_btn_1").attr("href");
            }catch (Exception e){
                System.out.println("Error getting buy button url for product: " + product.getId());
            }

            try {
                offerButtonUrl = doc.getElementById("boBtn_btn").attr("href");
            }catch (Exception e){
                System.out.println("Error getting offer button url for product: " + product.getId());
            }

            try {
                description = doc.getElementsByAttribute("property").get(1).attr("content");
            }catch (Exception e){
                System.out.println("Error getting description for product: " + product.getId());
            }



            product.setBuyUrl(buyButtonUrl);
            product.setOfferUrl(offerButtonUrl);
            product.setDescription(description);

        }catch (Exception e){
            System.out.println(e);
        }
        return product;
    }

    static String GetImage(String url, String directory){
        String result = "";
        try {
            URL u = new URL(url);
            URLConnection connection = u.openConnection();
            try(InputStream stream = connection.getInputStream()){
                String[] splitUrl = url.split(("/"));
                String fileName = splitUrl[splitUrl.length-2] + splitUrl[splitUrl.length-1];
                Path directoryPath = Path.of("/home/melmatary/Desktop/usedtooling/images", directory);
                Files.createDirectories(directoryPath);
                Path destination = directoryPath.resolve(fileName);
                Files.copy(stream, destination, StandardCopyOption.REPLACE_EXISTING);
                result = destination.toString();
            }

        } catch (Exception e) {
            throw new RuntimeException("ERROR MESSAGE: " + e);
        }

        return result;
    }
}