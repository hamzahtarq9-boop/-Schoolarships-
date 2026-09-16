package pl.tawjihi.scholarships.service;

import pl.tawjihi.scholarships.entity.Scholarship;

import java.util.List;
import java.util.Optional;

public interface ScholarshipService {
    List<Scholarship> findAll(String degreeLevel, String country, String coverageType, String q);
    Optional<Scholarship> findById(Long id);
    Scholarship create(Scholarship scholarship);
    Scholarship update(Long id, Scholarship scholarship);
    void delete(Long id);
}
