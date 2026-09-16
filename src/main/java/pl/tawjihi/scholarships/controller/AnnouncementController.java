package pl.tawjihi.scholarships.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.tawjihi.scholarships.entity.Announcement;
import pl.tawjihi.scholarships.service.AnnouncementService;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService service;

    @GetMapping
    public List<Announcement> list() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<Announcement> create(@Valid @RequestBody Announcement announcement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(announcement));
    }

    @PutMapping("/{id}")
    public Announcement update(@PathVariable Long id, @Valid @RequestBody Announcement announcement) {
        return service.update(id, announcement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
