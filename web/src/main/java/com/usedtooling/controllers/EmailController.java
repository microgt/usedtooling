package com.usedtooling.controllers;

import com.usedtooling.models.ContactForm;
import com.usedtooling.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class EmailController {
    @Autowired
    private EmailService emailService;
    @CrossOrigin(origins = "*")
    @PostMapping("/sendMessage")
    public ResponseEntity<String> home(@RequestBody ContactForm formData){
        try {
            emailService.sendEmail(formData.getContact(), formData.getSubject(), formData.getMessage(), formData.getName());

            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{There was a problem sending your message, please try again later.}" + e.getMessage());
        }
    }
}
