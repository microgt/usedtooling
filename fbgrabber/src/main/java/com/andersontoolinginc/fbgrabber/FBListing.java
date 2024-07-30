package com.andersontoolinginc.fbgrabber;

public class FBListing {
    private long id;
    private String title;
    private String price;
    private String description;

    public FBListing(String title, String price, String description){
        this.title = title;
        this.price = price;
        this.description = description;
    }

    public String getTitle(){
        return title;
    }
    public String getPrice(){
        return price;
    }
    public String getDescription(){
        return description;
    }
}
