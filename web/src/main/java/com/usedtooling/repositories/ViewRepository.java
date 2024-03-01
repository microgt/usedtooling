package com.usedtooling.repositories;

import com.usedtooling.models.View;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViewRepository extends CrudRepository<View, Long> {

    List<View> findByDateTimeBetween (LocalDateTime start, LocalDateTime end);
}
