package com.usedtooling.controllers;

import com.usedtooling.models.Equipment;
import com.usedtooling.models.EquipmentCategories;
import com.usedtooling.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.util.Optionals;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EquipmentController {

    private static final String UPLOAD_DIR = "../equipmentpictures/";

    @Autowired
    EquipmentService equipmentService;

    @GetMapping("/allequipment")
    public Optional<List<Equipment>> AllEquipment(@RequestParam(defaultValue = "0") String start, @RequestParam(defaultValue = "10") String end){
        return Optional.of(equipmentService.getAllEquipment(Integer.parseInt(start), Integer.parseInt(end)).getContent());
    }

    @GetMapping("/esearch")
    public Optional<List<Equipment>> SearchEquipment(@RequestParam(defaultValue = "") String esterm, @RequestParam(defaultValue = "ALL") String cterm, @RequestParam(defaultValue = "datenew") String sort){
        List<Equipment> result = new ArrayList<>();
        if(!esterm.isBlank() && !esterm.isEmpty()){
            System.out.println("HERE");
            try{
                long sku = Long.parseLong(esterm);
                result.add(equipmentService.getEqipmentById(sku));
            }catch (Exception e){
                result = equipmentService.getEquipmentByName(esterm);
            }
            if(!cterm.equals("ALL"))  result = result.stream().filter(eq -> eq.getCategory() == EquipmentCategories.valueOf(cterm)).collect(Collectors.toList());
        }else{
            if(!cterm.equals("ALL")){
                result = equipmentService.getAllEquipment(0, 999999).getContent().stream().filter(eq -> eq.getCategory() == EquipmentCategories.valueOf(cterm)).collect(Collectors.toList());
            }else{
                result = equipmentService.getAllEquipment(0, 999999).getContent();
            }
        }

        List<Equipment> mutalbeList = new ArrayList<>(result);
        switch (sort){
            case "datenew":
                mutalbeList.sort(Comparator.comparingLong(Equipment::getId));
                break;
            case "dateold":
                mutalbeList.sort(Comparator.comparingLong(Equipment::getId).reversed());
                break;
            case "pricelow":
                mutalbeList.sort(Comparator.comparingDouble(Equipment::getPrice));
                break;
            case "pricehigh":
                mutalbeList.sort(Comparator.comparingDouble(Equipment::getPrice).reversed());
                break;
            case "alphaa":
                mutalbeList.sort(Comparator.comparing(Equipment::getName).reversed());
                break;
            case "alphaz":
                mutalbeList.sort(Comparator.comparing(Equipment::getName));
                break;
        }
        return Optional.ofNullable(mutalbeList);
    }

    @GetMapping("/elist")
    public Optional<List<Equipment>> AllEquipment(){
        return equipmentService.allequipment();
    }

    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("/addequipment")
    public String AddProduct(@RequestParam(defaultValue = "") String id,@RequestParam String name, @RequestParam String description, @RequestParam String category, @RequestParam String price, @RequestParam("pics") List<MultipartFile> pics){

        Equipment equipment = new Equipment(name, EquipmentCategories.valueOf(category.toUpperCase().replace(" ", "_")),description, Double.parseDouble(price));

        long existingId = 0;
        if(!id.isEmpty() && !id.isBlank()) {
            existingId = Long.parseLong(id);
            equipment.setId(existingId);
        }

        List<String> pictures =  SaveImages(String.valueOf(existingId != 0? existingId : equipment.hashCode())
                ,pics);
        equipment.setPictures(pictures);
        return equipmentService.SaveEquipment(equipment, existingId == 0);
    }

    public List<String> SaveImages(String subDirectoryName, List<MultipartFile> images){
        List<String> results = new ArrayList<>();
        File uploadDir = new File("/home/melmatary/Desktop/usedtooling/equipmentpictures/" +subDirectoryName);
        if(!uploadDir.exists()) uploadDir.mkdir();
        images.forEach(image ->{
            Path filePath = Path.of(uploadDir + "/" + image.getOriginalFilename());
            try {
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            results.add(filePath.toString());
        });
        return results;
    }
    @GetMapping("/loadimg")
    public ResponseEntity<byte[]> getImage(@RequestParam String imageurl) throws IOException{
        Resource resource = new FileSystemResource(imageurl);

        if (resource.exists()) {
            byte[] fileBytes = Files.readAllBytes(resource.getFile().toPath());

            // Get the file extension
            String fileExtension = getFileExtension(imageurl);

            // Set the content type based on the file extension
            MediaType contentType = getContentType(fileExtension);

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(fileBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
    private MediaType getContentType(String fileExtension) {
        switch (fileExtension.toLowerCase()) {
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG;
            case "png":
                return MediaType.IMAGE_PNG;
            case "gif":
                return MediaType.IMAGE_GIF;
            case "mp4":
                return MediaType.valueOf("video/mp4");
            case "webm":
                return MediaType.valueOf("video/webm");
            // Add more cases for other video formats if needed
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    @PostMapping("/deleteequipment")
    public String deleteEquipment(@RequestParam String eid){
        return equipmentService.deleteEquipment(eid);
    }

}
