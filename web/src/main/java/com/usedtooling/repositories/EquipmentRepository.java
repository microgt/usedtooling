package com.usedtooling.repositories;

import com.usedtooling.models.EbayProduct;
import com.usedtooling.models.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends CrudRepository<Equipment, Long> {
    Page<Equipment> findAll(Pageable pageable);
    List<Equipment> findByNameContainingIgnoreCase(String name);
}
