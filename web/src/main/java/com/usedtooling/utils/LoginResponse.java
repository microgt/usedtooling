package com.usedtooling.utils;

import com.usedtooling.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

@AllArgsConstructor
public class LoginResponse {
    @Getter@Setter
    private String token;
    @Getter@Setter
    private String message;
    @Getter@Setter
    private String url;
    @Getter@Setter
    private User user;
}
