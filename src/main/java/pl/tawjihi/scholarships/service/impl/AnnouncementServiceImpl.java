package pl.tawjihi.scholarships.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.tawjihi.scholarships.entity.Announcement;
import pl.tawjihi.scholarships.exception.ResourceNotFoundException;
import pl.tawjihi.scholarships.repository.AnnouncementRepository;
import pl.tawjihi.scholarships.service.AnnouncementService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository repository;

    @Override
    public List<Announcement> findAll() {
        return repository.findAllByOrderByPublishedAtDesc();
    }

    @Override
    public Announcement create(Announcement announcement) {
        return repository.save(announcement);
    }

    @Override
    public Announcement update(Long id, Announcement incoming) {
        Announcement existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found: " + id));
        existing.setTitle(incoming.getTitle());
        existing.setBody(incoming.getBody());
        existing.setUrgent(incoming.isUrgent());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found: " + id);
        }
        repository.deleteById(id);
    }
}
