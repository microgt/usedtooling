package com.usedtooling.services;

import com.usedtooling.models.EbayProduct;
import com.usedtooling.models.Equipment;
import com.usedtooling.repositories.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    public Page<Equipment> getAllEquipment(int start, int limit){
        Pageable pageable = PageRequest.of(start,limit, Sort.by(Sort.Direction.DESC, "id"));
        return equipmentRepository.findAll(pageable);
    }

    public Equipment getEqipmentById(long id){
        return equipmentRepository.findById(id).get();
    }
    public List<Equipment> getEquipmentByName(String name){
        return equipmentRepository.findByNameContainingIgnoreCase(name);
    }
    public String SaveEquipment(Equipment equipment, boolean newItem){
        String result = "Equipment Added Successfully";
        try{
            equipmentRepository.save(equipment);
            if(!newItem) result = "Equipment Updated Successfully";
        }catch (Exception e){
            result = "There was a problem completing your request, please try again later.";
        }
        return result;
    }

    public Optional<List<Equipment>> allequipment(){
        List<Equipment> eq = new ArrayList<>();
        equipmentRepository.findAll().forEach(x -> eq.add(x));
        return Optional.of(eq);
    }

    public String deleteEquipment(String id){
        String result = "Equipment Removed";
        try {
            equipmentRepository.deleteById(Long.parseLong(id));
        }catch (Exception e){
            result = "Failed To Remove: " + e.getMessage();
        }
        return  result;
    }

}
