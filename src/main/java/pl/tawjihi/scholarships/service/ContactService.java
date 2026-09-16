package pl.tawjihi.scholarships.service;

import pl.tawjihi.scholarships.entity.ContactMessage;

public interface ContactService {
    ContactMessage submit(ContactMessage message);
}
