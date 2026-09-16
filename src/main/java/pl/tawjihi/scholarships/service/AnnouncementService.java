package pl.tawjihi.scholarships.service;

import pl.tawjihi.scholarships.entity.Announcement;

import java.util.List;

public interface AnnouncementService {
    List<Announcement> findAll();
    Announcement create(Announcement announcement);
    Announcement update(Long id, Announcement announcement);
    void delete(Long id);
}
