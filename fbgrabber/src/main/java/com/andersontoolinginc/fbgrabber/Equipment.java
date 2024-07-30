package com.andersontoolinginc.fbgrabber;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cascade;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "equipment")
@NoArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Getter@Setter
    private Long id;
    @Column(columnDefinition = "VARCHAR(999)")
    @Getter@Setter
    private String name;
    @Column(columnDefinition = "VARCHAR(999)")
    @Getter@Setter
    @Convert(converter = EquipmentCategoriesAttributeConverter.class)
    private EquipmentCategories category;
    @Column(columnDefinition = "VARCHAR(999)")
    @Getter@Setter
    private String description;
    @Column(columnDefinition="tinyint(1) default 0")
    @Getter@Setter
    private boolean isFBListing;
    @Getter@Setter
    private double price;
    @Getter@Setter
    @ElementCollection
    @Column(columnDefinition = "VARCHAR(999)")
    @Cascade(value = org.hibernate.annotations.CascadeType.ALL)
    private List<String> pictures;

    public Equipment(String name, EquipmentCategories category, String description, double price, boolean isFBListing){
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.isFBListing = isFBListing;
    }

    @Override
    public boolean equals(Object obj){
        if(obj == null) return false;
        if(!(obj instanceof Equipment)) return false;
        Equipment e = (Equipment) obj;
        if(e.getName().equals(getName())
        && e.getPrice() == getPrice()
        && e.getCategory() == getCategory()) return true;

        return false;
    }

    @Override
    public int hashCode(){
        return Objects.hash(getName(), getPrice(), getCategory());
    }
}
