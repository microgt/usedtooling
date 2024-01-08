package com.usedtooling.models;

import lombok.Getter;
import lombok.Setter;

public class ContactForm {
    @Getter
    @Setter
    private String name;
    @Getter
    @Setter
    private String contact;
    @Getter
    @Setter
    private String subject;
    @Getter
    @Setter
    private String message;
}
