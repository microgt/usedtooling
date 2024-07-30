package com.usedtooling.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.usedtooling.models.User;
import com.usedtooling.models.UserRoles;
import com.usedtooling.models.View;
import com.usedtooling.services.UserService;
import com.usedtooling.services.ViewService;
import com.usedtooling.utils.EncryptionHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ViewController {
    private LocalDateTime callTimeStamp = LocalDateTime.now();
    private String lastIpCall = "";
    @Autowired
    private ViewService viewService;
    @Autowired
    private UserService userService;



    @Transactional
    @PostMapping("/views")
    public Optional<List<View>> getAllViews(@RequestParam String token, @RequestParam String user, @RequestParam String date, @RequestParam String dateTo){

        if(token == null || token.isEmpty() || token.isBlank() || token.equals("undefined") || user == null || user.isEmpty() || user.isBlank() || user.equals("null") || user.equals("undefined")) return Optional.empty();
        User u = null;
        User u2 = null;
        String decodedToken = new String(Base64.getDecoder().decode(token));
        String username = EncryptionHelper.Decrypt(decodedToken);
        try {
            u = userService.findByUserName(user);
            u2 = userService.findByUserName(username);
        } catch (Exception e) {
            return Optional.empty();
        }

        if(!u.getUserName().equals(u2.getUserName()) || u.getRole() != UserRoles.OWNER) return Optional.empty();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime requestedDate = LocalDateTime.parse(date + "T12:34:56", formatter);
        LocalDateTime requestedDateTo = LocalDateTime.parse(dateTo + "T12:34:56", formatter);

        Optional<List<View>> views = viewService.findViewsByDate(requestedDate, requestedDateTo);
        return Optional.of(views.orElse(new ArrayList<>()).stream()
                .filter(v -> !v.getAgent().toLowerCase().contains("bot") && !v.getAgent().toLowerCase().contains(".com"))
                .toList());
    }



    @Transactional
    @PostMapping("/registerview")
    public ResponseEntity<View> registerView(@RequestParam String lon
            , @RequestParam String lat
            , @RequestParam String url
            , @RequestParam String agent
            , @RequestParam String ip
            , @RequestParam String user
            , HttpServletRequest request){
        View view = new View();

        if(user != null && !user.isEmpty() && !user.isBlank() && !user.equals("undefined") && !user.equals("null")) {
            try {
                view.setUser(userService.findByUserName(user));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        view.setUrl(url);
        view.setAgent(agent);
        view.setIp(ip);
        view.setDateTime(LocalDateTime.now());

        HashMap<String, String> location = getLocationInfo(ip);

        if(lon != null && !lon.isEmpty() && !lon.isBlank() && !lon.equals("undefined") && !lon.equals("null")){
            view.setLon(lon);
        }else{
            view.setLon(location.get("lon"));
        }
        if(lat != null && !lat.isEmpty() && !lat.isBlank() && !lat.equals("undefined") && !lat.equals("null") ){
            view.setLat(lat);
        }else {
            view.setLat(location.get("lat"));
        }

        view.setCountry(location.get("country"));
        view.setRegionName(location.get("regionName"));
        view.setCity(location.get("city"));
        view.setZip(location.get("zip"));

        boolean save = !view.getIp().equals(lastIpCall) || timeCheckUtility(view.getDateTime(), callTimeStamp);
        callTimeStamp = view.getDateTime();
        lastIpCall = ip;
        if(save){
            view = viewService.saveView(view);
        }
        return new ResponseEntity<View>(view, HttpStatus.OK);
    }

    private boolean timeCheckUtility(LocalDateTime from, LocalDateTime to){
        ZonedDateTime viewTimeZone = from.atZone(ZoneId.of("America/Chicago"));
        ZonedDateTime callTimeZone = to.atZone(ZoneId.of("America/Chicago"));
       return viewTimeZone.toInstant().toEpochMilli() - callTimeZone.toInstant().toEpochMilli() > 1000;
    }

    public HashMap<String, String> getLocationInfo(String ip){
        HashMap<String, String> result = new HashMap<>();
        String url = "http://ip-api.com/json/" + ip;

        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            result.put("lon",jsonNode.path("lat").asText());
            result.put("lat",jsonNode.path("lon").asText());
            result.put("country",jsonNode.path("country").asText());
            result.put("regionName",jsonNode.path("regionName").asText());
            result.put("city",jsonNode.path("city").asText());
            result.put("zip",jsonNode.path("zip").asText());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return result;
    }
}
