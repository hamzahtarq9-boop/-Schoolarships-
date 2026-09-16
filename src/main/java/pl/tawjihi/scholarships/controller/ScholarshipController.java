package pl.tawjihi.scholarships.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.tawjihi.scholarships.entity.Scholarship;
import pl.tawjihi.scholarships.exception.ResourceNotFoundException;
import pl.tawjihi.scholarships.service.ScholarshipService;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
public class ScholarshipController {

    private final ScholarshipService service;

    @GetMapping
    public List<Scholarship> list(
            @RequestParam(required = false) String degreeLevel,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String coverageType,
            @RequestParam(required = false) String q) {
        return service.findAll(degreeLevel, country, coverageType, q);
    }

    @GetMapping("/{id}")
    public Scholarship getOne(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found: " + id));
    }

    // Admin-only (protected by SecurityConfig: any non-GET request requires a valid JWT)
    @PostMapping
    public ResponseEntity<Scholarship> create(@Valid @RequestBody Scholarship scholarship) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(scholarship));
    }

    @PutMapping("/{id}")
    public Scholarship update(@PathVariable Long id, @Valid @RequestBody Scholarship scholarship) {
        return service.update(id, scholarship);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
