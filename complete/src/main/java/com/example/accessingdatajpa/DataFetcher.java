package com.example.accessingdatajpa;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DataFetcher {
    public static List<EbayProduct> FetchProducts(){
        List<EbayProduct> listings = new ArrayList<EbayProduct>();
        int index = 1;
        Document doc;
        Elements products;
        try{
            doc = //Jsoup.connect("https://www.ebay.com/sch/i.html?_dkr=1&iconV2Request=true&_blrs=recall_filtering&_ssn=tooled_ati&store_cat=0&store_name=andersontoolinginc2&_oac=1&_ipg=240&_sop=10&_pgn=1" + index)
            Jsoup.connect("https://www.ebay.com/str/andersontoolinginc2?_sop=10&_ipg=100")
            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                    .header("Accept-Language", "*")
                    .get();

            int total = Integer.parseInt(doc.getElementsByClass("str-search__input").first().attr("placeholder").replaceAll("[^0-9]", ""));

            products = doc.getElementsByClass("s-item__wrapper clearfix");

            int pages = total/240;

            for(int i = 0; i < 1; i++){

                doc = Jsoup.connect("https://www.ebay.com/sch/i.html?_dkr=1&iconV2Request=true&_blrs=recall_filtering&_ssn=tooled_ati&store_cat=0&store_name=andersontoolinginc2&_oac=1&_ipg=240&_sop=10&_pgn=" + (index+i))
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                        .header("Accept-Language", "*")
                        .get();
                products = doc.getElementsByClass("s-item__wrapper clearfix");

                for(Element product : products){
                    EbayProduct p = new EbayProduct();
                    p.setImage(product.select("img").attr("src"));
                    p.setTitle(product.getElementsByClass("s-item__title").first().select("span").text().replaceAll("(?i)new\\s*listing|used", ""));
                    p.setPrice(product.getElementsByClass("s-item__price").first().text());
                    p.setUrl(product.getElementsByClass("s-item__link").attr("href"));
                    listings.add(p);
                }
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return listings;
    }
}
