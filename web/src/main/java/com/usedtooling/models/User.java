package com.usedtooling.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter@Setter
    private Long id;
    @Getter@Setter
    private String firstName;
    @Getter@Setter
    private String lastName;
    @Getter@Setter
    private String userName;
    @Getter@Setter
    private String email;
    @Getter@Setter
    private String phone;
    @Getter@Setter
    private String password;
    @Getter@Setter
    private UserRoles role;

    public User(String firstName, String lastName, String userName, String email, String phone, String password, UserRoles role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }
}
