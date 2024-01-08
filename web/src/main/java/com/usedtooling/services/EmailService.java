package com.usedtooling.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    public void sendEmail(String contact, String subject, String body, String from){
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo("usedtooling.fairfield@gmail.com");
        email.setSubject(subject + ", From: " + from + ", @: " + contact);
        email.setText(body);

        mailSender.send(email);
    }
}
