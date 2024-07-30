package com.andersontoolinginc.fbgrabber;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends CrudRepository<Equipment, Long> {
    Page<Equipment> findAll(Pageable pageable);
    List<Equipment> findByNameContainingIgnoreCase(String name);
}
