package com.usedtooling.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Entity
public class View {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter@Setter
    private Long id;
    @Getter@Setter
    private String lon = null;
    @Getter@Setter
    private String lat = null;
    @Getter@Setter
    private String url;
    @Getter@Setter
    private String agent;
    @Getter@Setter
    private String ip;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @Getter@Setter
    private User user = null;
    @Getter@Setter
    private LocalDateTime dateTime;
}
