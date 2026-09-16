package pl.tawjihi.scholarships.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.tawjihi.scholarships.entity.ContactMessage;
import pl.tawjihi.scholarships.repository.ContactMessageRepository;
import pl.tawjihi.scholarships.service.ContactService;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository repository;

    @Override
    public ContactMessage submit(ContactMessage message) {
        return repository.save(message);
        // Hook a notification (email/Slack/Telegram bot) here if desired.
    }
}
