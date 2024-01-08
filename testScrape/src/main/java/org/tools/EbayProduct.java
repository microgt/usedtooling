package org.tools;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cascade;

import java.util.ArrayList;
import java.util.List;

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

    //to be removed later
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String image;


    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String price;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String url;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String buyUrl;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String offerUrl;
    @Getter@Setter
    @ElementCollection
    @Column(columnDefinition = "VARCHAR(999)")
    @Cascade(value = org.hibernate.annotations.CascadeType.ALL)
    private List<String> pics;
    @Getter@Setter
    @Column(columnDefinition = "VARCHAR(999)")
    private String description;

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
