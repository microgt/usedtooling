package com.usedtooling.models;

import lombok.Getter;
import lombok.Setter;

public class ProductInfo {
    @Getter@Setter
    private String description;
    @Getter@Setter
    private String buyButtonUrl;
    @Getter@Setter
    private String addToCartButtonUrl;
    @Getter@Setter
    private String makeOfferButtonUrl;
}
