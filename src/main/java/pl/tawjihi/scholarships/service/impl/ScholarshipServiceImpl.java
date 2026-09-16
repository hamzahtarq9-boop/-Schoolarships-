package pl.tawjihi.scholarships.service.impl;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.tawjihi.scholarships.entity.Scholarship;
import pl.tawjihi.scholarships.exception.ResourceNotFoundException;
import pl.tawjihi.scholarships.repository.ScholarshipRepository;
import pl.tawjihi.scholarships.service.ScholarshipService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScholarshipServiceImpl implements ScholarshipService {

    private final ScholarshipRepository repository;

    @Override
    public List<Scholarship> findAll(String degreeLevel, String country, String coverageType, String q) {
        Specification<Scholarship> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (degreeLevel != null && !degreeLevel.isBlank() && !degreeLevel.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("degreeLevel"), degreeLevel));
            }
            if (country != null && !country.isBlank() && !country.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("country"), country));
            }
            if (coverageType != null && !coverageType.isBlank() && !coverageType.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("coverageType"), coverageType));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("university")), like),
                        cb.like(cb.lower(root.get("country")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return repository.findAll(spec);
    }

    @Override
    public Optional<Scholarship> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Scholarship create(Scholarship scholarship) {
        return repository.save(scholarship);
    }

    @Override
    public Scholarship update(Long id, Scholarship incoming) {
        Scholarship existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found: " + id));

        existing.setTitle(incoming.getTitle());
        existing.setUniversity(incoming.getUniversity());
        existing.setCountry(incoming.getCountry());
        existing.setDegreeLevel(incoming.getDegreeLevel());
        existing.setCoverageType(incoming.getCoverageType());
        existing.setDeadline(incoming.getDeadline());
        existing.setImageUrl(incoming.getImageUrl());
        existing.setCriteria(incoming.getCriteria());
        existing.setBenefits(incoming.getBenefits());
        existing.setApplyUrl(incoming.getApplyUrl());
        existing.setFeatured(incoming.isFeatured());

        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Scholarship not found: " + id);
        }
        repository.deleteById(id);
    }
}
