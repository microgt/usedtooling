package com.usedtooling.services;

import com.usedtooling.models.View;
import com.usedtooling.repositories.ViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ViewService {
    @Autowired
    private ViewRepository viewRepository;

    public View saveView(View view){
        return viewRepository.save(view);
    }
    public Optional<List<View>> findViewsByDate(LocalDateTime date, LocalDateTime dateTo){
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = dateTo.toLocalDate().atTime(23, 59, 59);
        return Optional.of((List<View>) viewRepository.findByDateTimeBetween(startOfDay, endOfDay));
    }

    public Optional<List<View>> findAllViews(){
        return Optional.of((List<View>) viewRepository.findAll());
    }
}
