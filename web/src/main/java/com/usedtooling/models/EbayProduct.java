package com.usedtooling.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "Products")
public class EbayProduct {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Getter
    private Long id;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String title;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String image;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String price;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String url;

    @Override
    public int hashCode() {
        return this.getUrl().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == null || !(obj instanceof EbayProduct)) return false;
        EbayProduct ebayProduct = (EbayProduct) obj;
        return ebayProduct.getUrl().equals(this.getUrl());
    }
}
